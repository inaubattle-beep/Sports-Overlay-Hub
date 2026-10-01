import React, { useEffect, useState } from 'react';
import { useMatchStore } from '../../stores/useMatchStore';
import { ScoreboardRenderer } from '../../scoreboards/ScoreboardRenderer';
import { MobileRemoteController } from '../mobile/MobileRemoteController';
import { Copy, ExternalLink, Tv, Radio, Plus, Smartphone, Monitor, LayoutTemplate } from 'lucide-react';

interface Props {
  onOpenCreateMatch: () => void;
}

export const UserDashboard: React.FC<Props> = ({ onOpenCreateMatch }) => {
  const { matches, activeMatch, fetchMatches, selectMatch, sendScoreEvent, undoLastEvent } = useMatchStore();
  const [copiedToken, setCopiedToken] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState<string>('football-glossy');

  useEffect(() => {
    fetchMatches();
  }, []);

  const activeToken = activeMatch?.broadcastOutputs?.[0]?.token || 'abc123demo';
  const obsUrl = `${window.location.origin}/overlay/${activeToken}`;

  const copyObsUrl = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const canvasOptions = [
    { slug: 'football-glossy', label: 'Football Glossy 3D' },
    { slug: 'gaa-pro', label: '☘️ GAA Goals & Points (2-10)' },
    { slug: 'football-minimal', label: 'Football Minimal Neon' },
    { slug: 'cricket-pro', label: 'Cricket Pro League' },
    { slug: 'volleyball-pro', label: 'Volleyball Set Score' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Value Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[11px] font-bold text-blue-300 uppercase tracking-widest mb-2">
              ⚡ Instant Scoreboard Setup
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white">Create a Live Scoreboard in Seconds</h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mt-1">
              Customize the display, share one link, and run the match from any phone, tablet, or laptop — no download, no hardware needed.
            </p>
          </div>
          <button
            onClick={onOpenCreateMatch}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-500/25 flex items-center gap-2 active:scale-95 transition shrink-0"
          >
            <Plus className="w-4 h-4" /> Start Live Scoreboard
          </button>
        </div>

        {/* Feature Pill Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-blue-400 font-bold">🎨</span>
            <span className="text-slate-300 font-bold">Customize Display</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-emerald-400 font-bold">🔗</span>
            <span className="text-slate-300 font-bold">Share One Link</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-amber-400 font-bold">📱</span>
            <span className="text-slate-300 font-bold">Phone Remote Control</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-purple-400 font-bold">🚀</span>
            <span className="text-slate-300 font-bold">Zero Download / Hardware</span>
          </div>
        </div>
      </div>

      {/* Matches List Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
            Broadcast Control Center
          </span>
          <h2 className="text-2xl font-black text-white">Live Matches & Overlays</h2>
        </div>

        {/* Matches Select Dropdown & New Match CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={activeMatch?.id || ''}
            onChange={(e) => {
              const target = matches.find((m) => m.id === Number(e.target.value));
              if (target) selectMatch(target);
            }}
            className="flex-1 md:w-64 bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded-xl px-4 py-2.5 outline-none shadow"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.sport?.code})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenCreateMatch}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> New Match
          </button>
        </div>
      </div>

      {activeMatch ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Top: Live Scoreboard Preview & OBS Source Link */}
          <div className="lg:col-span-7 space-y-6">
            {/* Scoreboard Preview Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Tv className="w-4 h-4 text-emerald-400" /> Live Scoreboard Canvas Preview (900x200)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                      viewMode === 'desktop' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                      viewMode === 'mobile' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Mobile Remote Preview"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Template Canvas Selector Options */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" /> Canvas Options:
                </span>
                {canvasOptions.map((opt) => (
                  <button
                    key={opt.slug}
                    onClick={() => setSelectedTemplateSlug(opt.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition border ${
                      selectedTemplateSlug === opt.slug
                        ? 'bg-blue-600 text-white border-blue-400 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Render Canvas Preview */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-x-auto min-h-[220px]">
                <ScoreboardRenderer match={activeMatch} templateSlug={selectedTemplateSlug} scale={0.8} />
              </div>
            </div>

            {/* OBS Browser Source URL Box */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-amber-400 animate-pulse" /> OBS Studio Browser Source Link
                </span>
                <a
                  href={`/overlay/${activeToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                  Open Direct <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={obsUrl}
                  className="bg-transparent text-xs font-mono text-slate-300 w-full outline-none px-2"
                />
                <button
                  onClick={copyObsUrl}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow shrink-0 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedToken ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Paste this link into OBS Studio as a <span className="text-slate-300 font-bold">Browser Source</span> (Width: 900, Height: 200). Background is 100% transparent.
              </p>
            </div>
          </div>

          {/* Right: Touch Mobile Remote Controller */}
          <div className="lg:col-span-5">
            <MobileRemoteController
              match={activeMatch}
              onScore={(evt, teamId, val, player) => sendScoreEvent(evt, teamId, val, player)}
              onUndo={undoLastEvent}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 space-y-4">
          <p className="text-base font-bold">No active matches found.</p>
          <button
            onClick={onOpenCreateMatch}
            className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg"
          >
            Create Your First Match
          </button>
        </div>
      )}
    </div>
  );
};
