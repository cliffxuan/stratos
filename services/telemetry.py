from __future__ import annotations

import asyncio
import logging
import math
import time
from typing import Any
import httpx

logger = logging.getLogger("stratos.telemetry")

NOAA_F107_URL = "https://services.swpc.noaa.gov/json/f107_cm_flux.json"
NOAA_KP_URL = "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"
NOAA_PROTON_URL = "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-plot-6-hour.json"

CACHE_TTL_SECONDS = 300.0  # 5 minutes cache

_cache: dict[str, Any] = {
    "last_fetch": 0.0,
    "f107_flux": 145.2,
    "kp_index": 2.4,
    "kp_status": "Quiet / Low Hazard",
    "proton_flux_gt_10mev": 1.25,
    "proton_flux_status": "Nominal GCR Baseline",
    "solar_constant_am0": 1361.0,
    "seu_mtbf_hours_100_gpu": 142.0,
    "radiation_dose_ugy_hr": 24.5,
    "orbital_drag_multiplier": 1.05,
}


async def fetch_noaa_telemetry() -> dict[str, Any]:
    global _cache
    now = time.time()
    if now - _cache["last_fetch"] < CACHE_TTL_SECONDS:
        return _cache

    async with httpx.AsyncClient(timeout=4.0) as client:
        # 1. Fetch F10.7 cm Solar Radio Flux
        try:
            r = await client.get(NOAA_F107_URL)
            if r.status_code == 200:
                data = r.json()
                if data and isinstance(data, list):
                    last = data[-1]
                    flux = float(last.get("flux", 145.0))
                    if flux > 0:
                        _cache["f107_flux"] = round(flux, 1)
        except Exception as e:
            logger.warning(f"NOAA F10.7 fetch error: {e}")

        # 2. Fetch Planetary Kp Geomagnetic Index
        try:
            r = await client.get(NOAA_KP_URL)
            if r.status_code == 200:
                data = r.json()
                if data and isinstance(data, list):
                    last = data[-1]
                    kp = float(last.get("kp_index", last.get("estimated_kp", 2.0)))
                    _cache["kp_index"] = round(kp, 1)
                    if kp < 3:
                        _cache["kp_status"] = "Quiet / Low Hazard"
                    elif kp < 5:
                        _cache["kp_status"] = "Unsettled / Moderate"
                    elif kp < 7:
                        _cache["kp_status"] = "Minor / Moderate Storm (G1-G2)"
                    else:
                        _cache["kp_status"] = "Severe Solar Storm (G3-G5)"
        except Exception as e:
            logger.warning(f"NOAA Kp fetch error: {e}")

        # 3. Fetch GOES Proton Flux
        try:
            r = await client.get(NOAA_PROTON_URL)
            if r.status_code == 200:
                data = r.json()
                if data and isinstance(data, list):
                    for item in reversed(data):
                        if item.get("energy") == ">=10 MeV":
                            flux_val = float(item.get("flux", 1.2))
                            _cache["proton_flux_gt_10mev"] = round(flux_val, 3)
                            if flux_val < 10:
                                _cache["proton_flux_status"] = "Quiet Baseline (S0)"
                            elif flux_val < 100:
                                _cache["proton_flux_status"] = "Minor Solar Particle Event (S1)"
                            else:
                                _cache["proton_flux_status"] = "Major Solar Radiation Storm (S2+)"
                            break
        except Exception as e:
            logger.warning(f"NOAA Proton fetch error: {e}")

    # Derived Real-Time Space Physics & Bit-Flip Calculations
    f107 = _cache["f107_flux"]
    kp = _cache["kp_index"]
    proton_flux = _cache["proton_flux_gt_10mev"]

    # Atmospheric scale height drag factor
    _cache["orbital_drag_multiplier"] = round(1.0 + (f107 - 100.0) * 0.005 + kp * 0.04, 3)

    # Dosimeter MTBF for 100-GPU cluster (SEU bit-flip hazard model)
    # Higher proton flux and high solar activity lowers MTBF
    hazard_multiplier = (1.0 + (proton_flux / 10.0)) * (1.0 + kp * 0.15)
    base_mtbf = 160.0  # nominal unshielded hours
    _cache["seu_mtbf_hours_100_gpu"] = round(base_mtbf / hazard_multiplier, 1)
    _cache["radiation_dose_ugy_hr"] = round(22.0 + kp * 1.5 + (proton_flux * 0.8), 2)
    _cache["last_fetch"] = now

    return _cache
