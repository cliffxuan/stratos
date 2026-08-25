import React, { useState } from 'react';
import { Orbit, Radio, Cpu } from 'lucide-react';

export const OrbitalSimulatorTab: React.FC = () => {
  const [altitude, setAltitude] = useState<number>(550);
  const [isSSO, setIsSSO] = useState<boolean>(true);
  const [isISL, setIsISL] = useState<boolean>(true);

  // Physics Calculations
  const c = 299792; // km/s speed of light
  const oneWayLat = (altitude / c) * 1000;
  const rtt = oneWayLat * 2;
  const GM = 398600.4418; // km^3/s^2
  const r = 6371 + altitude;
  const velocity = Math.sqrt(GM / r);
  const period = (2 * Math.PI * Math.sqrt(Math.pow(r, 3) / GM)) / 60; // minutes

  const handlePreset = (alt: number, sso: boolean) => {
    setAltitude(alt);
    setIsSSO(sso);
  };

  // Visual scaling
  const minScale = 220;
  const maxScale = 460;
  const scale = minScale + ((altitude - 300) / (36000 - 300)) * (maxScale - minScale);
  const radius = scale / 2;

  const angle1 = isSSO ? 270 : 15;
  const rad1 = (angle1 * Math.PI) / 180;
  const x1 = Math.cos(rad1) * radius;
  const y1 = Math.sin(rad1) * radius;

  const angle2 = isSSO ? 210 : 75;
  const rad2 = (angle2 * Math.PI) / 180;
  const x2 = Math.cos(rad2) * radius;
  const y2 = Math.sin(rad2) * radius;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const laserAngle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Orbit className="w-8 h-8 text-indigo-400" /> Orbital Dynamics & Constellation Simulator
        </h2>
        <p className="text-slate-400 text-sm mt-1">Simulate orbital altitude, Sun-Synchronous dawn-dusk terminator alignment, speed-of-light latencies, and laser cross-links</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Orbit Controls</h3>
              
              {/* Presets */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => handlePreset(550, true)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition ${
                    altitude === 550 && isSSO
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-bold block">LEO SSO</span> 550 km (Dawn-Dusk)
                </button>
                <button
                  onClick={() => handlePreset(550, false)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition ${
                    altitude === 550 && !isSSO
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-bold block">Starlink Shell</span> 550 km (Std)
                </button>
                <button
                  onClick={() => handlePreset(10000, false)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition ${
                    altitude === 10000
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-bold block">MEO</span> 10,000 km
                </button>
                <button
                  onClick={() => handlePreset(35786, false)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition ${
                    altitude === 35786
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-bold block">GEO</span> 35,786 km
                </button>
              </div>

              <div>
                <label className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Target Orbital Altitude</span>
                  <span className="text-indigo-400 font-bold">{altitude.toLocaleString()} km</span>
                </label>
                <input
                  type="range"
                  min="300"
                  max="36000"
                  step="50"
                  value={altitude}
                  onChange={(e) => setAltitude(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/40">
                <div>
                  <span className="text-sm font-bold text-white block">Sun-Synchronous (SSO)</span>
                  <span className="text-[11px] text-slate-400">Dawn-Dusk 98° inclination for 100% solar uptime</span>
                </div>
                <input
                  type="checkbox"
                  checked={isSSO}
                  onChange={(e) => setIsSSO(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full relative transition-colors ${isSSO ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${isSSO ? 'translate-x-5' : ''}`} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/40">
                <div>
                  <span className="text-sm font-bold text-white block">Optical Inter-Satellite Links (ISL)</span>
                  <span className="text-[11px] text-slate-400">Laser cross-links connect orbital compute nodes</span>
                </div>
                <input
                  type="checkbox"
                  checked={isISL}
                  onChange={(e) => setIsISL(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full relative transition-colors ${isISL ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${isISL ? 'translate-x-5' : ''}`} />
                </div>
              </label>
            </div>
          </div>

          {/* Live Telemetry Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">Live Orbital Telemetry</h4>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Speed of Light Latency (One-Way):</span>
              <span className="font-bold text-cyan-400">{oneWayLat.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Round Trip Time (RTT):</span>
              <span className="font-bold text-cyan-400">{rtt.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Orbital Velocity:</span>
              <span className="font-bold text-indigo-400">{velocity.toFixed(2)} km/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Orbital Period:</span>
              <span className="font-bold text-purple-400">{altitude > 35000 ? '24.0 hours' : `${period.toFixed(1)} min`}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Solar Uptime Fraction:</span>
              <span className="font-bold text-emerald-400">
                {isSSO ? '100% (Continuous)' : altitude >= 35786 ? '99.1% (Eclipse Seasons Only)' : '65.2% (34.8% in Umbra)'}
              </span>
            </div>
          </div>
        </div>

        {/* Simulation Stage */}
        <div className={`lg:col-span-8 glass-card rounded-3xl relative flex items-center justify-center min-h-[500px] overflow-hidden border border-slate-800 ${isSSO ? 'sso-active' : ''} ${isISL ? 'isl-active' : ''}`}>
          <div className="absolute inset-0 bg-radial from-slate-900 via-[#070a13] to-[#04060b]" />
          <div className="absolute top-4 left-4 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 z-30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isSSO ? 'SSO Dawn-Dusk Mode • Zero Battery Cycling' : 'Equatorial Orbit • ~35% Shadow Eclipse'}</span>
          </div>

          <div className="relative w-44 h-44 rounded-full shadow-[0_0_80px_rgba(59,130,246,0.35)] z-10 overflow-hidden bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center">
            <div className="terminator" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <span className="text-white/60 text-[10px] font-mono tracking-widest uppercase z-20">EARTH</span>
          </div>

          <div
            className="absolute border border-indigo-500/30 border-dashed rounded-full z-0 transition-all duration-300"
            style={{ width: `${scale}px`, height: `${scale}px` }}
          />

          <div
            className="absolute z-20 transition-all duration-300 cursor-pointer group"
            style={{ transform: `translate(${x1}px, ${y1}px)` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:scale-125 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-7 px-2 py-0.5 rounded bg-slate-900/90 text-indigo-300 text-[10px] font-mono border border-indigo-500/40 whitespace-nowrap shadow">
                Node-01 (10MW)
              </span>
            </div>
          </div>

          <div
            className="absolute z-20 transition-all duration-300"
            style={{ transform: `translate(${x2}px, ${y2}px)` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/80 flex items-center justify-center shadow-md shadow-cyan-500/30">
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -bottom-6 px-1.5 py-0.5 rounded bg-slate-900/90 text-cyan-300 text-[9px] font-mono border border-cyan-500/30 whitespace-nowrap">
                Kepler Relay-4
              </span>
            </div>
          </div>

          {isISL && (
            <div
              className="laser-beam z-10 h-0.5 pointer-events-none"
              style={{
                width: `${dist}px`,
                transformOrigin: '0 50%',
                transform: `translate(${x1}px, ${y1}px) rotate(${laserAngle}deg)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
