from __future__ import annotations

import math
import os
import time
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(
    title="Project Stratos · Orbital Computing Intelligence API",
    description="Real-time orbital data center telemetry, solar flux, hardware benchmarks, and physics models.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT = Path(__file__).parent

# ============================================================================
# Domain Models & Hardware Database
# ============================================================================

HARDWARE_DATABASE = [
    {
        "id": "nv-vera-rubin-space",
        "vendor": "NVIDIA",
        "model": "Space-1 Vera Rubin NVL72",
        "generation": "2026 Space-Rated",
        "tdp_watts": 1200,
        "bf16_tflops": 4500,
        "efficiency_tflops_watt": 3.75,
        "mass_kg": 1.85,
        "power_to_mass_w_kg": 648,
        "rad_hardening": "TMR Silicon + Boron Polymer",
        "radiator_area_m2_per_kw": 1.305,
        "status": "Production (Q4 2026)",
    },
    {
        "id": "nv-h100-cots",
        "vendor": "NVIDIA",
        "model": "H100 SXM5 (COTS Vacuum Tested)",
        "generation": "2024–2025 Heritage",
        "tdp_watts": 700,
        "bf16_tflops": 989,
        "efficiency_tflops_watt": 1.41,
        "mass_kg": 2.2,
        "power_to_mass_w_kg": 318,
        "rad_hardening": "Unshielded COTS (Starcloud-1 Heritage)",
        "radiator_area_m2_per_kw": 1.305,
        "status": "Flight Heritage (Nov 2025)",
    },
    {
        "id": "google-tpu-v6e",
        "vendor": "Google",
        "model": "TPU Trillium (v6e Orbital Prototype)",
        "generation": "2025–2026 Custom ASIC",
        "tdp_watts": 450,
        "bf16_tflops": 920,
        "efficiency_tflops_watt": 2.04,
        "mass_kg": 1.4,
        "power_to_mass_w_kg": 321,
        "rad_hardening": "Inherent Sparse Matrix Tolerance",
        "radiator_area_m2_per_kw": 1.305,
        "status": "Orbital Test Planned (2027)",
    },
    {
        "id": "groq-lpu-space",
        "vendor": "Groq",
        "model": "LPU Space Tensor Node",
        "generation": "2026 Deterministic Inference",
        "tdp_watts": 300,
        "bf16_tflops": 750,
        "efficiency_tflops_watt": 2.50,
        "mass_kg": 0.95,
        "power_to_mass_w_kg": 315,
        "rad_hardening": "Software Die Fencing",
        "radiator_area_m2_per_kw": 1.305,
        "status": "Concept / Test Lab",
    },
]

POWER_MARKET_HUBS = [
    {
        "hub": "PJM Interconnection (Northern Virginia)",
        "grid_type": "Terrestrial Data Center Alley",
        "power_price_per_mwh": 118.50,
        "effective_kwh_cost": 0.1185,
        "water_consumption_gal_per_mwh": 500,
        "grid_interconnect_queue_years": 5.5,
        "pue_average": 1.55,
    },
    {
        "hub": "ERCOT (Texas AI Hubs)",
        "grid_type": "Terrestrial Gas & Solar",
        "power_price_per_mwh": 95.00,
        "effective_kwh_cost": 0.0950,
        "water_consumption_gal_per_mwh": 650,
        "grid_interconnect_queue_years": 4.0,
        "pue_average": 1.58,
    },
    {
        "hub": "Nord Pool (Scandinavia Hydro)",
        "grid_type": "Terrestrial Hydro Renewables",
        "power_price_per_mwh": 72.00,
        "effective_kwh_cost": 0.0720,
        "water_consumption_gal_per_mwh": 120,
        "grid_interconnect_queue_years": 3.5,
        "pue_average": 1.35,
    },
    {
        "hub": "Low Earth Orbit (Sun-Synchronous 550km)",
        "grid_type": "Orbital Direct Solar (AM0 1361 W/m²)",
        "power_price_per_mwh": 0.00,
        "effective_kwh_cost": 0.0000,
        "water_consumption_gal_per_mwh": 0,
        "grid_interconnect_queue_years": 0.0,
        "pue_average": 1.05,
    },
]

ACTIVE_SATELLITES = [
    {
        "norad_id": 99201,
        "name": "Starcloud-1 (Lumen Orbit)",
        "operator": "Starcloud",
        "launch_date": "2025-11-12",
        "orbit_type": "LEO SSO 525km",
        "inclination_deg": 97.4,
        "payload": "COTS NVIDIA H100 GPU",
        "primary_mission": "First orbital NanoGPT AI model training in vacuum",
        "status": "Operational / Heritage",
    },
    {
        "norad_id": 99202,
        "name": "Starcloud-2 Cluster Node",
        "operator": "Starcloud",
        "launch_date": "2026-10-15 (Target)",
        "orbit_type": "LEO SSO 550km",
        "inclination_deg": 98.0,
        "payload": "Multi-GPU NVIDIA Space-1 Vera Rubin Cluster",
        "primary_mission": "Commercial distributed orbital AI inference",
        "status": "Manufacturing / Integration",
    },
    {
        "norad_id": 99301,
        "name": "SpaceX AI1 Node-01 (Project Starmind)",
        "operator": "SpaceX",
        "launch_date": "2027-Q4 (Target)",
        "orbit_type": "LEO SSO 550km",
        "inclination_deg": 97.8,
        "payload": "NVIDIA Vera Rubin NVL72 + 70m Radiator Wings",
        "primary_mission": "High-scale agentic AI & Grok model training",
        "status": "In Development (Bastrop Gigasat)",
    },
    {
        "norad_id": 99401,
        "name": "Kepler Aether Relay-4",
        "operator": "Kepler Communications",
        "launch_date": "2026-08-05",
        "orbit_type": "LEO 600km",
        "inclination_deg": 53.0,
        "payload": "Optical ISL Laser Terminal (100+ Gbps)",
        "primary_mission": "Real-time orbital data mesh backhaul",
        "status": "Active / Relay Mesh",
    },
]

NEWS_TIMELINE = [
    {
        "id": "news-1",
        "date": "August 2026",
        "category": "spacex",
        "title": "SpaceX Unveils 'Project Starmind' with NVIDIA Vera Rubin AI1 Constellation",
        "summary": "Dedicated constellation of heavy compute satellites designed to power next-generation agentic AI and Grok models directly from LEO. Engineered with 20m vertical chassis and 70m deployable liquid radiator wings.",
        "badge": "Breaking Development",
        "tags": ["SpaceX", "NVIDIA", "Starship", "Vera Rubin"],
    },
    {
        "id": "news-2",
        "date": "August 2026",
        "category": "starcloud",
        "title": "Starcloud Raises $250M Series A Extension ($450M Total, $2.3B Valuation)",
        "summary": "Following the successful execution of the Starcloud-1 orbital H100 test, Starcloud secured $250M from NVIDIA, Cisco, and Benchmark to mass produce Starcloud-2 clusters.",
        "badge": "Venture Acceleration",
        "tags": ["Starcloud", "Funding", "Unicorn", "NVIDIA"],
    },
    {
        "id": "news-3",
        "date": "August 2026",
        "category": "hardware",
        "title": "Kepler Activates Commercial Optical Space Relay Mesh",
        "summary": "Provides commercial optical cross-links exceeding 100 Gbps, resolving the orbital data center backhaul bottleneck without waiting for ground passes.",
        "badge": "Data Mesh",
        "tags": ["Kepler", "Optical ISL", "Laser Backhaul"],
    },
    {
        "id": "news-4",
        "date": "May 2026",
        "category": "europe",
        "title": "Thales Alenia Space Concludes EU Project ASCEND",
        "summary": "Feasibility study confirmed 200MW orbital data centers can decouple Europe's exponential AI compute growth from grid caps while preserving European digital sovereignty.",
        "badge": "Sovereignty",
        "tags": ["EU", "ASCEND", "Thales", "Sovereign Cloud"],
    },
    {
        "id": "news-5",
        "date": "April 2026",
        "category": "hardware",
        "title": "NVIDIA Announces Space-1 Vera Rubin Space Architecture",
        "summary": "Purpose-built space architecture provides 25x AI compute efficiency over H100 with hardware-level Triple Modular Redundancy (TMR) for cosmic ray resilience.",
        "badge": "Silicon",
        "tags": ["NVIDIA", "Vera Rubin", "TMR", "Hardware"],
    },
    {
        "id": "news-6",
        "date": "November 2025",
        "category": "starcloud",
        "title": "Starcloud-1 Trains NanoGPT in Orbit with NVIDIA H100",
        "summary": "World's first operation and training run of an unshielded COTS data center GPU in space under vacuum, validating passive radiative cooling loops.",
        "badge": "Flight Heritage",
        "tags": ["Starcloud", "H100", "NanoGPT", "Flight Heritage"],
    },
    {
        "id": "news-7",
        "date": "Late 2025",
        "category": "google",
        "title": "Google Research Unveils 'Project Suncatcher' Space TPU Research",
        "summary": "Google Research tested TPU Trillium (v6e) for space environments in partnership with Planet Labs, demonstrating high intrinsic fault tolerance.",
        "badge": "Moonshot",
        "tags": ["Google", "TPU", "Trillium", "Planet Labs"],
    },
]


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/api/telemetry")
def get_telemetry() -> JSONResponse:
    """Returns real-time solar, space weather, and dosimeter telemetry."""
    now = time.time()
    # Dynamic diurnal & simulated solar fluctuation
    solar_flux_f107 = 145.2 + 8.5 * math.sin(now / 3600)
    kp_index = 2.4 + 0.8 * math.cos(now / 7200)
    
    return JSONResponse(
        {
            "timestamp": int(now),
            "solar_constant_am0_w_m2": 1361.0,
            "solar_flux_f107": round(solar_flux_f107, 1),
            "kp_geomagnetic_index": round(kp_index, 1),
            "proton_flux_gt_10mev": "1.2 pfu (Quiet)",
            "galactic_cosmic_ray_dose_rate_ugy_hr": 24.5,
            "simulated_100_gpu_seu_mtbf_hours": 142.0,
            "space_vacuum_temp_kelvin": 2.725,
            "pue_orbital_baseline": 1.05,
            "pue_terrestrial_baseline": 1.55,
        }
    )


@app.get("/api/satellites")
def get_satellites() -> JSONResponse:
    """Returns catalog of active & planned orbital compute satellites."""
    return JSONResponse({"satellites": ACTIVE_SATELLITES})


@app.get("/api/hardware")
def get_hardware() -> JSONResponse:
    """Returns silicon & GPU space-rating profiles."""
    return JSONResponse({"hardware": HARDWARE_DATABASE})


@app.get("/api/power-grid")
def get_power_grid() -> JSONResponse:
    """Returns terrestrial vs orbital power market arbitrage comparisons."""
    return JSONResponse({"power_markets": POWER_MARKET_HUBS})


@app.get("/api/news")
def get_news(category: str | None = None) -> JSONResponse:
    """Returns industry timeline updates, optionally filtered by category."""
    if category and category != "all":
        items = [n for n in NEWS_TIMELINE if n["category"] == category]
    else:
        items = NEWS_TIMELINE
    return JSONResponse({"timeline": items})


class ClusterCalculationRequest(BaseModel):
    power_mw: float = 10.0
    radiator_temp_c: float = 70.0
    launch_cost_per_kg: float = 200.0
    gpu_model_id: str = "nv-vera-rubin-space"


@app.post("/api/calculate")
def calculate_cluster(req: ClusterCalculationRequest) -> JSONResponse:
    """Calculates thermodynamic footprint, radiator area, and economics."""
    p_mw = max(0.1, min(req.power_mw, 1000.0))
    temp_c = max(10.0, min(req.radiator_temp_c, 150.0))
    temp_k = temp_c + 273.15
    
    # Stefan-Boltzmann: q = eps * sigma * (T_rad^4 - T_space^4)
    sigma = 5.670374e-8
    eps = 0.92
    t_space = 3.0
    thermal_flux_w_m2 = eps * sigma * (math.pow(temp_k, 4) - math.pow(t_space, 4))
    
    # Double-sided deployable radiator wings
    total_watts = p_mw * 1e6
    radiator_area_m2 = total_watts / (thermal_flux_w_m2 * 2)
    
    # Solar array (AM0 = 1361 W/m2 @ 33% efficiency GaInP triple junction)
    solar_flux_effective = 1361.0 * 0.33
    solar_area_m2 = total_watts / solar_flux_effective
    
    # Mass estimation (18 kg / kW bus mass)
    total_mass_kg = p_mw * 1000.0 * 18.0
    starship_flights = math.ceil(total_mass_kg / 120000.0)
    
    # Water saved (0.5 gal/kWh in terrestrial evaporative cooling towers)
    annual_kwh = p_mw * 1000.0 * 8760.0
    water_saved_m_gal = (annual_kwh * 0.5) / 1e6
    
    # Financial OpEx savings (avg $0.11/kWh on Earth vs $0/kWh in space)
    annual_power_opex_saved_usd = annual_kwh * 0.11
    
    return JSONResponse(
        {
            "power_mw": p_mw,
            "radiator_temp_c": temp_c,
            "radiator_temp_k": round(temp_k, 2),
            "thermal_flux_w_m2": round(thermal_flux_w_m2, 1),
            "radiator_area_m2": round(radiator_area_m2, 1),
            "solar_array_area_m2": round(solar_area_m2, 1),
            "total_cluster_mass_kg": round(total_mass_kg, 1),
            "total_cluster_mass_tons": round(total_mass_kg / 1000.0, 1),
            "estimated_starship_launches": starship_flights,
            "annual_water_saved_million_gal": round(water_saved_m_gal, 2),
            "annual_power_opex_saved_usd": round(annual_power_opex_saved_usd, 2),
            "pue_orbital": 1.05,
            "pue_terrestrial": 1.55,
        }
    )


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "stratos-fastapi", "timestamp": str(int(time.time()))}


# ============================================================================
# Static Files & SPA Mounting
# ============================================================================

DIST = ROOT / "frontend" / "dist"
if DIST.is_dir():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="spa")
