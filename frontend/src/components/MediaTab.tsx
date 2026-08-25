import React from 'react';
import { Video, Play, FileText } from 'lucide-react';

export const MediaTab: React.FC = () => {
  const videos = [
    {
      id: 'BYXbuik3dgA',
      title: 'Are space GPUs practical? – Elon Musk',
      tag: 'DWARKESH PODCAST (2026)',
      tagColor: 'text-pink-400',
      description: 'Musk explains the fundamental physics of terrestrial power constraints, the 1,361 W/m² solar constant in LEO, and the rationale behind SpaceX Project Starmind.',
    },
    {
      id: 'an6ZM0iCGQw',
      title: "Let's Build AI Data Centers in Space",
      tag: 'TED TALK • STARCLOUD',
      tagColor: 'text-indigo-400',
      description: 'Starcloud CEO Philip Johnston details the thermodynamic and economic breakdown of orbital server clusters and their mission to bypass Earth\'s power grid.',
    },
    {
      id: 'DCto6UkBJoI',
      title: 'Why Everyone Is Talking About Data Centers In Space',
      tag: 'AEROSPACE ENGINEERING',
      tagColor: 'text-cyan-400',
      description: 'Scott Manley breaks down the exact orbital physics of radiative cooling in a vacuum, heat rejection limits, and radiation hardening trade-offs.',
    },
    {
      id: 'hKw6cRKcqzY',
      title: 'Inside The Startup Launching AI Into Space',
      tag: 'CNBC / TECH INSIDER',
      tagColor: 'text-purple-400',
      description: 'A behind-the-scenes investigative look into the hardware cleanrooms, shaker table testing, and thermal vacuum chamber validation at Starcloud.',
    },
  ];

  const papers = [
    {
      title: 'European Commission ASCEND Feasibility Final Report',
      authors: 'Thales Alenia Space, ArianeGroup, Carbone 4 (2026)',
      badge: 'EU Horizon',
      badgeColor: 'text-emerald-400',
    },
    {
      title: 'Project Suncatcher: Solar-Powered Orbital ML Clusters',
      authors: 'Google Research & Planet Labs Technical Report (2025/2026)',
      badge: 'Google ML',
      badgeColor: 'text-blue-400',
    },
    {
      title: 'High-Density Radiative Cooling in Vacuum for Terawatt Scale AI',
      authors: 'AIAA Journal of Spacecraft and Rockets (2026)',
      badge: 'AIAA Review',
      badgeColor: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Video className="w-8 h-8 text-indigo-400" /> Essential Talks, Interviews & Technical Deep Dives
        </h2>
        <p className="text-slate-400 text-sm mt-1">Curated research presentations from founders, aerospace engineers, and industry leaders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((v) => (
          <div key={v.id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className={`flex items-center space-x-2 text-xs font-bold mb-2 ${v.tagColor}`}>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{v.tag}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{v.description}</p>
            </div>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group">
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
                  }}
                  alt={v.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-0.5 fill-white" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        ))}

        {/* Papers Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-2">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>RESEARCH REPOSITORY & PAPERS</span>
            </div>
            <h3 className="font-bold text-white text-xl mb-2">Key Research Papers & Publications</h3>
            <div className="space-y-3 mt-4 text-xs">
              {papers.map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{p.title}</span>
                    <span className="text-slate-400">{p.authors}</span>
                  </div>
                  <span className={`px-2 py-1 rounded bg-slate-800 ${p.badgeColor} font-mono text-[10px]`}>
                    {p.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
