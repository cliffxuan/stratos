import React, { useState } from 'react';
import { SatelliteNode, LaserCrosslink } from '../types';
import { Orbit, Radio, Sun, Globe } from 'lucide-react';

interface ConstellationTrackerTabProps {
  satellites: SatelliteNode[];
  crosslinks: LaserCrosslink[];
}

export const ConstellationTrackerTab: React.FC<ConstellationTrackerTabProps> = ({ satellites, crosslinks }) => {
  const [selectedSatId, setSelectedSatId] = useState<string>(satellites[0]?.id || 'spacex-ai1-01');
  const [showLaserMesh, setShowLaserMesh] = useState<boolean>(true);
  const [showGroundTracks, setShowGroundTracks] = useState<boolean>(true);
  const [showTerminator, setShowTerminator] = useState<boolean>(true);

  const selectedSat = satellites.find((s) => s.id === selectedSatId) || satellites[0];

  // Map projection helpers (Equirectangular 1000x500 SVG coordinates)
  const mapWidth = 1000;
  const mapHeight = 500;

  const project = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  // Major Ground Stations
  const groundStations = [
    { name: 'Svalbard (Norway)', lat: 78.22, lon: 15.65 },
    { name: 'Fairbanks (Alaska)', lat: 64.84, lon: -147.72 },
    { name: 'Harwell (UK)', lat: 51.57, lon: -1.31 },
    { name: 'Punta Arenas (Chile)', lat: -53.16, lon: -70.91 },
    { name: 'Adelaide (Australia)', lat: -34.92, lon: 138.60 },
    { name: 'Kourou (French Guiana)', lat: 5.16, lon: -52.65 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title & Live Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Orbit className="w-8 h-8 text-cyan-400" /> Real-Time Constellation & Optical Laser Mesh
          </h2>
          <p className="text-slate-400 text-sm mt-1">Live orbital propagation, sub-satellite tracking, speed-of-light latencies, and space-to-space laser crosslinks</p>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowLaserMesh(!showLaserMesh)}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showLaserMesh
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Laser Mesh (ISL)
          </button>
          <button
            onClick={() => setShowGroundTracks(!showGroundTracks)}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showGroundTracks
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Orbit Tracks
          </button>
          <button
            onClick={() => setShowTerminator(!showTerminator)}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
              showTerminator
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> Day/Night Shadow
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl bg-[#060913]">
        
        {/* Map Top Status Bar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span><strong>Active Compute Nodes:</strong> {satellites.length} Satellites</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400"><strong>Optical Links:</strong> {crosslinks.filter(l => l.is_line_of_sight).length} Active</span>
        </div>

        {/* SVG World Map & Orbit Overlay */}
        <div className="relative w-full aspect-[2/1] min-h-[360px] flex items-center justify-center">
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full select-none"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
          >
            <defs>
              <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Latitude / Longitude Coordinate Grid */}
            <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="3 3">
              {[-60, -30, 0, 30, 60].map((lat) => (
                <line key={`lat-${lat}`} x1="0" y1={project(lat, 0).y} x2={mapWidth} y2={project(lat, 0).y} />
              ))}
              {[-120, -60, 0, 60, 120].map((lon) => (
                <line key={`lon-${lon}`} x1={project(0, lon).x} y1="0" x2={project(0, lon).x} y2={mapHeight} />
              ))}
            </g>

            {/* Equator & Prime Meridian Highlights */}
            <line x1="0" y1={mapHeight / 2} x2={mapWidth} y2={mapHeight / 2} stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
            <line x1={mapWidth / 2} y1="0" x2={mapWidth / 2} y2={mapHeight} stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />

            {/* Day / Night Terminator Shadow Curve */}
            {showTerminator && (
              <path
                d={`M 0,0 L ${mapWidth},0 L ${mapWidth},${mapHeight} L 0,${mapHeight} Z`}
                fill="rgba(0, 0, 0, 0.35)"
              />
            )}

            {/* Continental Simplified Outlines */}
            <g fill="rgba(30, 41, 59, 0.6)" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1">
              <polygon points="120,80 180,60 260,80 280,120 230,160 170,180 140,140" />
              <polygon points="170,180 210,180 230,230 190,260 160,210" />
              <polygon points="260,260 320,280 340,360 290,440 260,380 240,300" />
              <polygon points="460,70 530,60 550,110 500,140 450,120" />
              <polygon points="460,150 550,160 580,240 540,340 480,330 450,220" />
              <polygon points="560,60 760,70 820,130 780,210 650,220 560,140" />
              <polygon points="760,300 840,300 850,380 770,390" />
            </g>

            {/* Ground Stations */}
            {groundStations.map((gs, idx) => {
              const pos = project(gs.lat, gs.lon);
              return (
                <g key={idx} className="cursor-pointer">
                  <circle cx={pos.x} cy={pos.y} r="3" fill="#10b981" />
                  <circle cx={pos.x} cy={pos.y} r="8" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.6" />
                  <text x={pos.x + 6} y={pos.y + 3} fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                    {gs.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

            {/* Orbit Ground Tracks */}
            {showGroundTracks && selectedSat?.ground_track && (
              <polyline
                points={selectedSat.ground_track.map(p => {
                  const pt = project(p.lat, p.lon);
                  return `${pt.x},${pt.y}`;
                }).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.75"
              />
            )}

            {/* Optical Laser Cross-links (ISL) */}
            {showLaserMesh && crosslinks.map((link, idx) => {
              if (!link.is_line_of_sight) return null;
              const s1 = satellites.find(s => s.id === link.source_id);
              const s2 = satellites.find(s => s.id === link.target_id);
              if (!s1 || !s2) return null;

              const p1 = project(s1.current_lat, s1.current_lon);
              const p2 = project(s2.current_lat, s2.current_lon);

              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="url(#laserGrad)"
                    strokeWidth="2"
                    filter="url(#laserGlow)"
                  />
                  <rect
                    x={(p1.x + p2.x) / 2 - 28}
                    y={(p1.y + p2.y) / 2 - 8}
                    width="56"
                    height="16"
                    rx="4"
                    fill="#020617"
                    stroke="#06b6d4"
                    strokeWidth="0.6"
                    opacity="0.85"
                  />
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 + 3}
                    fill="#38bdf8"
                    fontSize="7.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {link.latency_ms} ms
                  </text>
                </g>
              );
            })}

            {/* Satellites Markers */}
            {satellites.map((sat) => {
              const pos = project(sat.current_lat, sat.current_lon);
              const isSelected = sat.id === selectedSatId;

              return (
                <g
                  key={sat.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedSatId(sat.id)}
                >
                  {isSelected && (
                    <circle r="16" fill="none" stroke="#a855f7" strokeWidth="1.5" className="animate-ping opacity-75" />
                  )}

                  <rect
                    x="-9"
                    y="-9"
                    width="18"
                    height="18"
                    rx="5"
                    fill={isSelected ? '#6366f1' : '#0f172a'}
                    stroke={isSelected ? '#c084fc' : '#38bdf8'}
                    strokeWidth="1.5"
                  />
                  
                  <line x1="-15" y1="0" x2="-9" y2="0" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="9" y1="0" x2="15" y2="0" stroke="#38bdf8" strokeWidth="2" />

                  <text
                    x="0"
                    y="-13"
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {sat.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Satellite Telemetry Inspector */}
      {selectedSat && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] uppercase font-bold">
                  NORAD #{selectedSat.norad_id}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                  {selectedSat.operator}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  {selectedSat.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{selectedSat.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSat.primary_mission}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                ⚡ Power Bus: <strong className="text-amber-400">{selectedSat.power_kw} kW</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Sub-Sat Coordinates</span>
              <span className="font-bold text-white text-sm">{selectedSat.current_lat}°, {selectedSat.current_lon}°</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Orbital Altitude</span>
              <span className="font-bold text-indigo-400 text-sm">{selectedSat.altitude_km} km</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Orbital Velocity</span>
              <span className="font-bold text-cyan-400 text-sm">{selectedSat.velocity_km_s} km/s</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Orbital Period</span>
              <span className="font-bold text-purple-400 text-sm">{selectedSat.period_min} min</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Speed-of-Light RTT</span>
              <span className="font-bold text-pink-400 text-sm">{selectedSat.rtt_latency_ms} ms</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Solar Illumination</span>
              <span className="font-bold text-emerald-400 text-sm">
                {selectedSat.in_eclipse ? 'Umbra (Shadow)' : `${Math.round(selectedSat.sunlit_fraction * 100)}% Sunlit`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Accelerated Compute Payload:</span>
              <p className="text-slate-300 leading-relaxed">{selectedSat.payload}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Optical Laser Crosslink Mesh:</span>
              <p className="text-slate-300 leading-relaxed">
                {selectedSat.isl_laser_equipped
                  ? 'Equipped with 100+ Gbps Free-Space Optical (FSO) transceivers linked to Kepler & Starlink relay constellation.'
                  : 'Direct RF downlinks to high-latitude polar ground stations.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
