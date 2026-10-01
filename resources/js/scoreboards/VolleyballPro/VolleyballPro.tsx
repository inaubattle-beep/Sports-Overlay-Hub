import React from 'react';
import { GameMatch } from '../../types';

interface Props {
  match: GameMatch;
  scale?: number;
}

export const VolleyballPro: React.FC<Props> = ({ match, scale = 1 }) => {
  const state = match.current_state || {};
  const homeSets = state.home_sets ?? 2;
  const awaySets = state.away_sets ?? 1;
  const homePoints = state.home_points ?? 21;
  const awayPoints = state.away_points ?? 18;

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
      <div className="flex items-center h-24 w-full max-w-[860px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 bg-slate-950/95">
        {/* Home Team */}
        <div className="flex-1 bg-gradient-to-r from-indigo-900 to-slate-900 px-6 h-full flex items-center justify-between border-r border-slate-800">
          <span className="text-2xl font-black text-white uppercase tracking-wider">{homeName}</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-indigo-400">Sets: {homeSets}</span>
            <span className="text-5xl font-black text-indigo-300 font-mono">{homePoints}</span>
          </div>
        </div>

        {/* VS Divider */}
        <div className="px-4 h-full bg-slate-900 flex items-center justify-center border-x border-indigo-500/30">
          <span className="text-xs font-black text-slate-400 tracking-widest">SET {state.current_set || 4}</span>
        </div>

        {/* Away Team */}
        <div className="flex-1 bg-gradient-to-l from-violet-900 to-slate-900 px-6 h-full flex items-center justify-between flex-row-reverse">
          <span className="text-2xl font-black text-white uppercase tracking-wider">{awayName}</span>
          <div className="flex items-center gap-4 flex-row-reverse">
            <span className="text-sm font-bold text-violet-400">Sets: {awaySets}</span>
            <span className="text-5xl font-black text-violet-300 font-mono">{awayPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
