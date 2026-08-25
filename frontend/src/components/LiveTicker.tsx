import React from 'react';
import { TelemetryData } from '../types';
import { Radio, Zap, ShieldAlert, Cpu, Activity, Sun } from 'lucide-react';

interface LiveTickerProps {
  telemetry: TelemetryData | null;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ telemetry }) => {
  const kp = telemetry?.kp_index ?? 2.4;
  const isStorm = kp >= 5.0;

  return (
    <div className="bg-slate-950/90 border-b border-slate-800 text-xs py-2 px-4 overflow-hidden relative backdrop-blur-md z-40">
      <div className="flex items-center">
        <span className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-wider mr-4 border border-indigo-500/30 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${isStorm ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
          Live NOAA Telemetry
        </span>

        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-slate-300 font-mono text-xs flex items-center gap-8">
            <span className="inline-flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400 inline" />
              <strong>Solar Flux (F10.7):</strong> {telemetry?.f107_flux ?? 145.2} sfu &bull; Drag Multiplier: {telemetry?.orbital_drag_multiplier ?? 1.05}x
            </span>
            <span className="inline-flex items-center gap-1">
              <Activity className={`w-3.5 h-3.5 ${isStorm ? 'text-rose-400' : 'text-emerald-400'} inline`} />
              <strong>Geomagnetic Kp:</strong> {kp} ({telemetry?.kp_status ?? 'Quiet'})
            </span>
            <span className="inline-flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 inline" />
              <strong>GOES Proton Flux (≥10 MeV):</strong> {telemetry?.proton_flux_gt_10mev ?? 1.25} pfu ({telemetry?.proton_flux_status ?? 'Quiet Baseline'})
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400 inline" />
              <strong>100-GPU SEU MTBF Dosimeter:</strong> {telemetry?.seu_mtbf_hours_100_gpu ?? 142.0} hrs ({telemetry?.radiation_dose_ugy_hr ?? 24.5} µGy/hr)
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 inline" />
              <strong>AM0 Solar Constant:</strong> {telemetry?.solar_constant_am0 ?? 1361.0} W/m² (Zero Atmospheric Loss)
            </span>
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400 inline" />
              <strong>SpaceX Starmind:</strong> 150kW AI1 Nodes with NVIDIA Vera Rubin NVL72
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-pink-400 inline" />
              <strong>Starcloud:</strong> $450M Raised ($2.3B Val) &bull; Starcloud-2 Launch Q4 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
