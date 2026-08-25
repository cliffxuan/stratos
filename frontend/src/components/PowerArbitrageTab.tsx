import React, { useState } from 'react';
import { PowerMarketHub } from '../types';
import { Zap, Droplets, Clock, Flame, Globe } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PowerArbitrageTabProps {
  powerMarkets: PowerMarketHub[];
}

export const PowerArbitrageTab: React.FC<PowerArbitrageTabProps> = ({ powerMarkets }) => {
  const [clusterMW, setClusterMW] = useState<number>(50);

  const totalTerrestrialMW = clusterMW * 1.55;
  const kwhPerYear = totalTerrestrialMW * 1000 * 8760;
  const annualTerrestrialPowerBillUSD = kwhPerYear * 0.1185;
  const savingsPerSecondUSD = annualTerrestrialPowerBillUSD / (365 * 24 * 3600);

  const waterSavedMillionGal = ((clusterMW * 1000 * 8760 * 0.5) / 1e6).toFixed(1);
  const co2AvoidedMetricTons = Math.round((clusterMW * 1000 * 8760 * 0.380) / 1000);

  const chartData = powerMarkets.map((hub) => {
    const annualBill = (clusterMW * hub.pue_average * 1000 * 8760 * hub.effective_kwh_cost) / 1e6;
    const tenYearBill = annualBill * 10.0;
    return {
      hub: hub.hub_name.split('(')[0].trim(),
      annualCostM: Math.round(annualBill),
      tenYearCostM: Math.round(tenYearBill),
      pue: hub.pue_average,
    };
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Zap className="w-8 h-8 text-amber-400" /> Terrestrial Power Grid vs Orbital OpEx Arbitrage
        </h2>
        <p className="text-slate-400 text-sm mt-1">Real-time electricity market arbitrage, freshwater depletion elimination, and interconnect bottleneck analysis</p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-amber-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-amber-950/30 to-slate-950">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                Live Orbital OpEx Arbitrage Ticker ({clusterMW} MW Compute Cluster)
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              ${(annualTerrestrialPowerBillUSD / 1e6).toFixed(2)}M <span className="text-lg font-normal text-slate-400">/ year saved</span>
            </div>
            <p className="text-xs text-slate-400">
              Generating ${(savingsPerSecondUSD).toFixed(2)} in fuel & cooling savings every single second vs Northern Virginia grid rates.
            </p>
          </div>

          <div className="lg:w-80 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Target AI Cluster:</span>
              <span className="text-amber-400 font-bold">{clusterMW} MW IT Load</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={clusterMW}
              onChange={(e) => setClusterMW(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 MW (Node)</span>
              <span>100 MW (Hyperscale)</span>
              <span>500 MW (Gigacluster)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <Droplets className="w-6 h-6 text-cyan-400" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">Zero Water</span>
          </div>
          <span className="text-xs text-slate-400 uppercase">Freshwater Conserved</span>
          <p className="text-2xl font-bold text-white mt-1">{waterSavedMillionGal} M Gal/yr</p>
          <p className="text-[11px] text-slate-400 mt-1">Eliminates evaporative chiller towers.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <Globe className="w-6 h-6 text-emerald-400" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Scope 2 Zero</span>
          </div>
          <span className="text-xs text-slate-400 uppercase">CO2 Emissions Avoided</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{co2AvoidedMetricTons.toLocaleString()} MT/yr</p>
          <p className="text-[11px] text-slate-400 mt-1">100% direct space solar radiation.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Lead Time</span>
          </div>
          <span className="text-xs text-slate-400 uppercase">Grid Queue Delay</span>
          <p className="text-2xl font-bold text-purple-400 mt-1">0 Months</p>
          <p className="text-[11px] text-slate-400 mt-1">Scales linearly with launch cadence.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <Flame className="w-6 h-6 text-pink-400" />
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">PUE 1.05</span>
          </div>
          <span className="text-xs text-slate-400 uppercase">Parasitic Power Waste</span>
          <p className="text-2xl font-bold text-pink-400 mt-1">5% Overhead</p>
          <p className="text-[11px] text-slate-400 mt-1">vs 35%–55% on Earth fans & HVAC.</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-white text-base">10-Year Cumulative Electricity & Cooling Bill ($M USD)</h3>
            <p className="text-xs text-slate-400">Comparison across major global hubs for a {clusterMW} MW AI cluster</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Space = $0 Marginal Fuel
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="hub" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(val: number) => [`$${val}M`, '10-Yr OpEx']} />
              <Legend />
              <Bar dataKey="tenYearCostM" name="10-Year Cumulative Power & Cooling OpEx ($M)" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" /> Granular Utility Market Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5">Grid Hub & Region</th>
                <th className="py-2.5">Base Rate ($/kWh)</th>
                <th className="py-2.5">Peak Rate ($/kWh)</th>
                <th className="py-2.5">Cooling Water</th>
                <th className="py-2.5">Substation Queue</th>
                <th className="py-2.5">PUE</th>
                <th className="py-2.5">Constraint Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {powerMarkets.map((m) => (
                <tr key={m.hub_id} className="hover:bg-slate-800/30">
                  <td className="py-3">
                    <span className="font-bold text-white block">{m.hub_name}</span>
                    <span className="text-[10px] text-slate-400">{m.sub_region}</span>
                  </td>
                  <td className="py-3 font-semibold text-pink-400">${m.effective_kwh_cost.toFixed(4)}</td>
                  <td className="py-3 text-amber-400">${m.peak_summer_kwh_cost.toFixed(4)}</td>
                  <td className="py-3">{m.water_consumption_gal_per_mwh} Gal/MWh</td>
                  <td className="py-3 font-bold text-purple-400">
                    {m.grid_interconnect_queue_years > 0 ? `${m.grid_interconnect_queue_years} years` : '0 yrs (Manifest)'}
                  </td>
                  <td className="py-3 font-bold text-emerald-400">{m.pue_average.toFixed(2)}</td>
                  <td className="py-3 text-[11px] text-slate-400 max-w-xs">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
