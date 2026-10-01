import React, { useEffect, useState } from 'react';
import { GameMatch } from '../../types';

interface Props {
  match: GameMatch;
  scale?: number;
}

export const FootballMinimal: React.FC<Props> = ({ match, scale = 1 }) => {
  const state = match.current_state || {};
  const homeScore = state.home_score ?? 0;
  const awayScore = state.away_score ?? 1;

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

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: 900 * scale,
        height: 200 * scale,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <div className="flex items-center h-20 w-full max-w-[820px] rounded-full overflow-hidden shadow-2xl border border-cyan-500/40 bg-slate-950/95 p-2 gap-2">
        {/* Home Minimal Badge */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-6 h-full flex items-center justify-between">
          <span className="text-xl font-black text-cyan-400 tracking-widest uppercase">{homeName}</span>
          <span className="text-4xl font-black text-white font-mono">{homeScore}</span>
        </div>

        {/* Center Neon Timer Badge */}
        <div className="px-6 h-full bg-cyan-950 border border-cyan-500/50 rounded-full flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xl font-black text-cyan-300 font-mono">{formatTimer(seconds)}</span>
        </div>

        {/* Away Minimal Badge */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-6 h-full flex items-center justify-between flex-row-reverse">
          <span className="text-xl font-black text-rose-400 tracking-widest uppercase">{awayName}</span>
          <span className="text-4xl font-black text-white font-mono">{awayScore}</span>
        </div>
      </div>
    </div>
  );
};
