from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from scalar_fastapi import get_scalar_api_reference

from services.telemetry import fetch_noaa_telemetry
from services.orbital import get_orbital_telemetry, calculate_laser_crosslinks
from services.simulation import SimulationParameters, run_full_simulation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stratos.api")

tags_metadata = [
    {
        "name": "Live Space Weather & SEU Telemetry",
        "description": "Live data feeds from NOAA Space Weather Prediction Center (SWPC), GOES satellites, and SEU bit-flip MTBF dosimeter.",
    },
    {
        "name": "Orbital Nodes & Constellation",
        "description": "Keplerian orbital propagator, live sub-satellite coordinates, velocities, and 24-hour ground tracks.",
    },
    {
        "name": "Optical Laser Mesh (ISL)",
        "description": "Space-to-space line-of-sight laser crosslink solver, range vectors, and vacuum speed-of-light latencies.",
    },
    {
        "name": "Terrestrial Grid & OpEx Arbitrage",
        "description": "Real-time wholesale power market pricing (PJM, ERCOT, CAISO, Nord Pool vs LEO), PUE, and interconnect delay data.",
    },
    {
        "name": "Space Silicon & Acceleration Matrix",
        "description": "Parametric database of radiation-hardened accelerators (NVIDIA Vera Rubin, SpaceX/xAI Terafab, Google TPU v6e, Cerebras).",
    },
    {
        "name": "Intelligence & Milestones",
        "description": "Verified space computing mission timeline, funding announcements, and launch roadmaps (2024–2027+).",
    },
    {
        "name": "Thermodynamics & TCO Monte Carlo Simulator",
        "description": "Multi-variable Stefan-Boltzmann radiative cooling engine (q = ε σ (T⁴ - T₀⁴)), ROSA solar sizing, Starship logistics, and 10-year cumulative TCO models.",
    },
    {
        "name": "System Health",
        "description": "Service health probes and runtime diagnostics.",
    },
]

app = FastAPI(
    title="Project Stratos · Orbital Computing Intelligence API",
    description="""
# 🛰️ Project Stratos · State of Orbital Compute & Space Data Centers

Interactive physics, space weather, orbital mechanics, and financial TCO intelligence platform modeling the transition of AI compute into Low Earth Orbit (LEO).

### Core Pillars:
* **☀️ 24/7 Unfiltered Solar Power:** AM0 Solar Constant (1,361 W/m²) captured continuously in Sun-Synchronous Orbits.
* **❄️ Radiative Heat Dissipation:** Direct thermal radiation into the 3 Kelvin cosmic microwave background void via Stefan-Boltzmann physics (PUE = 1.05, zero freshwater consumption).
* **⚡ Free-Space Optical Mesh (ISL):** Speed-of-light in vacuum (c ≈ 300,000 km/s vs 200,000 km/s in terrestrial glass fiber).
* **🚀 Starship Heavy-Lift Economics:** Dedicated launch logistics reducing mass-to-orbit CapEx below $200/kg.
* **🏭 In-House Silicon Vertical Integration:** SpaceX / xAI Terafab custom radiation-hardened 2nm ASICs.
    """,
    version="2.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_tags=tags_metadata,
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


# ============================================================================
# Scalar API Documentation Route
# ============================================================================

@app.get("/docs", include_in_schema=False)
@app.get("/scalar", include_in_schema=False)
def scalar_documentation():
    """Renders the modern, interactive Scalar API documentation."""
    return get_scalar_api_reference(
        openapi_url="/openapi.json",
        title="Project Stratos API Reference · Scalar",
    )


# ============================================================================
# REST API Endpoints
# ============================================================================

@app.get("/api/telemetry", tags=["Live Space Weather & SEU Telemetry"], summary="Get Live NOAA Space Weather & SEU Dosimeter")
async def get_telemetry() -> JSONResponse:
    """Fetches real-time space weather feeds from NOAA SWPC observatories including F10.7cm solar radio flux, planetary Kp index, GOES proton flux, and calculates 100-GPU cluster Single Event Upset (SEU) bit-flip MTBF."""
    telemetry = await fetch_noaa_telemetry()
    return JSONResponse(telemetry)


@app.get("/api/satellites", tags=["Orbital Nodes & Constellation"], summary="Get Live Propagated Compute Satellites")
def get_satellites() -> JSONResponse:
    """Returns catalog of active & planned orbital AI compute test nodes (Starcloud-1, Starcloud-2, SpaceX AI1, Google Suncatcher, EU ASCEND) with real-time propagated sub-satellite coordinates (lat, lon), velocity, altitude, and 24-hr ground tracks."""
    satellites = get_orbital_telemetry()
    return JSONResponse({"satellites": satellites})


@app.get("/api/laser-mesh", tags=["Optical Laser Mesh (ISL)"], summary="Calculate Space-to-Space Laser Crosslinks")
def get_laser_mesh() -> JSONResponse:
    """Calculates instantaneous 3D line-of-sight laser crosslink range vectors (km), speed-of-light vacuum transmission latencies (ms), and inter-satellite mesh connectivity."""
    satellites = get_orbital_telemetry()
    links = calculate_laser_crosslinks(satellites)
    return JSONResponse({"crosslinks": links})


@app.get("/api/power-grid", tags=["Terrestrial Grid & OpEx Arbitrage"], summary="Get Global Wholesale Electricity Markets")
def get_power_grid() -> JSONResponse:
    """Returns real-time wholesale power prices, water consumption intensity (gal/MWh), PUE overheads, and substation queue delays across PJM, ERCOT, CAISO, Nord Pool, and Low Earth Orbit."""
    return JSONResponse({"power_markets": POWER_MARKETS_DATA})


@app.get("/api/hardware", tags=["Space Silicon & Acceleration Matrix"], summary="Get Space-Rated AI Silicon Database")
def get_hardware() -> JSONResponse:
    """Returns parametric specifications for space-rated AI accelerators (TDP, BF16 TFLOPS, compute density, power-to-mass, radiator area requirements, TID radiation tolerance in krad) including NVIDIA Vera Rubin and SpaceX/xAI Terafab."""
    return JSONResponse({"hardware": HARDWARE_DATA})


@app.get("/api/news", tags=["Intelligence & Milestones"], summary="Get Orbital Compute News & Timeline")
def get_news(
    category: str | None = Query(default=None, description="Filter by category (e.g. 'flight', 'funding', 'research', 'hardware')")
) -> JSONResponse:
    """Returns chronological timeline of industry milestones, flight test missions, and venture funding rounds from 2024 to 2027+."""
    if category and category != "all":
        items = [n for n in TIMELINE_DATA if n["category"] == category]
    else:
        items = TIMELINE_DATA
    return JSONResponse({"timeline": items})


@app.post("/api/simulate", tags=["Thermodynamics & TCO Monte Carlo Simulator"], summary="Simulate Cluster Physics & 10-Year Cumulative TCO")
def simulate_cluster(params: SimulationParameters) -> JSONResponse:
    """Calculates Stefan-Boltzmann radiative cooling area, ROSA solar array mass, Starship heavy-lift flight cadence, and models the 10-year cumulative TCO crossover (supporting both Merchant Silicon and SpaceX/xAI Terafab in-house silicon modes)."""
    results = run_full_simulation(params)
    return JSONResponse(results)


@app.get("/healthz", tags=["System Health"], summary="Health Probe Endpoint")
def healthz() -> dict[str, str]:
    """Health check probe returning service operational status."""
    return {"status": "ok", "service": "stratos-fastapi-v2"}


# ============================================================================
# Static Frontend SPA Mounting & Fallback Routing
# ============================================================================

DIST = ROOT / "frontend" / "dist"
if DIST.is_dir():
    assets_dir = DIST / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        file_path = DIST / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        index_file = DIST / "index.html"
        if index_file.is_file():
            return FileResponse(index_file)
        return JSONResponse({"detail": "Not Found"}, status_code=404)

