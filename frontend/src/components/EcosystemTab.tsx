import React from 'react';
import { Rocket, Sparkles, Brain, Cpu, Radio, Moon, Shield, Globe } from 'lucide-react';

export const EcosystemTab: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Globe className="w-8 h-8 text-indigo-400" /> The Orbital Cloud Strategic Landscape
        </h2>
        <p className="text-slate-400 text-sm mt-1">From heavy-lift launch enablers to specialized space cloud hyperscalers and radiation-tolerant silicon</p>
      </div>

      {/* Layer 1: Launch & Heavy-Lift */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-300 text-xs font-mono font-bold">LAYER 1</span>
          <h3 className="text-xl font-bold text-white">Heavy-Lift Launch & Infrastructure Enablers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">SpaceX (Starship & Starlink)</h4>
                  <p className="text-xs text-slate-400">Vertically integrated launch + orbital laser constellation</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Dominant Layer</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              SpaceX operates the complete vertical stack: Starship Block 2/3 (100T-150T payload capacity to LEO), Starlink's global Free-Space Optical (FSO) laser backbone, and Starshield defense infrastructure. Starship's high payload envelope enables full-size data center racks and thick shielding without micro-miniaturization penalties.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Payload/Flight</span>
                <span className="font-bold text-white">100–150T</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Target Cost/kg</span>
                <span className="font-bold text-pink-400">&lt; $200</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Laser Mesh</span>
                <span className="font-bold text-cyan-400">10,000+ Sats</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Blue Origin (New Glenn)</h4>
                  <p className="text-xs text-slate-400">Heavy lift 45T payload with 7-meter fairing capacity</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Alternative Heavy</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              New Glenn provides commercial multi-megawatt cluster deployment capabilities with its massive 7-meter payload fairing, giving commercial space data operators redundancy against single-provider launch bottlenecks.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Fairing Diameter</span>
                <span className="font-bold text-white">7.0 Meters</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Payload to LEO</span>
                <span className="font-bold text-blue-400">45 Tons</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Booster Reuse</span>
                <span className="font-bold text-emerald-400">25+ Flights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2: Dedicated Hyperscalers */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">LAYER 2</span>
          <h3 className="text-xl font-bold text-white">Orbital Cloud Operators & AI Constellations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">$2.3B Val</span>
            </div>
            <h4 className="font-bold text-white text-base">Starcloud (Lumen Orbit)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pioneered in-orbit GPU compute with Starcloud-1 (H100 NanoGPT training, Nov 2025). Building commercial constellation for AI training and inference with NVIDIA Space-1 Vera Rubin modules.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <div><strong>Funding:</strong> $450M (NVIDIA, Cisco, Benchmark)</div>
              <div><strong>Next Launch:</strong> Starcloud-2 Cluster (Q4 2026)</div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[10px]">Announced 2026</span>
            </div>
            <h4 className="font-bold text-white text-base">SpaceX Project Starmind</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              SpaceX's AI1 mega-constellation featuring NVIDIA Vera Rubin NVL72 compute and 70m deployable liquid radiators. Fabricated at Bastrop Gigasat factory to power Grok models.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <div><strong>Node Size:</strong> 20m height / 70m wingspan</div>
              <div><strong>First Deployment:</strong> Q4 2027 (Starship)</div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">Moonshot</span>
            </div>
            <h4 className="font-bold text-white text-base">Google Project Suncatcher</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Research architecture deploying modular solar satellite fleets equipped with custom TPU Trillium (v6e) processors linked by high-throughput free-space optical laser bridges.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <div><strong>Silicon:</strong> Google TPU Trillium v6e</div>
              <div><strong>Test Mission:</strong> 2 Sats with Planet Labs (2027)</div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">EU Sovereign</span>
            </div>
            <h4 className="font-bold text-white text-base">EU Project ASCEND</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              European Commission initiative led by Thales Alenia Space. Validated 200MW space clusters to bypass EU grid saturation, eliminate carbon footprint, and secure European digital sovereignty.
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
              <div><strong>Cluster Size:</strong> 200 Megawatts baseline</div>
              <div><strong>Target Launcher:</strong> Ariane Next / Eco-heavy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Silicon & Relays */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">LAYER 3</span>
          <h3 className="text-xl font-bold text-white">Silicon, Optical Relay & Specialized Nodes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <Cpu className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-white text-base">NVIDIA Space Architecture</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developed the <strong>Space-1 Vera Rubin module</strong> and <strong>Vera CPU</strong> with hardware-level Triple Modular Redundancy (TMR) to mitigate cosmic ray bit-flips without heavy lead penalties.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <Radio className="w-6 h-6 text-cyan-400" />
              <h4 className="font-bold text-white text-base">Kepler Communications</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides commercial low-latency optical data relay networks (Aether mesh), enabling multi-gigabit orbital cross-links and direct downlinks to ground stations.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <Moon className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold text-white text-base">Lonestar Data Holdings</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deploying ultra-secure archival data centers in Lunar lava tubes, creating an off-planet immutable disaster recovery and civilization backup layer.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
