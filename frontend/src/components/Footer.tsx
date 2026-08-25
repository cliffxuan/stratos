import React from 'react';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-card border-t border-slate-800/80 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">Project Stratos</span>
              <p className="text-xs text-slate-400">Strategic Orbital Cloud & Space AI Research Platform</p>
            </div>
          </div>
          
          <div className="text-center md:text-right text-xs text-slate-400 space-y-1">
            <p>
              &copy; 2026 Project Stratos &bull; Brought to you by{' '}
              <a
                href="https://www.algoentropy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                AlgoEntropy
              </a>.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Telemetry & infrastructure estimates benchmarked on Starship Block 2/3 & NVIDIA Space-1 Vera Rubin architectures.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
