import React from 'react';
import { TrendingUp, Zap, Clock, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const EconomicsTab: React.FC = () => {
  const launchCostData = [
    { vehicle: 'Saturn V (1969)', cost: 18500 },
    { vehicle: 'Shuttle (1981)', cost: 54500 },
    { vehicle: 'Falcon 9 (2015)', cost: 2600 },
    { vehicle: 'Falcon Heavy (2018)', cost: 1400 },
    { vehicle: 'Starship V1 (2024)', cost: 350 },
    { vehicle: 'Starship V3 (2027+)', cost: 85 },
  ];

  const tcoComparisonData = [
    { year: 'Year 0', earth: 380, space: 650 },
    { year: 'Year 2', earth: 610, space: 690 },
    { year: 'Year 4', earth: 840, space: 780 },
    { year: 'Year 6', earth: 1070, space: 920 },
    { year: 'Year 8', earth: 1300, space: 1020 },
    { year: 'Year 10', earth: 1530, space: 1140 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-indigo-400" /> Economics & 10-Year TCO Analysis
        </h2>
        <p className="text-slate-400 text-sm mt-1">Modeling launch cost disruption, capital expenditures vs operating expenditures, and time-to-market advantages</p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Launch Cost Disruption Curve */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Launch Cost Disruption ($/kg to LEO)</h3>
              <p className="text-xs text-slate-400">Historical progression to Starship</p>
            </div>
            <span className="text-xs font-mono text-pink-400 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">99.6% Reduction</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={launchCostData}>
                <XAxis dataKey="vehicle" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(val: number) => [`$${val.toLocaleString()}/kg`, 'Launch Cost']} />
                <Line type="monotone" dataKey="cost" name="Cost ($/kg)" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 10-Year TCO Cumulative Model */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">10-Year Cumulative TCO ($M / 100MW Cluster)</h3>
              <p className="text-xs text-slate-400">High CapEx/Zero OpEx (Space) vs Low CapEx/Massive OpEx (Earth)</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Cross-Over: Yr 4.5</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tcoComparisonData}>
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(val: number) => [`$${val}M`, 'Cumulative Cost']} />
                <Legend />
                <Line type="monotone" dataKey="earth" name="Terrestrial 100MW (High OpEx)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="space" name="Orbital 100MW (Zero Electricity OpEx)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Economic Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Zero Electricity & Water OpEx</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            A terrestrial 100MW cluster spends ~$105M/year in commercial electricity (@ $0.12/kWh) and $12M in water treatment/HVAC maintenance. In Sun-Synchronous orbit, fuel and water operating costs are effectively $0.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Eliminating 5-Year Interconnect Queues</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The opportunity cost of delayed revenue in AI is massive. Terrestrial operators lose 3-5 years waiting for utility substation transformer deliveries, while orbital constellations scale as fast as launch vehicle manifests allow.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">3-Year Moore's Law Lifecycle Match</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rather than designing satellites for 15-year lifespans, orbital AI clusters are built for 3-5 year lifecycles. When GPUs become obsolete, satellites naturally deorbit and are replaced by next-gen silicon at lower launch costs.
          </p>
        </div>
      </div>

    </div>
  );
};
