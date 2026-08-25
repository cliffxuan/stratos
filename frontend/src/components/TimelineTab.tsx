import React, { useState } from 'react';
import { NewsItem, TimelineCategory } from '../types';
import { Newspaper } from 'lucide-react';

interface TimelineTabProps {
  timeline: NewsItem[];
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ timeline }) => {
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory>('all');

  const categories: { id: TimelineCategory; label: string }[] = [
    { id: 'all', label: 'All Updates' },
    { id: 'spacex', label: 'SpaceX' },
    { id: 'starcloud', label: 'Starcloud' },
    { id: 'google', label: 'Google' },
    { id: 'europe', label: 'EU / ASCEND' },
    { id: 'hardware', label: 'Hardware / NVIDIA' },
  ];

  const filteredTimeline = selectedCategory === 'all' 
    ? timeline 
    : timeline.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Newspaper className="w-8 h-8 text-indigo-400" /> Industry Intelligence & News Timeline
          </h2>
          <p className="text-slate-400 text-sm mt-1">Verified milestones, regulatory filings, venture rounds, and technical breakthroughs (2024–2027+)</p>
        </div>
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Breaking Story */}
      <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-purple-950/50">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-full bg-pink-500 text-white text-[11px] font-extrabold uppercase tracking-wider">BREAKING DEVELOPMENT</span>
          <span className="text-xs font-mono text-slate-400">August 2026</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Elon Musk Unveils SpaceX "Project Starmind" with NVIDIA Vera Rubin AI1 Constellation
        </h3>
        <p className="text-slate-300 leading-relaxed max-w-4xl text-sm sm:text-base mb-6">
          SpaceX has officially entered the orbital data center market with <strong>Project Starmind</strong>, a dedicated constellation of heavy compute satellites designed to power next-generation agentic AI and Grok models directly from Low Earth Orbit. Engineered with <strong>20-meter vertical chassis</strong> and <strong>70-meter deployable liquid radiator wings</strong>, each satellite node integrates space-optimized <strong>NVIDIA Vera Rubin NVL72</strong> architectures. Initial launches are targeted for <strong>Q4 2027</strong> via Starship from the Bastrop, TX Gigasat facility, with FCC filings exploring an eventual constellation of up to one million compute-enabled nodes.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Payload Platform</span>
            <span className="font-bold text-white text-sm">AI1 Satellite Bus</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Compute Partner</span>
            <span className="font-bold text-indigo-400 text-sm">NVIDIA Vera Rubin</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Active Cooling</span>
            <span className="font-bold text-emerald-400 text-sm">70m Liquid Radiators</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block">Launch Target</span>
            <span className="font-bold text-pink-400 text-sm">Q4 2027 (Starship)</span>
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredTimeline.map((item) => (
          <div key={item.id} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                  {item.date}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-mono">
                  {item.badge}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
