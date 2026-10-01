import React from 'react';
import { GameMatch } from '../../types';

interface Props {
  match: GameMatch;
  scale?: number;
}

export const CricketPro: React.FC<Props> = ({ match, scale = 1 }) => {
  const state = match.current_state || {};
  const runs = state.runs ?? 142;
  const wickets = state.wickets ?? 4;
  const overs = state.overs ?? 16.4;

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
      <div className="flex items-center h-24 w-full max-w-[860px] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 bg-slate-950/95">
        {/* Teams badge */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 h-full flex flex-col justify-center border-r border-amber-400/40">
          <span className="text-xl font-black text-white uppercase tracking-wider">{homeName} vs {awayName}</span>
          <span className="text-xs text-amber-100 font-bold">T20 CHAMPIONSHIP</span>
        </div>

        {/* Main Cricket Score */}
        <div className="flex-1 px-8 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black text-amber-400 font-mono tracking-tight drop-shadow-md">{runs}</span>
            <span className="text-3xl font-bold text-slate-400">/</span>
            <span className="text-4xl font-bold text-red-400 font-mono">{wickets}</span>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-xs text-slate-400 font-semibold tracking-widest uppercase">Overs</div>
            <div className="text-4xl font-black text-white font-mono">{overs} <span className="text-sm font-sans text-slate-400">ov</span></div>
          </div>
        </div>

        {/* Status tag */}
        <div className="bg-slate-900 border-l border-slate-800 px-6 h-full flex items-center justify-center">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded text-xs font-bold uppercase">
            1st Innings
          </span>
        </div>
      </div>
    </div>
  );
};
