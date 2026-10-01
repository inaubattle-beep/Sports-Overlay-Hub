import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GameMatch } from '../../types';
import { ScoreboardRenderer } from '../../scoreboards/ScoreboardRenderer';

interface Props {
  token: string;
}

export const OBSOverlayView: React.FC<Props> = ({ token }) => {
  const [match, setMatch] = useState<GameMatch | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      const res = await axios.get(`/api/v1/overlay/${token}/state`);
      setMatch(res.data.match);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load overlay state');
    }
  };

  useEffect(() => {
    fetchState();
    // Poll every 1.5 seconds for instant low-latency updates
    const interval = setInterval(fetchState, 1500);
    return () => clearInterval(interval);
  }, [token]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-transparent">
        <div className="bg-red-900/80 text-white p-4 rounded text-sm font-mono border border-red-500 shadow-lg">
          OBS Overlay Error: {error}
        </div>
      </div>
    );
  }

  if (!match) {
    return <div className="w-full h-full bg-transparent" />;
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
