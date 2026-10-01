import React from 'react';
import { GameMatch } from '../types';
import { FootballGlossy } from './FootballGlossy/FootballGlossy';
import { FootballMinimal } from './FootballMinimal/FootballMinimal';
import { CricketPro } from './CricketPro/CricketPro';
import { VolleyballPro } from './VolleyballPro/VolleyballPro';
import { GAAScoreboard } from './GAAScoreboard/GAAScoreboard';

interface Props {
  match: GameMatch;
  templateSlug?: string;
  scale?: number;
}

export const ScoreboardRenderer: React.FC<Props> = ({ match, templateSlug, scale = 1 }) => {
  const slug = templateSlug || match.template?.slug || match.sport?.code || 'football-glossy';

  if (slug.includes('gaa')) {
    return <GAAScoreboard match={match} scale={scale} />;
  }

  if (slug.includes('minimal') || slug.includes('neon')) {
    return <FootballMinimal match={match} scale={scale} />;
  }

  if (slug.includes('cricket')) {
    return <CricketPro match={match} scale={scale} />;
  }

  if (slug.includes('volleyball') || slug.includes('badminton')) {
    return <VolleyballPro match={match} scale={scale} />;
  }

  // Default Football Glossy 3D
  return <FootballGlossy match={match} scale={scale} />;
};
