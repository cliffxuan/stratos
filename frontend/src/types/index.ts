export type TabId = 
  | 'summary' 
  | 'tracking'
  | 'timeline' 
  | 'energy' 
  | 'arbitrage'
  | 'hardware' 
  | 'economics' 
  | 'challenges' 
  | 'media';

export type TimelineCategory = 'all' | 'spacex' | 'starcloud' | 'google' | 'europe' | 'hardware';

export interface TelemetryData {
  last_fetch: number;
  f107_flux: number;
  kp_index: number;
  kp_status: string;
  proton_flux_gt_10mev: number;
  proton_flux_status: string;
  solar_constant_am0: number;
  seu_mtbf_hours_100_gpu: number;
  radiation_dose_ugy_hr: number;
  orbital_drag_multiplier: number;
}

export interface GroundTrackPoint {
  lat: number;
  lon: number;
}

export interface SatelliteNode {
  id: string;
  norad_id: number;
  name: string;
  operator: string;
  launch_date: string;
  orbit_type: string;
  altitude_km: number;
  inclination_deg: number;
  eccentricity: number;
  period_min: number;
  payload: string;
  power_kw: number;
  primary_mission: string;
  status: string;
  ground_stations: string[];
  isl_laser_equipped: boolean;
  current_lat: number;
  current_lon: number;
  velocity_km_s: number;
  in_eclipse: boolean;
  sunlit_fraction: number;
  power_status: string;
  one_way_latency_ms: number;
  rtt_latency_ms: number;
  ground_track: GroundTrackPoint[];
}

export interface LaserCrosslink {
  source_id: string;
  source_name: string;
  target_id: string;
  target_name: string;
  distance_km: number;
  is_line_of_sight: boolean;
  latency_ms: number;
  bandwidth_gbps: number;
  status: string;
}

export interface HardwareProfile {
  id: string;
  vendor: string;
  model: string;
  generation: string;
  tdp_watts: number;
  bf16_tflops: number;
  fp8_tflops: number;
  efficiency_tflops_watt: number;
  mass_kg: number;
  power_to_mass_w_kg: number;
  rad_hardening: string;
  tid_tolerance_krad: number;
  seu_cross_section_cm2: string;
  radiator_area_m2_per_kw: number;
  cooling_loop: string;
  operating_junction_temp_c: number;
  status: string;
  heritage: string;
}

export interface PowerMarketHub {
  hub_id: string;
  hub_name: string;
  sub_region: string;
  grid_type: string;
  power_price_per_mwh: number;
  effective_kwh_cost: number;
  peak_summer_kwh_cost: number;
  water_consumption_gal_per_mwh: number;
  carbon_intensity_g_co2_kwh: number;
  grid_interconnect_queue_years: number;
  pue_average: number;
  transformer_lead_time_months: number;
  notes: string;
}

export interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
  badge: string;
  tags: string[];
  source_url: string;
  impact_score: number;
}

export interface SimulationResult {
  inputs: {
    power_mw: number;
    radiator_temp_c: number;
    emissivity: number;
    launch_cost_per_kg: number;
    gpu_lifespan_years: number;
    solar_degradation_pct_yr: number;
    terrestrial_kwh_cost: number;
    terrestrial_power_inflation_pct: number;
    discount_rate_pct: number;
  };
  physics: {
    radiator_temp_k: number;
    thermal_flux_w_m2: number;
    radiator_area_m2: number;
    radiator_mass_kg: number;
    solar_array_area_m2: number;
    solar_array_mass_kg: number;
    total_cluster_mass_kg: number;
    total_cluster_mass_tons: number;
    starship_launches_required: number;
  };
  environmental: {
    annual_water_saved_million_gal: number;
    annual_co2_avoided_metric_tons: number;
    pue_orbital: number;
    pue_terrestrial: number;
  };
  financial: {
    launch_capex_usd: number;
    orbital_initial_capex_usd: number;
    terrestrial_initial_capex_usd: number;
    crossover_payback_year: string | number;
    ten_year_npv_savings_usd: number;
    ten_year_npv_savings_million_usd: number;
    lcoc_orbital_cents_per_pflop_hr: number;
    lcoc_terrestrial_cents_per_pflop_hr: number;
    tco_timeline: {
      year: string;
      year_num: number;
      terrestrial_tco_m: number;
      orbital_tco_m: number;
      annual_opex_savings_m: number;
    }[];
  };
}
