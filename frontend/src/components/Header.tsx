import React, { useState } from 'react';
import { TabId } from '../types';
import { Globe, Menu, X, Orbit } from 'lucide-react';

interface HeaderProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabId; label: string; badge?: string }[] = [
    { id: 'summary', label: 'Overview' },
    { id: 'timeline', label: 'News & Timeline', badge: '2026' },
    { id: 'energy', label: 'Thermodynamics' },
    { id: 'orbital', label: 'Mechanics Sim' },
    { id: 'players', label: 'Ecosystem' },
    { id: 'economics', label: 'Economics & TCO' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'media', label: 'Media & Talks' },
  ];

  const handleTabClick = (id: TabId) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleTabClick('summary')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">STRATOS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">v2.6</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Orbital Computing Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === item.id
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => handleTabClick('orbital')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Orbit className="w-3.5 h-3.5" /> Launch Sim
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
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
        <div className="xl:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === item.id
                  ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
