import React, { useState } from 'react';
import { HardwareProfile } from '../types';
import { Cpu, Layers, ArrowUpDown } from 'lucide-react';

interface HardwareMatrixTabProps {
  hardware: HardwareProfile[];
}

export const HardwareMatrixTab: React.FC<HardwareMatrixTabProps> = ({ hardware }) => {
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [sortKey, setSortKey] = useState<keyof HardwareProfile>('efficiency_tflops_watt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const vendors = ['all', 'SpaceX / xAI', 'NVIDIA', 'Google', 'Groq', 'Tenstorrent', 'Cerebras'];

  const filteredHardware = hardware.filter((h) => 
    selectedVendor === 'all' ? true : h.vendor.toLowerCase().includes(selectedVendor.toLowerCase().split('/')[0].trim())
  );

  const sortedHardware = [...filteredHardware].sort((a, b) => {
    const valA = a[sortKey] ?? 0;
    const valB = b[sortKey] ?? 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return 0;
  });

  const handleSort = (key: keyof HardwareProfile) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-purple-400" /> Space-Rated Silicon & AI Acceleration Matrix
          </h2>
          <p className="text-slate-400 text-sm mt-1">Parametric database comparing thermal envelopes, compute density, mass efficiency, and radiation tolerance</p>
        </div>

        {/* Vendor Filter Buttons */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {vendors.map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVendor(v)}
              className={`px-3 py-1.5 rounded-lg font-medium transition capitalize ${
                selectedVendor === v
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Silicon Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedHardware.map((hw) => (
          <div key={hw.id} className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">{hw.vendor}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {hw.generation}
                </span>
              </div>
              <h3 className="font-bold text-white text-base mb-1">{hw.model}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{hw.heritage}</p>
            </div>

            <div className="space-y-2 font-mono text-xs pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">TDP Thermal Load:</span>
                <span className="font-bold text-white">{hw.tdp_watts} Watts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BF16 Tensor:</span>
                <span className="font-bold text-cyan-400">{hw.bf16_tflops.toLocaleString()} TFLOPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compute Density:</span>
                <span className="font-bold text-emerald-400">{hw.efficiency_tflops_watt} TFLOPS/W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Power-to-Mass:</span>
                <span className="font-bold text-amber-400">{hw.power_to_mass_w_kg} W/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Required Radiator:</span>
                <span className="font-bold text-pink-400">{hw.radiator_area_m2_per_kw} m²/kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TID Radiation Dose:</span>
                <span className="font-bold text-purple-300">{hw.tid_tolerance_krad} krad</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-purple-400 font-bold block mb-0.5">Rad Protection:</span>
              <span>{hw.rad_hardening}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Silicon Benchmark Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Parametric Silicon Specification Table
          </h3>
          <span className="text-xs text-slate-400 font-mono">Click headers to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5">Silicon Accelerator</th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => handleSort('tdp_watts')}>
                  TDP (W) <ArrowUpDown className="w-3 h-3 inline" />
                </th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => handleSort('bf16_tflops')}>
                  BF16 TFLOPS <ArrowUpDown className="w-3 h-3 inline" />
                </th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => handleSort('efficiency_tflops_watt')}>
                  TFLOPS/Watt <ArrowUpDown className="w-3 h-3 inline" />
                </th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => handleSort('power_to_mass_w_kg')}>
                  W / kg <ArrowUpDown className="w-3 h-3 inline" />
                </th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => handleSort('radiator_area_m2_per_kw')}>
                  Radiator (m²/kW) <ArrowUpDown className="w-3 h-3 inline" />
                </th>
                <th className="py-2.5 cursor-pointer hover:text-white" onClick={() => handleSort('tid_tolerance_krad')}>
                  TID (krad) <ArrowUpDown className="w-3 h-3 inline" />
                </th>
                <th className="py-2.5">Cooling Architecture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sortedHardware.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/30">
                  <td className="py-3">
                    <span className="font-bold text-white block">{h.model}</span>
                    <span className="text-[10px] text-slate-400">{h.vendor} &bull; {h.status}</span>
                  </td>
                  <td className="py-3 font-semibold text-white">{h.tdp_watts} W</td>
                  <td className="py-3 font-bold text-cyan-400">{h.bf16_tflops.toLocaleString()}</td>
                  <td className="py-3 font-bold text-emerald-400">{h.efficiency_tflops_watt}</td>
                  <td className="py-3 font-semibold text-amber-400">{h.power_to_mass_w_kg}</td>
                  <td className="py-3 text-pink-400">{h.radiator_area_m2_per_kw}</td>
                  <td className="py-3 font-bold text-purple-300">{h.tid_tolerance_krad} krad</td>
                  <td className="py-3 text-[11px] text-slate-400">{h.cooling_loop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
