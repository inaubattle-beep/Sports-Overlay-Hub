import React, { useEffect, useState } from 'react';
import { GameMatch } from '../../types';

interface Props {
  match: GameMatch;
  scale?: number;
}

export const GAAScoreboard: React.FC<Props> = ({ match, scale = 1 }) => {
  const state = match.current_state || {};
  const homeGoals = state.home_goals ?? 2;
  const homePoints = state.home_points ?? 10;
  const awayGoals = state.away_goals ?? 1;
  const awayPoints = state.away_points ?? 14;

  const homeTotal = homeGoals * 3 + homePoints;
  const awayTotal = awayGoals * 3 + awayPoints;

  const initialSeconds = state.current_elapsed_seconds ?? state.elapsed_seconds ?? 1845; // ~30m45s
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

  const homeName = match.homeTeam?.name || 'DUBLIN';
  const awayName = match.awayTeam?.name || 'KERRY';
  const period = state.period || '1st Half';

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
      {/* GAA Pro Gold & Emerald Glass Bar */}
      <div className="relative flex items-center h-28 w-full max-w-[880px] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 backdrop-blur-xl">
        
        {/* Home Team Panel */}
        <div className="flex-1 flex items-center justify-between px-6 h-full bg-emerald-900/60 border-r border-amber-400/30">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-wider text-amber-300 drop-shadow-md">{homeName}</span>
            <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">Gaelic Football</span>
          </div>

          {/* GAA Goal-Point Format (e.g., 2-10) */}
          <div className="flex items-baseline gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-amber-400/30 shadow-inner">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {homeGoals}-{homePoints < 10 ? `0${homePoints}` : homePoints}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">({homeTotal})</span>
          </div>
        </div>

        {/* Center Clock & Halves Panel */}
        <div className="w-40 h-full bg-slate-950 flex flex-col items-center justify-center border-x-2 border-amber-400/50 space-y-1 relative shadow-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{period}</span>
          <span className="text-3xl font-black font-mono text-amber-300 tracking-wider drop-shadow-lg">
            {formatTimer(seconds)}
          </span>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full"></div>
        </div>

        {/* Away Team Panel */}
        <div className="flex-1 flex items-center justify-between px-6 h-full bg-emerald-950/80 border-l border-amber-400/30">
          {/* GAA Goal-Point Format (e.g., 1-14) */}
          <div className="flex items-baseline gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-amber-400/30 shadow-inner">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {awayGoals}-{awayPoints < 10 ? `0${awayPoints}` : awayPoints}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">({awayTotal})</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-2xl font-black tracking-wider text-amber-300 drop-shadow-md">{awayName}</span>
            <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">Gaelic Football</span>
          </div>
        </div>
      </div>
    </div>
  );
};
