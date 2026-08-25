import React, { useState } from 'react';
import { PowerMarketHub, HardwareProfile } from '../types';
import { Flame, Calculator, Cpu, Globe } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface ThermodynamicsTabProps {
  powerMarkets: PowerMarketHub[];
  hardwareProfiles: HardwareProfile[];
}

export const ThermodynamicsTab: React.FC<ThermodynamicsTabProps> = ({ powerMarkets, hardwareProfiles }) => {
  const [powerMW, setPowerMW] = useState<number>(10);
  const [radiatorTempC, setRadiatorTempC] = useState<number>(70);

  const tempK = radiatorTempC + 273.15;
  const sigma = 5.670374e-8;
  const eps = 0.92;
  const tSpace = 3.0;
  const thermalFluxWPerM2 = eps * sigma * (Math.pow(tempK, 4) - Math.pow(tSpace, 4));

  const totalWatts = powerMW * 1e6;
  const radiatorAreaM2 = Math.round(totalWatts / (thermalFluxWPerM2 * 2));
  const solarAreaM2 = Math.round(totalWatts / (1361.0 * 0.33));
  const waterSavedMGal = ((powerMW * 1000 * 8760 * 0.5) / 1e6).toFixed(1);
  const totalMassTons = Math.round((powerMW * 1000 * 18) / 1000);
  const starshipFlights = Math.max(1, Math.ceil(totalMassTons / 120));

  const powerTrendData = [
    { year: '2022', aiDemand: 340, gridAllocated: 500 },
    { year: '2024', aiDemand: 460, gridAllocated: 580 },
    { year: '2026', aiDemand: 680, gridAllocated: 690 },
    { year: '2028', aiDemand: 1050, gridAllocated: 800 },
    { year: '2030', aiDemand: 1600, gridAllocated: 920 },
    { year: '2032', aiDemand: 2400, gridAllocated: 1050 },
    { year: '2034', aiDemand: 3500, gridAllocated: 1180 },
  ];

  const temps = [30, 40, 50, 60, 70, 80, 90, 100, 110];
  const radianceData = temps.map(t => {
    const tk = t + 273.15;
    return {
      temp: `${t}°C`,
      flux: Math.round(eps * sigma * (Math.pow(tk, 4) - Math.pow(tSpace, 4))),
    };
  });

  const earthPueData = [
    { name: 'Compute Load', value: 1.0, color: '#38bdf8' },
    { name: 'HVAC / Cooling Waste', value: 0.55, color: '#f43f5e' },
  ];

  const spacePueData = [
    { name: 'Compute Load', value: 1.0, color: '#38bdf8' },
    { name: 'Micro-Pump Loops', value: 0.05, color: '#10b981' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Flame className="w-8 h-8 text-indigo-400" /> Thermodynamics: Earth vs Orbital Physics
        </h2>
        <p className="text-slate-400 text-sm mt-1">Comparing power generation, cooling physics, and parasitic energy overhead</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Global AI Power Demand vs Grid Limits</h3>
              <p className="text-xs text-slate-400">Projected TeraWatt-Hours (TWh) per year</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">35% CAGR</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerTrendData}>
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="aiDemand" name="AI Demand (TWh)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="gridAllocated" name="Grid Allocation (TWh)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Power Usage Effectiveness (PUE) Breakdown</h3>
              <p className="text-xs text-slate-400">Energy required per 1.00 Unit of compute</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="text-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Terrestrial (Fans/AC)</span>
              <div className="relative w-28 h-28 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={earthPueData} innerRadius={35} outerRadius={50} dataKey="value" stroke="none">
                      {earthPueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-extrabold text-lg text-rose-400">1.55</span>
                  <span className="text-[8px] text-slate-400">PUE</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">35% wasted on chillers & pumps</p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Orbital (Radiative)</span>
              <div className="relative w-28 h-28 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={spacePueData} innerRadius={35} outerRadius={50} dataKey="value" stroke="none">
                      {spacePueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-extrabold text-lg text-emerald-400">1.05</span>
                  <span className="text-[8px] text-slate-400">PUE</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">5% micro-pumps &bull; 0 water</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Stefan-Boltzmann Thermal Radiance</h3>
              <p className="text-xs text-slate-400">Heat radiated q = ε σ (T_rad⁴ - T_space⁴) in Watts per m²</p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">T⁴ Scaling</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={radianceData}>
                <XAxis dataKey="temp" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="flux" name="Thermal Radiance (W/m²)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" /> Orbital Cluster Sizing Calculator
            </h3>
            <p className="text-xs text-slate-400">Calculate radiator area & solar array mass for your AI cluster</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Compute Cluster Power:</span>
                <span className="text-indigo-400 font-bold">{powerMW} MW</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={powerMW}
                onChange={(e) => setPowerMW(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Radiator Operating Temp:</span>
                <span className="text-purple-400 font-bold">{radiatorTempC} °C ({Math.round(tempK)} K)</span>
              </div>
              <input
                type="range"
                min="30"
                max="110"
                step="5"
                value={radiatorTempC}
                onChange={(e) => setRadiatorTempC(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Radiator Area Req.</span>
              <span className="text-lg font-bold text-white">{radiatorAreaM2.toLocaleString()} m²</span>
              <span className="text-[10px] text-slate-500 block">Double-sided wings</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Solar Array Area</span>
              <span className="text-lg font-bold text-indigo-400">{solarAreaM2.toLocaleString()} m²</span>
              <span className="text-[10px] text-slate-500 block">33% GaInP cells</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Water Saved / Year</span>
              <span className="text-lg font-bold text-emerald-400">{waterSavedMGal} M Gal</span>
              <span className="text-[10px] text-slate-500 block">vs evaporative towers</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase block">Starship Launches</span>
              <span className="text-lg font-bold text-pink-400">{starshipFlights} Flights</span>
              <span className="text-[10px] text-slate-500 block">@ 120T net payload</span>
            </div>
          </div>
        </div>
      </div>

      {powerMarkets && powerMarkets.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" /> Terrestrial Grid Power vs Orbital OpEx Arbitrage
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2">Grid Hub / Location</th>
                  <th className="py-2">Power Price ($/MWh)</th>
                  <th className="py-2">Effective $/kWh</th>
                  <th className="py-2">Cooling Water (Gal/MWh)</th>
                  <th className="py-2">Interconnect Delay</th>
                  <th className="py-2">PUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {powerMarkets.map((m) => (
                  <tr key={m.hub_id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-white">{m.hub_name}</td>
                    <td className="py-2.5 font-semibold text-pink-400">${m.power_price_per_mwh.toFixed(2)}</td>
                    <td className="py-2.5">${m.effective_kwh_cost.toFixed(4)}</td>
                    <td className="py-2.5">{m.water_consumption_gal_per_mwh} Gal</td>
                    <td className="py-2.5">{m.grid_interconnect_queue_years > 0 ? `${m.grid_interconnect_queue_years} yrs` : '0 yrs (Launch Manifest)'}</td>
                    <td className="py-2.5 font-bold text-emerald-400">{m.pue_average.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hardwareProfiles && hardwareProfiles.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" /> Space-Rated Silicon & AI Acceleration Hardware Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hardwareProfiles.map((hw) => (
              <div key={hw.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-indigo-400">{hw.vendor}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{hw.generation}</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">{hw.model}</h4>
                <div className="space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>TDP / Power:</span>
                    <span className="text-white font-bold">{hw.tdp_watts} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BF16 Compute:</span>
                    <span className="text-cyan-400 font-bold">{hw.bf16_tflops} TFLOPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efficiency:</span>
                    <span className="text-emerald-400 font-bold">{hw.efficiency_tflops_watt} TFLOPS/W</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rad Protection:</span>
                    <span className="text-purple-300">{hw.rad_hardening.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
