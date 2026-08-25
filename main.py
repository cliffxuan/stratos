from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from services.telemetry import fetch_noaa_telemetry
from services.orbital import get_orbital_telemetry, calculate_laser_crosslinks
from services.simulation import SimulationParameters, run_full_simulation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stratos.api")

app = FastAPI(
    title="Project Stratos · Orbital Computing Intelligence & Physics API",
    description="Real-time NOAA space weather, orbital satellite tracking, power grid arbitrage, and radiative physics modeling.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT = Path(__file__).parent
DATA_DIR = ROOT / "data"

HARDWARE_DATA = json.loads((DATA_DIR / "hardware.json").read_text())["hardware"]
POWER_MARKETS_DATA = json.loads((DATA_DIR / "power_markets.json").read_text())["power_markets"]
TIMELINE_DATA = json.loads((DATA_DIR / "timeline.json").read_text())["timeline"]


@app.get("/api/telemetry")
async def get_telemetry() -> JSONResponse:
    """Returns live NOAA SWPC space weather, GOES-18/19 proton flux,
    simulated bit-flip MTBF dosimeter, and solar flux constants."""
    telemetry = await fetch_noaa_telemetry()
    return JSONResponse(telemetry)


@app.get("/api/satellites")
def get_satellites() -> JSONResponse:
    """Returns catalog of active & planned orbital compute satellites
    with real-time propagated sub-satellite coordinates and orbital velocity."""
    satellites = get_orbital_telemetry()
    return JSONResponse({"satellites": satellites})


@app.get("/api/laser-mesh")
def get_laser_mesh() -> JSONResponse:
    """Returns dynamic line-of-sight laser crosslink ranges, speed-of-light
    transmission latencies, and optical mesh connectivity matrix."""
    satellites = get_orbital_telemetry()
    links = calculate_laser_crosslinks(satellites)
    return JSONResponse({"crosslinks": links})


@app.get("/api/power-grid")
def get_power_grid() -> JSONResponse:
    """Returns wholesale electricity pricing, interconnect queues, and water
    intensity across terrestrial hubs vs Low Earth Orbit."""
    return JSONResponse({"power_markets": POWER_MARKETS_DATA})


@app.get("/api/hardware")
def get_hardware() -> JSONResponse:
    """Returns space-rated silicon benchmarks, compute densities, and radiation tolerance."""
    return JSONResponse({"hardware": HARDWARE_DATA})


@app.get("/api/news")
def get_news(category: str | None = None) -> JSONResponse:
    """Returns industry timeline intelligence, optionally filtered by category."""
    if category and category != "all":
        items = [n for n in TIMELINE_DATA if n["category"] == category]
    else:
        items = TIMELINE_DATA
    return JSONResponse({"timeline": items})


@app.post("/api/simulate")
def simulate_cluster(params: SimulationParameters) -> JSONResponse:
    """Calculates Stefan-Boltzmann thermal radiator footprint, solar array mass,
    Starship launch logistics, and 10-year cumulative TCO financial models."""
    results = run_full_simulation(params)
    return JSONResponse(results)


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "stratos-fastapi-v2"}


# ============================================================================
# Static Frontend SPA Mounting
# ============================================================================

DIST = ROOT / "frontend" / "dist"
if DIST.is_dir():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="spa")
