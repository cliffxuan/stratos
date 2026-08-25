# Stratos · Orbital Data Infrastructure Intelligence Platform

Researching and modeling the transition of global AI computing to Low Earth Orbit (LEO): powered by infinite solar flux (1,361 W/m²), cooled by cosmic radiative dissipation into the 3 Kelvin void, and enabled by heavy-lift launch architectures.

## Features
- **Live Telemetry & Dosimetry:** NOAA SWPC solar flux, Kp index, space vacuum physics, and simulated bit-flip MTBF dosimeter.
- **2026 Industry Intelligence:** Verified timelines for SpaceX Project Starmind, Starcloud $450M funding & orbital H100 test, Google Project Suncatcher, EU ASCEND.
- **Orbital Dynamics Simulator:** Real-time orbit modeling (LEO SSO Dawn-Dusk, Starlink Shell, MEO, GEO), speed-of-light latencies, and laser ISL mesh.
- **Thermodynamics & Cluster Sizing:** Stefan-Boltzmann ($q \propto T^4$) calculator for deployable graphene radiators, GaInP solar arrays, and water savings.
- **10-Year Cumulative TCO Analysis:** CapEx/OpEx crossover financial models.

## Development
- **Backend:** FastAPI + Python (`uv run uvicorn main:app --port 8000`)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 (`bun run dev`)
- **Deploy:** Auto-deployed to Dokploy on push to `main`.
