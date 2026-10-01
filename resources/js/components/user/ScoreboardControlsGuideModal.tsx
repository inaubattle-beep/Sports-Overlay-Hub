import React, { useState } from 'react';
import { X, HelpCircle, Smartphone, Tv, Award, Zap, Shield, Play, Pause, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreboardControlsGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'football' | 'gaa' | 'basketball' | 'volleyball' | 'cricket' | 'baseball' | 'wrestling' | 'obs'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/40 rounded-2xl text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                How to Operate Scoreboard Controls
              </h2>
              <p className="text-xs text-slate-400">Master game controllers & sport-specific rules for live broadcasts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sport Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-3 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            ⚡ Quick Start Guide
          </button>
          <button
            onClick={() => setActiveTab('football')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'football' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            ⚽ Soccer & Football
          </button>
          <button
            onClick={() => setActiveTab('gaa')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'gaa' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            ☘️ GAA (2-10 Format)
          </button>
          <button
            onClick={() => setActiveTab('basketball')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'basketball' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            🏀 Basketball & Shot Clock
          </button>
          <button
            onClick={() => setActiveTab('volleyball')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'volleyball' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            🏐 Volleyball & Sets
          </button>
          <button
            onClick={() => setActiveTab('cricket')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'cricket' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            🏏 Cricket Pro
          </button>
          <button
            onClick={() => setActiveTab('baseball')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'baseball' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            ⚾ Baseball (R/H/E)
          </button>
          <button
            onClick={() => setActiveTab('wrestling')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'wrestling' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            🤼 Wrestling
          </button>
          <button
            onClick={() => setActiveTab('obs')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'obs' ? 'bg-indigo-700 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            📡 OBS & Streamlabs
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs md:text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 p-5 rounded-2xl">
                <h3 className="text-base font-black text-white flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Scoreboard Control Workflow
                </h3>
                <p className="text-slate-300">
                  Control your broadcast overlay live from any smartphone, tablet, or PC without software installation. Updates sync instantaneously via Reverb WebSockets to OBS, Streamlabs, and venue screens.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    💰 Budget-friendly Pricing
                  </h4>
                  <p className="text-slate-400 text-xs">
                    High-quality scoring solutions that won't break the bank. Our flexible plans accommodate teams of any size.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                    ⏱️ Setup in Under 60 Seconds
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Just copy the browser source URL into OBS. No plugins to install, no software to download, no complicated configuration files.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-blue-400 text-sm flex items-center gap-1.5">
                    📡 Works with Any Streaming Setup
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Compatible with OBS Studio, Streamlabs, vMix, Wirecast, XSplit, and any software supporting browser sources. One URL works everywhere.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-purple-400 text-sm flex items-center gap-1.5">
                    📺 Broadcast-Quality Graphics
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Professional overlays with transparency, smooth animations, and HD resolution. Make your stream look like ESPN on any budget.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-sm">1</div>
                  <h4 className="font-bold text-white text-sm">Select Your Match</h4>
                  <p className="text-slate-400 text-xs">Choose active stream from your dashboard dropdown or create a new game session.</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-sm">2</div>
                  <h4 className="font-bold text-white text-sm">Pair Phone Controller</h4>
                  <p className="text-slate-400 text-xs">Scan the QR code or open mobile URL. Unlock tactile remote with your 4-digit security PIN.</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-black text-sm">3</div>
                  <h4 className="font-bold text-white text-sm">Embed OBS Browser Source</h4>
                  <p className="text-slate-400 text-xs">Copy your unique transparent overlay URL (`/overlay/{'{token}'}`) into OBS Studio or vMix.</p>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" /> Immutable Event Sourcing & Error Recovery
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400 text-xs">
                  <li>Every goal, point, or penalty is permanently recorded in the match event ledger.</li>
                  <li>Made a mistake? Tap <strong>Undo Last Event</strong> to safely append a compensating reversal without destroying score history.</li>
                  <li>Server-authoritative timers ensure timer synchronization across all viewers and mobile devices.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'football' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                ⚽ Operating Soccer & Association Football Controls
              </h3>
              <p className="text-slate-400">Instructions for controlling scoreboards, match halves, and stoppage timers.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-blue-400 text-sm">Scoring Controls</h4>
                  <ul className="space-y-1.5 text-slate-300 text-xs">
                    <li>• <strong>+1 Goal Home / Away:</strong> Increments score and triggers animated goal flare on broadcast overlay.</li>
                    <li>• <strong>Player Attribution:</strong> Optional player selection tags the goalscorer's name on the lower-third pop-up.</li>
                    <li>• <strong>Undo Reversal:</strong> Reverts latest goal count safely.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-blue-400 text-sm">Timer & Period Management</h4>
                  <ul className="space-y-1.5 text-slate-300 text-xs">
                    <li>• <strong>Start / Pause Clock:</strong> Controls the server-authoritative match timer.</li>
                    <li>• <strong>Period Toggle:</strong> Cycle through 1st Half, Half Time, 2nd Half, Extra Time, and Penalties.</li>
                    <li>• <strong>Added Time:</strong> Input stoppage minutes (+2', +4') for live overlay display.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gaa' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                ☘️ Operating Gaelic Football & Hurling (GAA) Controls
              </h3>
              <p className="text-slate-400">GAA scoring uses dual counters: Goals (3 points) and Points (1 point), displayed in standard 2-10 format.</p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
                <h4 className="font-bold text-emerald-400 text-sm">2-10 Format Explanation</h4>
                <p className="text-xs text-slate-300">
                  A score display of <strong>2-10 (16)</strong> represents 2 Goals (2 x 3 = 6) plus 10 Points (10 x 1 = 10), giving a calculated total of 16 total points.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Goal Button (+3 pts / +1 Goal)</span>
                    <span className="text-slate-400 text-xs">Tap when ball enters the net past the goalkeeper.</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-white block">Point Button (+1 pt / +1 Point)</span>
                    <span className="text-slate-400 text-xs">Tap when ball travels over the crossbar between uprights.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'basketball' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                🏀 Operating Basketball Controls & Shot Clock
              </h3>
              <p className="text-slate-400">Controls for fast-paced basketball scoring, 24s shot clock resets, and team fouls.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-sm">Point Variations</h4>
                  <ul className="space-y-1.5 text-slate-300 text-xs">
                    <li>• <strong>+1 FT:</strong> Free throw made.</li>
                    <li>• <strong>+2 PTS:</strong> Field goal inside 3pt line.</li>
                    <li>• <strong>+3 PTS:</strong> Beyond the arc 3-pointer.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 text-sm">Shot Clock & Fouls</h4>
                  <ul className="space-y-1.5 text-slate-300 text-xs">
                    <li>• <strong>24s Reset:</strong> Reset shot clock on possession change.</li>
                    <li>• <strong>14s Reset:</strong> Reset after offensive rebound / foul.</li>
                    <li>• <strong>Fouls & Bonus:</strong> Automatically triggers bonus free throw indicator when team fouls reach 5.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volleyball' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                🏐 Operating Volleyball Set Controls
              </h3>
              <p className="text-slate-400">Track rallies, set scores (Best of 5), serve indicators, and timeouts.</p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-3">
                <h4 className="font-bold text-purple-400 text-sm">Rally & Set Rules</h4>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li>• <strong>+1 Point:</strong> Award rally point. First to 25 pts (win by 2) wins the set.</li>
                  <li>• <strong>Set Won Toggle:</strong> Increment team set counter upon set completion.</li>
                  <li>• <strong>Serve Indicator:</strong> Tap ball icon to toggle active serving team dot on overlay.</li>
                  <li>• <strong>Timeouts:</strong> Track up to 2 team timeouts per set.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'cricket' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                🏏 Operating Cricket Pro Scoreboard
              </h3>
              <p className="text-slate-400">Track runs, wickets, overs, current run rate (CRR), and target scores.</p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-600/30 space-y-3">
                <h4 className="font-bold text-emerald-400 text-sm">Cricket Input Controls</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">+1 / +2 / +4 / +6 Runs</div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">+1 Wicket</div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">Ball / Over Counter</div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">Target & Extras</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'baseball' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                ⚾ Operating Baseball & Softball Controls
              </h3>
              <p className="text-slate-400">Track Runs, Hits, Errors (R/H/E) and Balls-Strikes-Outs (B-S-O) count.</p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-red-500/30 space-y-3">
                <h4 className="font-bold text-red-400 text-sm">Inning & Count Controls</h4>
                <ul className="space-y-1.5 text-slate-300 text-xs">
                  <li>• <strong>Inning Toggle:</strong> Cycle through Top (▲) and Bottom (▼) of innings 1-9.</li>
                  <li>• <strong>B-S-O Count:</strong> Quick buttons for Balls (0-4), Strikes (0-3), and Outs (0-3).</li>
                  <li>• <strong>R / H / E Matrix:</strong> Real-time box score update.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'wrestling' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                🤼 Operating Wrestling Controls
              </h3>
              <p className="text-slate-400">Track match periods, takedowns, escapes, reversals, and riding time.</p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
                <h4 className="font-bold text-indigo-400 text-sm">Point Values & Period Clock</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">Takedown (+2)</div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">Escape (+1)</div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">Reversal (+2)</div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">Near Fall (+2, +3, +4)</div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">Penalty (+1)</div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">Periods (P1, P2, P3)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'obs' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                📡 Connecting to OBS Studio & Broadcast Software
              </h3>
              <p className="text-slate-400">Step-by-step instructions for adding transparent overlay graphics into your stream.</p>

              <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs">
                  <li>In your Sports Overlay Hub dashboard, click <strong>Copy OBS Link</strong>.</li>
                  <li>Open OBS Studio, Streamlabs, or vMix.</li>
                  <li>In the <strong>Sources</strong> panel, add a new <strong>Browser Source</strong>.</li>
                  <li>Paste the copied URL into the URL field.</li>
                  <li>Set Width to <strong>900</strong> and Height to <strong>200</strong> (or 1920x1080 for full-screen templates).</li>
                  <li>Check <strong>"Shutdown source when not visible"</strong> for optimum GPU performance.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Sports Overlay Hub • Operator Guide v2.5</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
