import React from 'react';
import { ShieldAlert, Thermometer, WifiOff, Wrench, AlertTriangle, Activity } from 'lucide-react';

export const ChallengesTab: React.FC = () => {
  const challenges = [
    {
      id: 1,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      title: '1. Radiation & Single Event Upsets',
      hazard: 'High-energy protons and galactic cosmic rays strike sub-3nm silicon transistors, flipping bits in SRAM/HBM memory and inducing destructive latch-ups.',
      solution: 'Triple Modular Redundancy (TMR), algorithmic checkpoint-restart protocols, and boronated polymer shielding (used in NVIDIA Space-1 modules).',
    },
    {
      id: 2,
      icon: Thermometer,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      title: '2. Thermal Radiator Footprint',
      hazard: 'In the vacuum of space, heat cannot be removed by air convection. Megawatts of GPU heat must be radiated purely via infrared radiation (q ∝ T⁴).',
      solution: 'Two-phase liquid loop ammonia heat pipes and ultra-lightweight deployable graphene radiator panels with emissivity ε > 0.94 (e.g. SpaceX AI1 70m wings).',
    },
    {
      id: 3,
      icon: WifiOff,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      title: '3. The Uplink Bandwidth Bottleneck',
      hazard: 'Uploading petabytes of raw AI training datasets via traditional RF satellite frequencies (Ka/Ku band) is painfully slow and congested.',
      solution: 'Free-Space Optical (FSO) laser links (100 Gbps to 1 Tbps) paired with Kepler relay mesh and edge-filtering datasets in-situ before transmission.',
    },
    {
      id: 4,
      icon: Wrench,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      title: '4. Zero-Maintenance Lifespan',
      hazard: 'If a memory chip or GPU die fails in LEO, a technician cannot walk down the aisle to replace the blade. Dead hardware becomes dead mass.',
      solution: 'Software-defined node fencing (automatically routing around degraded dies) combined with Orbit Fab robotic hydrazine refueling and 3-year refresh constellations.',
    },
    {
      id: 5,
      icon: AlertTriangle,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20',
      title: '5. Space Debris & Collision Risks',
      hazard: 'Large surface area radiator arrays are targets for micro-meteoroids and orbital debris fragments traveling at 8 km/s.',
      solution: 'Automated AI collision-avoidance thruster burns, multi-layered Nextel/Kevlar Whipple shields, and self-sealing radiator loop channels.',
    },
    {
      id: 6,
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      title: '6. Launch Acoustic & 15G Loads',
      hazard: 'Rocket liftoff generates extreme acoustic sound pressure levels (>140 dB) and vibration that can shatter silicon micro-solder balls.',
      solution: 'Elastomeric isolators, underfill potting compounds, and ruggedized chassis packaging qualified for 20G random vibration testing.',
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-indigo-400" /> The Harsh Realities of Orbit & 2026 Solutions
        </h2>
        <p className="text-slate-400 text-sm mt-1">Deep technical breakdown of orbital hazards, thermodynamic limits, and aerospace mitigation strategies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${c.bgColor} ${c.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg">{c.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong>The Hazard:</strong> {c.hazard}
              </p>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <strong className="text-indigo-400 block mb-1">2026 Solution:</strong>
                {c.solution}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
