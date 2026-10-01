import React, { useState } from 'react';
import { GameMatch } from '../../types';
import { Play, Pause, RotateCcw, Undo2, Zap, AlertTriangle, User, Lock, Unlock, QrCode, HelpCircle } from 'lucide-react';

interface Props {
  match: GameMatch;
  onScore: (eventType: string, teamId?: number, value?: number, playerName?: string) => void;
  onUndo: () => void;
  onOpenGuide?: () => void;
}

export const MobileRemoteController: React.FC<Props> = ({ match, onScore, onUndo, onOpenGuide }) => {
  const [playerName, setPlayerName] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [savedPin, setSavedPin] = useState('1234');
  const [showQr, setShowQr] = useState(false);

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  };

  const handleAction = (eventType: string, teamId?: number, value: number = 1) => {
    if (isLocked) {
      alert('Controller is locked with PIN. Please enter PIN to unlock.');
      return;
    }
    triggerHaptic();
    onScore(eventType, teamId, value, playerName);
    setPlayerName(''); // Reset input after scoring
  };

  const handleUndo = () => {
    if (isLocked) {
      alert('Controller is locked with PIN.');
      return;
    }
    triggerHaptic();
    onUndo();
  };

  const togglePinLock = () => {
    if (isLocked) {
      if (pinInput === savedPin) {
        setIsLocked(false);
        setPinInput('');
      } else {
        alert('Invalid 4-digit PIN! Default PIN is 1234.');
      }
    } else {
      setIsLocked(true);
    }
  };

  const sport = match.sport?.code || 'football';
  const homeName = match.homeTeam?.name || 'Home';
  const awayName = match.awayTeam?.name || 'Away';
  const homeId = match.homeTeam?.id;
  const awayId = match.awayTeam?.id;
  const activeMatchToken = match.broadcastOutputs?.[0]?.token || match.slug || `token-${match.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + '/overlay/' + activeMatchToken)}`;

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-white select-none relative">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400 font-bold uppercase tracking-widest block">{sport} Controller</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-amber-400">Code: #{matchCode}</span>
          </div>
          <h2 className="text-xl font-black">{match.name}</h2>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 shadow"
              title="How to Operate Scoreboard Controls"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
            </button>
          )}
          <button
            onClick={() => setShowQr(!showQr)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 shadow"
            title="QR Code Pairing"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={togglePinLock}
            className={`p-2 rounded-xl transition border shadow ${
              isLocked ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title={isLocked ? 'Unlock Controller' : 'Lock with PIN'}
          >
            {isLocked ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={handleUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-slate-300 rounded-xl text-xs font-bold transition border border-slate-700 shadow"
          >
            <Undo2 className="w-4 h-4 text-amber-400" />
            <span>Undo</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal Overlay */}
      {showQr && (
        <div className="mb-4 bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-2 animate-fadeIn">
          <div className="text-xs font-bold text-cyan-400">Scan QR Code to Pair Display / Remote</div>
          <div className="flex justify-center p-2 bg-white rounded-xl w-fit mx-auto shadow-lg">
            <img src={qrCodeUrl} alt="Display Pairing QR Code" className="w-36 h-36" />
          </div>
          <p className="text-[10px] text-slate-400">Scan from mobile camera to instantly open remote controller or TV spectator display.</p>
        </div>
      )}

      {/* PIN Lock Banner if Locked */}
      {isLocked && (
        <div className="mb-4 bg-red-950/60 border border-red-500/40 p-3 rounded-2xl flex items-center justify-between text-xs space-x-2">
          <div className="flex items-center gap-2 text-red-300 font-bold">
            <Lock className="w-4 h-4 text-red-400" /> Controller PIN Locked
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN"
              className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-xs font-mono outline-none text-white"
            />
            <button
              onClick={togglePinLock}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] rounded"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {/* Player Name Input Field */}
      <div className="mb-4 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center gap-2">
        <User className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Player / Scorer Name (Optional)"
          className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full font-medium"
        />
      </div>

      {/* GAA Gaelic Football / Hurling Controller */}
      {(sport === 'gaa' || match.template?.slug?.includes('gaa')) && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Home Goals + Points */}
            <div className="space-y-2 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30">
              <div className="text-xs font-black text-amber-300 text-center uppercase">{homeName}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAction('gaa_home_goal', homeId, 1)}
                  className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow active:scale-95 flex flex-col items-center"
                >
                  <span className="text-[10px] text-emerald-200">⚽ GOAL</span>
                  <span>+1 (3pts)</span>
                </button>
                <button
                  onClick={() => handleAction('gaa_home_point', homeId, 1)}
                  className="py-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl shadow active:scale-95 flex flex-col items-center"
                >
                  <span className="text-[10px] text-amber-200">☝ POINT</span>
                  <span>+1 (1pt)</span>
                </button>
              </div>
            </div>

            {/* Away Goals + Points */}
            <div className="space-y-2 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30">
              <div className="text-xs font-black text-amber-300 text-center uppercase">{awayName}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAction('gaa_away_goal', awayId, 1)}
                  className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow active:scale-95 flex flex-col items-center"
                >
                  <span className="text-[10px] text-emerald-200">⚽ GOAL</span>
                  <span>+1 (3pts)</span>
                </button>
                <button
                  onClick={() => handleAction('gaa_away_point', awayId, 1)}
                  className="py-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl shadow active:scale-95 flex flex-col items-center"
                >
                  <span className="text-[10px] text-amber-200">☝ POINT</span>
                  <span>+1 (1pt)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Scoring Buttons */}
      {sport === 'football' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Home Goal +1 */}
            <button
              onClick={() => handleAction('goal_home', homeId, 1)}
              className="py-8 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-xl border border-blue-400/40 flex flex-col items-center justify-center gap-1 transition"
            >
              <span className="text-sm font-semibold opacity-90">{homeName}</span>
              <span className="text-3xl font-mono">+1 GOAL</span>
            </button>

            {/* Away Goal +1 */}
            <button
              onClick={() => handleAction('goal_away', awayId, 1)}
              className="py-8 bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 active:scale-95 text-white font-black text-2xl rounded-2xl shadow-xl border border-red-400/40 flex flex-col items-center justify-center gap-1 transition"
            >
              <span className="text-sm font-semibold opacity-90">{awayName}</span>
              <span className="text-3xl font-mono">+1 GOAL</span>
            </button>
          </div>

          {/* Cards & Events */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleAction('yellow_card', homeId)}
              className="py-3 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" /> {homeName} YC
            </button>
            <button
              onClick={() => handleAction('yellow_card', awayId)}
              className="py-3 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" /> {awayName} YC
            </button>
          </div>
        </div>
      )}

      {sport === 'cricket' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 6].map((run) => (
              <button
                key={run}
                onClick={() => handleAction('add_run', undefined, run)}
                className="py-5 bg-gradient-to-b from-amber-600 to-amber-800 active:scale-95 text-white font-black text-2xl rounded-xl shadow border border-amber-400/30"
              >
                +{run}
              </button>
            ))}
            <button
              onClick={() => handleAction('add_wicket')}
              className="py-5 bg-gradient-to-b from-red-600 to-red-800 active:scale-95 text-white font-black text-xl rounded-xl shadow border border-red-400/30"
            >
              WICKET
            </button>
          </div>

          <button
            onClick={() => handleAction('add_over')}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Add +0.1 Over
          </button>
        </div>
      )}

      {sport === 'volleyball' && (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAction('point_home', homeId)}
            className="py-8 bg-gradient-to-b from-indigo-600 to-indigo-800 active:scale-95 text-white font-black text-2xl rounded-2xl shadow border border-indigo-400/40"
          >
            {homeName} +1 Pt
          </button>
          <button
            onClick={() => handleAction('point_away', awayId)}
            className="py-8 bg-gradient-to-b from-violet-600 to-violet-800 active:scale-95 text-white font-black text-2xl rounded-2xl shadow border border-violet-400/40"
          >
            {awayName} +1 Pt
          </button>
        </div>
      )}

      {/* Timer Controls */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          onClick={() => handleAction('timer_start')}
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
        >
          <Play className="w-4 h-4" /> START
        </button>
        <button
          onClick={() => handleAction('timer_pause')}
          className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
        >
          <Pause className="w-4 h-4" /> PAUSE
        </button>
        <button
          onClick={() => handleAction('timer_reset')}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center shadow"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
