import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GameMatch } from '../../types';
import { MobileRemoteController } from './MobileRemoteController';
import { ScoreboardControlsGuideModal } from '../user/ScoreboardControlsGuideModal';
import { Smartphone, Radio, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';

interface Props {
  token: string;
}

export const StandaloneRemoteView: React.FC<Props> = ({ token }) => {
  const [match, setMatch] = useState<GameMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const cleanToken = token ? token.split('?')[0].replace(/\/$/, '') : 'abc123demo';

  const fetchState = async () => {
    try {
      const res = await axios.get(`/api/v1/overlay/${cleanToken}/state`);
      if (res.data?.match) {
        setMatch(res.data.match);
        setError(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Remote session expired or invalid token');
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1500);
    return () => clearInterval(interval);
  }, [cleanToken]);

  const handleRemoteScore = async (eventType: string, teamId?: number, value: number = 1, playerName?: string) => {
    try {
      const res = await axios.post(`/api/v1/remote/${cleanToken}/score`, {
        event_type: eventType,
        team_id: teamId,
        value: value,
        player_name: playerName,
      });
      if (res.data?.data) {
        setMatch(res.data.data);
      }
      setStatusNotice('Score updated live!');
      setTimeout(() => setStatusNotice(null), 1500);
    } catch (err: any) {
      alert('Failed to send score update: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoteUndo = async () => {
    try {
      const res = await axios.post(`/api/v1/remote/${cleanToken}/undo`);
      if (res.data?.data) {
        setMatch(res.data.data);
      }
      setStatusNotice('Action undone!');
      setTimeout(() => setStatusNotice(null), 1500);
    } catch (err: any) {
      alert('Failed to undo action: ' + (err.response?.data?.message || err.message));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-slate-900 border border-red-500/50 p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-black">Remote Control Session Error</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={fetchState}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-6 text-slate-400 text-xs font-mono">
        Connecting to live broadcast stream #{cleanToken}...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center p-4 selection:bg-blue-600">
      <ScoreboardControlsGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Top Banner */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black text-white flex items-center gap-1.5">
              Browser Remote Controller <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">Live Pair Token: #{cleanToken}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl transition border border-slate-700 shadow"
            title="How to Operate Controls"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <a
            href={`/overlay/${cleanToken}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition border border-slate-700 shadow flex items-center gap-1 text-[11px] font-bold"
            title="View OBS Overlay"
          >
            <Radio className="w-3.5 h-3.5" /> Overlay <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {statusNotice && (
        <div className="w-full max-w-md bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl mb-3 text-center shadow-lg animate-bounce flex items-center justify-center gap-1.5">
          <CheckCircle className="w-4 h-4" /> {statusNotice}
        </div>
      )}

      {/* Main Remote Control Component */}
      <div className="w-full">
        <MobileRemoteController
          match={match}
          onScore={handleRemoteScore}
          onUndo={handleRemoteUndo}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      </div>

      <footer className="mt-6 text-[10px] text-slate-500 text-center font-mono">
        Sports Overlay Hub • Web Browser Remote Controller • Sync via Reverb WebSockets
      </footer>
    </div>
  );
};
