import React from 'react';
import { TabId } from '../types';
import { Sun, Snowflake, Rocket, Cpu, Flame, CheckCircle, XCircle, Sparkles, ArrowRight, ShieldAlert, Zap } from 'lucide-react';
import { getTabPath } from '../utils/routing';

interface OverviewTabProps {
  onSelectTab: (tab: TabId) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-8 md:p-12 border border-slate-800 gradient-glow">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>State of Orbital Compute &bull; 2026 Industry Report</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Orbital Data <br className="hidden sm:inline" />
            <span className="gradient-text">Infrastructure Shift</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
            Terrestrial AI data centers are colliding with the "Thermodynamic & Grid Wall"—5 to 7 year utility interconnection backlogs and massive freshwater consumption. Computing in Low Earth Orbit (LEO) unlocks <strong>24/7 unfiltered solar flux (1,361 W/m²)</strong> and <strong>infinite radiative cooling into the 3 Kelvin cosmic vacuum</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={getTabPath('tracking')}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onSelectTab('tracking');
                }
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" /> Live Constellation & Laser Mesh
            </a>
            <a
              href={getTabPath('arbitrage')}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault();
                  onSelectTab('arbitrage');
                }
              }}
              className="px-6 py-3 rounded-xl glass-card hover:bg-slate-800/80 text-slate-200 font-semibold text-sm border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" /> Real-Time Grid Arbitrage
            </a>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sun className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-semibold">AM0 Flux</span>
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solar Power Density</h3>
          <p className="text-3xl font-extrabold text-white mt-1">1,361 <span className="text-sm font-normal text-slate-400">W/m²</span></p>
          <p className="text-xs text-slate-400 mt-2">+35% vs peak Earth ground irradiance; continuous in Sun-Synchronous Orbits.</p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Snowflake className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Radiative</span>
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cooling Efficiency (PUE)</h3>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">1.05 <span className="text-sm font-normal text-slate-400">PUE</span></p>
          <p className="text-xs text-slate-400 mt-2">Zero water consumption; eliminates 40% terrestrial fan and HVAC parasite loads.</p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-pink-500/20 text-pink-300 font-semibold">Starship Cadence</span>
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Launch Cost</h3>
          <p className="text-3xl font-extrabold text-pink-400 mt-1">&lt; $200 <span className="text-sm font-normal text-slate-400">/ kg</span></p>
          <p className="text-xs text-slate-400 mt-2">Starship Block 2/3 payload capacity (100T-150T to LEO) enables modular rack deployment.</p>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-semibold">Validated 2025</span>
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">In-Orbit AI Training</h3>
          <p className="text-3xl font-extrabold text-cyan-400 mt-1">H100 <span className="text-sm font-normal text-slate-400">Heritage</span></p>
          <p className="text-xs text-slate-400 mt-2">Starcloud-1 trained NanoGPT in orbit; SpaceX AI1 & Google Suncatcher in test pipeline.</p>
        </div>
      </div>

      {/* Problem vs Solution Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Terrestrial Wall</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Data centers are on track to consume over <strong>1,000 TWh (&gt;3.5% of global power)</strong> by 2030. AI cluster scaling is no longer constrained by chip supply, but by physical reality on Earth:
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start">
              <XCircle className="w-5 h-5 text-rose-400 mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>5-7 Year Grid Queues:</strong> High-voltage substation interconnects in major hubs (Northern Virginia, Dublin, Silicon Valley) are saturated.</span>
            </li>
            <li className="flex items-start">
              <XCircle className="w-5 h-5 text-rose-400 mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Massive Water Depletion:</strong> A 100MW data center consumes up to 2 million gallons of freshwater daily for evaporative cooling.</span>
            </li>
            <li className="flex items-start">
              <XCircle className="w-5 h-5 text-rose-400 mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Thermal Parasite Load:</strong> 35%–45% of total power input is wasted on chillers, fans, and cooling towers rather than compute.</span>
            </li>
          </ul>
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 mr-1 inline-block align-text-bottom text-rose-400" />
            <strong>Grid Cap:</strong> Major utilities have halted new 50MW+ data center permits without dedicated self-funded nuclear/gas infrastructure.
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Orbital Solution</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Low Earth Orbit converts space into an industrial computing layer, operating as a clean energy sovereign cloud:
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Continuous Solar Capture:</strong> Sun-Synchronous Dawn-Dusk orbits provide 100% duty cycle solar power without battery buffer cycling.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Passive Vacuum Radiators:</strong> Heat is radiated into space via liquid loop heat pipes, requiring zero water and near-zero parasitic energy.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-400 mr-2.5 mt-0.5 flex-shrink-0" />
              <span><strong>Zero Permitting Bottleneck:</strong> Launch cadence replaces utility queues; modular satellites scale capacity linearly.</span>
            </li>
          </ul>
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
            <Zap className="w-4 h-4 mr-1 inline-block align-text-bottom text-indigo-400" />
            <strong>Optical Mesh:</strong> Space-to-space laser cross-links (ISL) connect orbital clusters at speed-of-light in vacuum (300,000 km/s vs 200,000 km/s in fiber).
          </div>
        </div>
      </div>

      {/* 2026 Spotlight Cards */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> 2025–2026 Key Industry Pillars
            </h3>
            <p className="text-xs text-slate-400">Major hyperscalers and startups transitioning from concept to operational hardware</p>
          </div>
          <a
            href={getTabPath('timeline')}
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onSelectTab('timeline');
              }
            }}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            View Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-pink-400">SpaceX</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">Project Starmind</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-1">AI1 Satellite Constellation</h4>
            <p className="text-xs text-slate-400">20m tall compute nodes with 70m deployable radiator wings powered by NVIDIA Vera Rubin NVL72 architectures for agentic AI workloads.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-400">Starcloud</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">$450M Total Raised</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Starcloud-1 & Starcloud-2</h4>
            <p className="text-xs text-slate-400">World's first orbital H100 AI training (Nov 2025). Starcloud-2 multi-GPU cluster scheduled for Q4 2026 launch backed by NVIDIA and Cisco.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400">Google</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Project Suncatcher</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-1">Orbital TPU Fleets</h4>
            <p className="text-xs text-slate-400">Radiation-tested TPU Trillium (v6e) nodes linked via high-speed optical crosslinks; orbital prototype mission planned with Planet Labs.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400">EU ASCEND</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Thales Alenia Space</span>
            </div>
            <h4 className="font-bold text-white text-sm mb-1">200MW Sovereign Cloud</h4>
            <p className="text-xs text-slate-400">EU Commission study confirmed technical viability of 200MW space data centers to bypass European grid caps and protect digital sovereignty.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
