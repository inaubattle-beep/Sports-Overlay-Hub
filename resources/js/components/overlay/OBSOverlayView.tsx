import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GameMatch } from '../../types';
import { ScoreboardRenderer } from '../../scoreboards/ScoreboardRenderer';
import { soundFX } from '../../services/soundFX';

interface Props {
  token: string;
}

export const OBSOverlayView: React.FC<Props> = ({ token }) => {
  const [match, setMatch] = useState<GameMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSoundTimestamp = useRef<number>(0);
  const prevHomeScore = useRef<number | null>(null);
  const prevAwayScore = useRef<number | null>(null);

  const cleanToken = token ? token.split('?')[0].replace(/\/$/, '') : '';

  const fetchState = async () => {
    try {
      const res = await axios.get(`/api/v1/overlay/${cleanToken}/state`);
      if (res.data?.match) {
        const newMatch: GameMatch = res.data.match;
        const state = newMatch.current_state || (newMatch as any).state || {};

        // Sound Trigger Detection
        const soundFxMeta = state.last_sound_effect;
        if (soundFxMeta?.timestamp && soundFxMeta.timestamp > lastSoundTimestamp.current) {
          lastSoundTimestamp.current = soundFxMeta.timestamp;
          soundFX.playEffect(soundFxMeta.sound);
        }

        // Auto Goal / Point Score Sound Detection
        const currentHome = state.home_score ?? 0;
        const currentAway = state.away_score ?? 0;
        if (prevHomeScore.current !== null && (currentHome > prevHomeScore.current || currentAway > (prevAwayScore.current ?? 0))) {
          if (state.sport === 'gaa') {
            soundFX.playChime();
          } else {
            soundFX.playGoalSiren();
          }
        }
        prevHomeScore.current = currentHome;
        prevAwayScore.current = currentAway;

        setMatch(newMatch);
        setError(null);
      } else {
        setError('No match state returned');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        return;
      }
      setError(err.response?.data?.message || 'Failed to load overlay state');
    }
  };

  useEffect(() => {
    // 100% Transparency isolation for OBS Studio browser source
    document.body.style.backgroundColor = 'transparent';
    document.body.style.background = 'transparent';
    document.documentElement.style.backgroundColor = 'transparent';
    document.documentElement.style.background = 'transparent';

    fetchState();
    const interval = setInterval(fetchState, 1500);
    return () => clearInterval(interval);
  }, [cleanToken]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4" style={{ background: 'transparent' }}>
        <div className="bg-red-950/90 text-white p-4 rounded-xl text-xs font-mono border border-red-500 shadow-2xl">
          ⚠️ OBS Overlay Stream Error: {error}
        </div>
      </div>
    );
  }

  if (!match) {
    return <div className="w-full h-full" style={{ background: 'transparent' }} />;
  }

  return (
    <div
      className="w-[900px] h-[200px] flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <ScoreboardRenderer match={match} templateSlug={match.template?.slug} />
    </div>
  );
};
