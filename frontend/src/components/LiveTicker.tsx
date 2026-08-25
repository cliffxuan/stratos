import React from 'react';
import { TelemetryData } from '../types';
import { Radio, Zap, ShieldAlert, Cpu } from 'lucide-react';

interface LiveTickerProps {
  telemetry: TelemetryData | null;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ telemetry }) => {
  return (
    <div className="bg-slate-950/80 border-b border-slate-800 text-xs py-2 px-4 overflow-hidden relative backdrop-blur-md z-40">
      <div className="flex items-center">
        <span className="flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold tracking-wider mr-4 border border-indigo-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Live Intel & Telemetry
        </span>
        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker text-slate-300 font-mono text-xs flex items-center gap-8">
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 inline" />
              <strong>AM0 Solar Constant:</strong> {telemetry?.solar_constant_am0_w_m2 ?? 1361} W/m² (Continuous in SSO)
            </span>
            <span className="inline-flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 inline" />
              <strong>Solar Flux (F10.7):</strong> {telemetry?.solar_flux_f107 ?? 145.2} sfu &bull; Kp Index: {telemetry?.kp_geomagnetic_index ?? 2.4}
            </span>
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400 inline" />
              <strong>SpaceX:</strong> Project Starmind AI1 Constellation with NVIDIA Vera Rubin NVL72
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 inline" />
              <strong>Starcloud:</strong> $450M Raised ($2.3B Val) &bull; Starcloud-1 In-Orbit H100 Validated
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-purple-400 inline" />
              <strong>Google:</strong> Project Suncatcher Solar TPU Trillium Fleet
            </span>
            <span className="inline-flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 inline" />
              <strong>EU ASCEND:</strong> 200MW Orbital Sovereign Cloud Study Published
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
