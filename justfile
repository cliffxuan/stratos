# Stratos · Orbital Computing Intelligence Platform
# Run `just` to list available recipes.

set shell := ["bash", "-uc"]

port := "8000"

# List available recipes
default:
    @just --list

# Install all dependencies (frontend bun + backend uv)
install:
    cd frontend && bun install
    uv sync

# Frontend dev server with HMR
frontend:
    cd frontend && bun run dev

# Backend dev server with autoreload
backend:
    uv run uvicorn main:app --reload --port {{port}}

# Full local dev: backend + frontend together
dev:
    #!/usr/bin/env bash
    set -euo pipefail
    trap 'kill 0' EXIT
    uv run uvicorn main:app --reload --port {{port}} &
    cd frontend && bun run dev
    wait

# Build the React frontend into frontend/dist
build:
    cd frontend && bun run build

# Typecheck the frontend
typecheck:
    cd frontend && bun x tsc -b

# Production-like: build the SPA, then serve from FastAPI on :{{port}}
serve: build
    uv run uvicorn main:app --port {{port}}

# Test healthz and telemetry endpoints locally
telemetry:
    curl -s http://localhost:{{port}}/api/telemetry | python3 -m json.tool

# Deploy to Dokploy (pushes to origin main, auto-deployed by Dokploy)
deploy:
    git push origin main
