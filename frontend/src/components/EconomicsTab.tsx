import React, { useState, useEffect } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const EconomicsTab: React.FC = () => {
  const [powerMW, setPowerMW] = useState<number>(50);
  const [launchCostKg, setLaunchCostKg] = useState<number>(200);
  const [radiatorTempC, setRadiatorTempC] = useState<number>(75);
  const [gpuLifespanYrs, setGpuLifespanYrs] = useState<number>(3.5);
  const [powerInflationPct, setPowerInflationPct] = useState<number>(4.5);

  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    const fetchSim = async () => {
      try {
        const res = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            power_mw: powerMW,
            launch_cost_per_kg: launchCostKg,
            radiator_temp_c: radiatorTempC,
            gpu_lifespan_years: gpuLifespanYrs,
            terrestrial_power_inflation_pct: powerInflationPct,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setSimResult(data);
        }
      } catch (e) {
        console.warn('Simulation API fetch error', e);
      }
    };

    fetchSim();
  }, [powerMW, launchCostKg, radiatorTempC, gpuLifespanYrs, powerInflationPct]);

  const historicalLaunchData = [
    { vehicle: 'Saturn V (1969)', cost: 18500 },
    { vehicle: 'Space Shuttle (1981)', cost: 54500 },
    { vehicle: 'Falcon 9 (2015)', cost: 2600 },
    { vehicle: 'Falcon Heavy (2018)', cost: 1400 },
    { vehicle: 'Starship Block 1 (2024)', cost: 350 },
    { vehicle: 'Starship Block 2/3 (2027+)', cost: 85 },
  ];

  const tcoData = simResult?.financial?.tco_timeline || [
    { year: 'Year 0', terrestrial_tco_m: 425, orbital_tco_m: 510 },
    { year: 'Year 2', terrestrial_tco_m: 680, orbital_tco_m: 550 },
    { year: 'Year 4', terrestrial_tco_m: 940, orbital_tco_m: 680 },
    { year: 'Year 6', terrestrial_tco_m: 1210, orbital_tco_m: 810 },
    { year: 'Year 8', terrestrial_tco_m: 1490, orbital_tco_m: 940 },
    { year: 'Year 10', terrestrial_tco_m: 1780, orbital_tco_m: 1080 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-indigo-400" /> Economics & 10-Year Cumulative TCO Engine
        </h2>
        <p className="text-slate-400 text-sm mt-1">Interactive financial modeling: High CapEx / Zero OpEx (Space) vs Low CapEx / Exponential OpEx (Earth)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders Box */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-5">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" /> Simulation Parameters
          </h3>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Cluster Capacity:</span>
                <span className="text-indigo-400 font-bold">{powerMW} MW</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={powerMW}
                onChange={(e) => setPowerMW(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Starship Launch $/kg:</span>
                <span className="text-pink-400 font-bold">${launchCostKg}/kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={launchCostKg}
                onChange={(e) => setLaunchCostKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-pink-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Radiator Temp (°C):</span>
                <span className="text-purple-400 font-bold">{radiatorTempC} °C</span>
              </div>
              <input
                type="range"
                min="40"
                max="110"
                step="5"
                value={radiatorTempC}
                onChange={(e) => setRadiatorTempC(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">GPU Lifespan Cycle:</span>
                <span className="text-cyan-400 font-bold">{gpuLifespanYrs} Years</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.5"
                value={gpuLifespanYrs}
                onChange={(e) => setGpuLifespanYrs(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Terrestrial Power Inflation:</span>
                <span className="text-amber-400 font-bold">{powerInflationPct}% / yr</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="10.0"
                step="0.5"
                value={powerInflationPct}
                onChange={(e) => setPowerInflationPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {simResult && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Payback Crossover:</span>
                <span className="text-emerald-400 font-bold">Year {simResult.financial.crossover_payback_year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">10-Yr NPV Savings:</span>
                <span className="text-cyan-400 font-bold">${simResult.financial.ten_year_npv_savings_million_usd}M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Starship Flights:</span>
                <span className="text-pink-400 font-bold">{simResult.physics.starship_launches_required} Launches</span>
              </div>
            </div>
          )}
        </div>

        {/* 10-Year Cumulative TCO Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">10-Year Cumulative TCO Crossover Model ($M USD)</h3>
              <p className="text-xs text-slate-400">Modeling zero marginal power/cooling OpEx vs terrestrial escalation</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Crossover: {simResult?.financial?.crossover_payback_year ? `Year ${simResult.financial.crossover_payback_year}` : 'Year 3.5'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tcoData}>
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(val: number) => [`$${val}M`, 'Cumulative TCO']} />
                <Legend />
                <Line type="monotone" dataKey="terrestrial_tco_m" name="Terrestrial (High Power & Cooling OpEx)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="orbital_tco_m" name="Orbital (Zero Electricity OpEx)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {simResult && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs text-center">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Terrestrial LCOC</span>
                <span className="text-lg font-bold text-rose-400">{simResult.financial.lcoc_terrestrial_cents_per_pflop_hr} ¢</span>
                <span className="text-[10px] text-slate-500 block">per PFLOP-hour</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Orbital LCOC</span>
                <span className="text-lg font-bold text-emerald-400">{simResult.financial.lcoc_orbital_cents_per_pflop_hr} ¢</span>
                <span className="text-[10px] text-slate-500 block">per PFLOP-hour (35% lower)</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Historical Launch Cost Curve */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Launch Cost Disruption Curve ($/kg to LEO)</h3>
            <p className="text-xs text-slate-400">Historical progression to Starship Block 2/3</p>
          </div>
          <span className="text-xs font-mono text-pink-400 bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">99.6% Reduction</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalLaunchData}>
              <XAxis dataKey="vehicle" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} formatter={(val: number) => [`$${val.toLocaleString()}/kg`, 'Cost to LEO']} />
              <Line type="monotone" dataKey="cost" name="Launch Cost ($/kg)" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
