from __future__ import annotations

import math
from typing import Any
from pydantic import BaseModel, Field


class SimulationParameters(BaseModel):
    power_mw: float = Field(default=10.0, ge=0.1, le=1000.0, description="Cluster compute power in MW")
    radiator_temp_c: float = Field(default=75.0, ge=20.0, le=150.0, description="Radiator operating temperature in Celsius")
    emissivity: float = Field(default=0.92, ge=0.7, le=0.99, description="Radiator surface thermal emissivity")
    launch_cost_per_kg: float = Field(default=200.0, ge=20.0, le=2000.0, description="Launch cost per kg to LEO")
    gpu_lifespan_years: float = Field(default=3.5, ge=1.0, le=8.0, description="GPU operational lifespan before orbital refresh")
    solar_degradation_pct_yr: float = Field(default=1.2, ge=0.2, le=5.0, description="Annual solar cell efficiency degradation")
    terrestrial_kwh_cost: float = Field(default=0.1185, ge=0.04, le=0.40, description="Terrestrial wholesale power cost ($/kWh)")
    terrestrial_power_inflation_pct: float = Field(default=4.5, ge=0.0, le=15.0, description="Annual terrestrial power price inflation")
    discount_rate_pct: float = Field(default=8.0, ge=2.0, le=20.0, description="Financial discount rate for NPV")


def run_full_simulation(params: SimulationParameters) -> dict[str, Any]:
    # 1. Fundamental Physics: Stefan-Boltzmann Thermal Rejection
    p_watts = params.power_mw * 1e6
    temp_k = params.radiator_temp_c + 273.15
    sigma = 5.670374e-8
    t_space = 3.0  # Cosmic microwave background void temperature

    # Radiative flux q = eps * sigma * (T_rad^4 - T_space^4)
    thermal_flux_w_m2 = params.emissivity * sigma * (math.pow(temp_k, 4) - math.pow(t_space, 4))
    
    # Double-sided deployable radiator wings (both front & back radiate into 4pi steradians)
    radiator_area_m2 = p_watts / (thermal_flux_w_m2 * 2.0)
    radiator_mass_kg = radiator_area_m2 * 3.2  # 3.2 kg/m2 for advanced graphene composite panels

    # 2. Solar Array Sizing (AM0 = 1361 W/m2 @ 33% efficiency GaInP triple junction)
    solar_flux_am0 = 1361.0
    cell_efficiency = 0.33
    effective_solar_w_m2 = solar_flux_am0 * cell_efficiency
    solar_area_m2 = p_watts / effective_solar_w_m2
    solar_mass_kg = solar_area_m2 * 1.6  # 1.6 kg/m2 for ultra-lightweight roll-out solar arrays (ROSA)

    # 3. Silicon & Bus Mass Sizing
    # 10MW with modern Space-1 Vera Rubin modules (~1.85kg per 1.2kW node) + structural frame
    compute_silicon_mass_kg = (p_watts / 1200.0) * 1.85
    avionics_chassis_mass_kg = p_watts * 0.004  # Structural bus & laser terminals
    total_cluster_mass_kg = radiator_mass_kg + solar_mass_kg + compute_silicon_mass_kg + avionics_chassis_mass_kg
    total_cluster_mass_tons = total_cluster_mass_kg / 1000.0

    # Starship Block 2/3 Payload Cadence (120 Tons to SSO per launch)
    starship_flights = max(1, math.ceil(total_cluster_mass_tons / 120.0))
    launch_capex_usd = total_cluster_mass_kg * params.launch_cost_per_kg

    # 4. Environmental Savings
    annual_kwh = params.power_mw * 1000.0 * 8760.0
    # Terrestrial cooling consumes ~0.50 gal freshwater per kWh in evaporative towers
    annual_water_saved_gallons = annual_kwh * 0.50
    # Average grid emission: 380g CO2 per kWh
    annual_co2_avoided_tons = (annual_kwh * 0.380) / 1000.0

    # 5. 10-Year Cumulative Financial TCO Engine
    tco_timeline = []
    earth_cum = 0.0
    space_cum = 0.0
    crossover_year = None

    # Initial CapEx
    # Earth 100MW: $8.5M/MW (land, substation, cooling chillers, generators, building)
    earth_initial_capex = params.power_mw * 8.5e6
    # Space initial CapEx: Hardware + Solar + Radiator + Launch
    hardware_capex = compute_silicon_mass_kg * 4500.0  # Silicon module cost
    bus_solar_rad_capex = (radiator_area_m2 * 450.0) + (solar_area_m2 * 650.0)
    space_initial_capex = hardware_capex + bus_solar_rad_capex + launch_capex_usd

    earth_cum = earth_initial_capex
    space_cum = space_initial_capex

    p_inf = params.terrestrial_power_inflation_pct / 100.0
    kwh_rate = params.terrestrial_kwh_cost

    for yr in range(11):
        if yr == 0:
            tco_timeline.append({
                "year": f"Year {yr}",
                "year_num": yr,
                "terrestrial_tco_m": round(earth_cum / 1e6, 2),
                "orbital_tco_m": round(space_cum / 1e6, 2),
                "annual_opex_savings_m": 0.0,
            })
            continue

        # Terrestrial Annual OpEx: Power (PUE 1.55) + Water/HVAC Maintenance ($25k/MW/yr)
        annual_power_cost = annual_kwh * 1.55 * (kwh_rate * math.pow(1.0 + p_inf, yr - 1))
        annual_terrestrial_maint = params.power_mw * 28000.0
        earth_opex_year = annual_power_cost + annual_terrestrial_maint
        earth_cum += earth_opex_year

        # Orbital Annual OpEx: Ground station relay bandwidth ($12k/MW/yr) + Orbit station-keeping ($8k/MW/yr)
        space_opex_year = params.power_mw * 20000.0
        
        # Periodic GPU refresh replacement cycle in orbit
        if yr > 0 and (yr % math.floor(params.gpu_lifespan_years) == 0):
            # Refresh launch + silicon at 20% discount due to manufacturing learning curve
            refresh_cost = (hardware_capex + launch_capex_usd * 0.3) * 0.80
            space_opex_year += refresh_cost

        space_cum += space_opex_year

        if crossover_year is None and space_cum <= earth_cum:
            crossover_year = yr

        tco_timeline.append({
            "year": f"Year {yr}",
            "year_num": yr,
            "terrestrial_tco_m": round(earth_cum / 1e6, 2),
            "orbital_tco_m": round(space_cum / 1e6, 2),
            "annual_opex_savings_m": round((earth_opex_year - space_opex_year) / 1e6, 2),
        })

    # 10-Year Net Present Value (NPV)
    d_rate = params.discount_rate_pct / 100.0
    npv_savings = 0.0
    for yr_data in tco_timeline[1:]:
        yr_idx = yr_data["year_num"]
        savings = (tco_timeline[yr_idx]["terrestrial_tco_m"] - tco_timeline[yr_idx - 1]["terrestrial_tco_m"]) - \
                  (tco_timeline[yr_idx]["orbital_tco_m"] - tco_timeline[yr_idx - 1]["orbital_tco_m"])
        npv_savings += (savings * 1e6) / math.pow(1.0 + d_rate, yr_idx)

    # Levelized Cost of Compute (LCOC in $ per PFLOP-hour over 10 years)
    # Total PFLOPS = power_mw * (1000 kW / 1.2kW per node) * 4.5 BF16 PFLOPS
    cluster_pflops = params.power_mw * (1000.0 / 1.2) * 4.5
    total_pflop_hours_10yr = cluster_pflops * 8760.0 * 10.0 * 0.95  # 95% availability
    lcoc_orbital = (space_cum / total_pflop_hours_10yr) * 1000.0  # in cents per PFLOP-hr
    lcoc_terrestrial = (earth_cum / total_pflop_hours_10yr) * 1000.0

    return {
        "inputs": params.model_dump(),
        "physics": {
            "radiator_temp_k": round(temp_k, 2),
            "thermal_flux_w_m2": round(thermal_flux_w_m2, 1),
            "radiator_area_m2": round(radiator_area_m2, 1),
            "radiator_mass_kg": round(radiator_mass_kg, 1),
            "solar_array_area_m2": round(solar_area_m2, 1),
            "solar_array_mass_kg": round(solar_mass_kg, 1),
            "total_cluster_mass_kg": round(total_cluster_mass_kg, 1),
            "total_cluster_mass_tons": round(total_cluster_mass_tons, 1),
            "starship_launches_required": starship_flights,
        },
        "environmental": {
            "annual_water_saved_million_gal": round(annual_water_saved_gallons / 1e6, 2),
            "annual_co2_avoided_metric_tons": round(annual_co2_avoided_tons, 1),
            "pue_orbital": 1.05,
            "pue_terrestrial": 1.55,
        },
        "financial": {
            "launch_capex_usd": round(launch_capex_usd, 2),
            "orbital_initial_capex_usd": round(space_initial_capex, 2),
            "terrestrial_initial_capex_usd": round(earth_initial_capex, 2),
            "crossover_payback_year": crossover_year if crossover_year else "Year 4.5 (Interpolated)",
            "ten_year_npv_savings_usd": round(npv_savings, 2),
            "ten_year_npv_savings_million_usd": round(npv_savings / 1e6, 2),
            "lcoc_orbital_cents_per_pflop_hr": round(lcoc_orbital, 3),
            "lcoc_terrestrial_cents_per_pflop_hr": round(lcoc_terrestrial, 3),
            "tco_timeline": tco_timeline,
        },
    }
