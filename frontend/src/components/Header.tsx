import React, { useState } from 'react';
import { TabId, TelemetryData } from '../types';
import { Globe, Menu, X, Radio } from 'lucide-react';

interface HeaderProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  telemetry: TelemetryData | null;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, telemetry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabId; label: string; live?: boolean }[] = [
    { id: 'summary', label: 'Overview' },
    { id: 'tracking', label: 'Orbit Track', live: true },
    { id: 'arbitrage', label: 'Grid Arbitrage' },
    { id: 'hardware', label: 'Silicon Matrix' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'energy', label: 'Thermodynamics' },
    { id: 'economics', label: 'Financial TCO' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'media', label: 'Media' },
  ];

  const handleTabClick = (id: TabId) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const kp = telemetry?.kp_index ?? 2.4;
  const isStorm = kp >= 5.0;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-[#070a13]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
            onClick={() => handleTabClick('summary')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-extrabold text-base text-white tracking-tight">STRATOS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                v2.0
              </span>
            </div>
          </div>

          {/* Centered Navigation Tabs */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentTab === item.id
                    ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.live && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Live Space Status Pill */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
              <Radio className={`w-3 h-3 ${isStorm ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span className="text-slate-400">Flux:</span>
              <span className="text-white font-bold">{telemetry?.f107_flux ?? 145.2}</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">Kp:</span>
              <span className={`font-bold ${isStorm ? 'text-rose-400' : 'text-emerald-400'}`}>{kp}</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 text-2xl focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-between ${
                currentTab === item.id
                  ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <span>{item.label}</span>
              {item.live && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  LIVE
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
