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
    <div className="bg-slate-950/90 border-b border-slate-800/80 text-xs py-1.5 px-4 overflow-hidden relative backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto flex items-center">
        <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.2 rounded bg-indigo-500/15 text-indigo-300 font-mono text-[9.5px] uppercase font-bold tracking-wider mr-4 border border-indigo-500/25">
          <span className={`w-1.5 h-1.5 rounded-full ${isStorm ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
          NOAA Telemetry
        </span>

        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-slate-300 font-mono text-[11px] flex items-center gap-8">
            <span className="inline-flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400 inline" />
              <strong>Solar Flux (F10.7):</strong> {telemetry?.f107_flux ?? 145.2} sfu
            </span>
            <span className="inline-flex items-center gap-1">
              <Activity className={`w-3 h-3 ${isStorm ? 'text-rose-400' : 'text-emerald-400'} inline`} />
              <strong>Kp Index:</strong> {kp} ({telemetry?.kp_status ?? 'Quiet'})
            </span>
            <span className="inline-flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400 inline" />
              <strong>GOES Proton Flux (≥10 MeV):</strong> {telemetry?.proton_flux_gt_10mev ?? 1.25} pfu
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-purple-400 inline" />
              <strong>100-GPU Bit-Flip MTBF:</strong> {telemetry?.seu_mtbf_hours_100_gpu ?? 142.0} hrs
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 inline" />
              <strong>AM0 Solar Constant:</strong> {telemetry?.solar_constant_am0 ?? 1361.0} W/m²
            </span>
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400 inline" />
              <strong>SpaceX Starmind:</strong> 150kW AI1 Nodes with NVIDIA Vera Rubin NVL72
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-pink-400 inline" />
              <strong>Starcloud:</strong> $450M Raised &bull; Launch Q4 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
