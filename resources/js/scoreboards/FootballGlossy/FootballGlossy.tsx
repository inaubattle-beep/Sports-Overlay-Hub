import React, { useEffect, useState } from 'react';
import { GameMatch } from '../../types';

interface Props {
  match: GameMatch;
  scale?: number;
}

export const FootballGlossy: React.FC<Props> = ({ match, scale = 1 }) => {
  const state = match.current_state || {};
  const homeScore = state.home_score ?? 0;
  const awayScore = state.away_score ?? 1;
  const homeScorers = state.home_scorers || ["Rahim 34'", "Karim 67'"];
  const awayScorers = state.away_scorers || ["John 88'"];

  // Live timer calculation
  const initialSeconds = state.current_elapsed_seconds ?? state.elapsed_seconds ?? 911;
  const isRunning = state.timer_running ?? false;
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const homeName = match.homeTeam?.name || 'Dhaka';
  const awayName = match.awayTeam?.name || 'Saver';
  const homeColor = match.homeTeam?.primary_color || '#2563eb';
  const awayColor = match.awayTeam?.primary_color || '#dc2626';

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{
        width: 900 * scale,
        height: 200 * scale,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Main Container Graphic Bar */}
      <div className="relative flex items-center h-24 w-full max-w-[860px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-950/90 backdrop-blur-md">
        
        {/* Home Team Glossy Panel */}
        <div
          className="flex-1 flex items-center justify-between px-8 h-full relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${homeColor} 0%, #1e3a8a 100%)`,
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Glass reflection highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/30 pointer-events-none" />
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white font-black text-xl shadow-lg">
              {homeName.charAt(0)}
            </div>
            <div>
              <span className="text-3xl font-black tracking-wider uppercase text-white drop-shadow-md block leading-none">
                {homeName}
              </span>
              {homeScorers.length > 0 && (
                <span className="text-[11px] font-semibold text-blue-200 block mt-1 tracking-normal opacity-90 truncate max-w-[200px]">
                  ⚽ {homeScorers.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Yellow Card Badges */}
          {(state.home_yellow_cards ?? 0) > 0 && (
            <div className="z-10 px-2 py-1 bg-amber-400 text-black font-bold text-xs rounded border border-amber-300 shadow">
              {state.home_yellow_cards} YC
            </div>
          )}
        </div>

        {/* Center Score Panel (Dark Metallic) */}
        <div className="w-48 h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center border-x-2 border-slate-700/80 z-20 shadow-inner relative">
          <div className="flex items-center gap-3 text-5xl font-black tracking-tighter text-white font-mono drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            <span className="text-blue-400">{homeScore}</span>
            <span className="text-slate-500 font-light text-3xl">-</span>
            <span className="text-red-400">{awayScore}</span>
          </div>
        </div>

        {/* Away Team Glossy Panel */}
        <div
          className="flex-1 flex items-center justify-between px-8 h-full relative overflow-hidden flex-row-reverse"
          style={{
            background: `linear-gradient(135deg, ${awayColor} 0%, #7f1d1d 100%)`,
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Glass reflection highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/30 pointer-events-none" />

          <div className="flex items-center gap-4 z-10 flex-row-reverse text-right">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white font-black text-xl shadow-lg">
              {awayName.charAt(0)}
            </div>
            <div>
              <span className="text-3xl font-black tracking-wider uppercase text-white drop-shadow-md block leading-none">
                {awayName}
              </span>
              {awayScorers.length > 0 && (
                <span className="text-[11px] font-semibold text-red-200 block mt-1 tracking-normal opacity-90 truncate max-w-[200px]">
                  ⚽ {awayScorers.join(', ')}
                </span>
              )}
            </div>
          </div>

          {(state.away_yellow_cards ?? 0) > 0 && (
            <div className="z-10 px-2 py-1 bg-amber-400 text-black font-bold text-xs rounded border border-amber-300 shadow">
              {state.away_yellow_cards} YC
            </div>
          )}
        </div>

        {/* Floating Timer Display */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900/95 text-emerald-400 font-mono text-sm px-6 py-1 rounded-t-lg border-t border-x border-emerald-500/40 shadow-xl flex items-center gap-2 z-30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-widest">{formatTimer(seconds)}</span>
          <span className="text-slate-400 text-xs font-sans uppercase">({state.period || '1st Half'})</span>
        </div>
      </div>
    </div>
  );
};
