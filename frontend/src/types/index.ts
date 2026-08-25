export type TabId = 
  | 'summary' 
  | 'timeline' 
  | 'energy' 
  | 'orbital' 
  | 'players' 
  | 'economics' 
  | 'challenges' 
  | 'media';

export type TimelineCategory = 'all' | 'spacex' | 'starcloud' | 'google' | 'europe' | 'hardware';

export interface TelemetryData {
  timestamp: number;
  solar_constant_am0_w_m2: number;
  solar_flux_f107: number;
  kp_geomagnetic_index: number;
  proton_flux_gt_10mev: string;
  galactic_cosmic_ray_dose_rate_ugy_hr: number;
  simulated_100_gpu_seu_mtbf_hours: number;
  space_vacuum_temp_kelvin: number;
  pue_orbital_baseline: number;
  pue_terrestrial_baseline: number;
}

export interface SatelliteNode {
  norad_id: number;
  name: string;
  operator: string;
  launch_date: string;
  orbit_type: string;
  inclination_deg: number;
  payload: string;
  primary_mission: string;
  status: string;
}

export interface HardwareProfile {
  id: string;
  vendor: string;
  model: string;
  generation: string;
  tdp_watts: number;
  bf16_tflops: number;
  efficiency_tflops_watt: number;
  mass_kg: number;
  power_to_mass_w_kg: number;
  rad_hardening: string;
  radiator_area_m2_per_kw: number;
  status: string;
}

export interface PowerMarketHub {
  hub: string;
  grid_type: string;
  power_price_per_mwh: number;
  effective_kwh_cost: number;
  water_consumption_gal_per_mwh: number;
  grid_interconnect_queue_years: number;
  pue_average: number;
}

export interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
  badge: string;
  tags: string[];
}

export interface ClusterCalculationResult {
  power_mw: number;
  radiator_temp_c: number;
  radiator_temp_k: number;
  thermal_flux_w_m2: number;
  radiator_area_m2: number;
  solar_array_area_m2: number;
  total_cluster_mass_kg: number;
  total_cluster_mass_tons: number;
  estimated_starship_launches: number;
  annual_water_saved_million_gal: number;
  annual_power_opex_saved_usd: number;
  pue_orbital: number;
  pue_terrestrial: number;
}
