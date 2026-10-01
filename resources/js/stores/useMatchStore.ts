import { create } from 'zustand';
import axios from 'axios';
import { GameMatch } from '../types';

interface MatchState {
  matches: GameMatch[];
  activeMatch: GameMatch | null;
  isLoading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  selectMatch: (match: GameMatch) => void;
  createMatch: (data: {
    name: string;
    sport_id: number;
    home_team_name: string;
    home_team_short?: string;
    home_primary_color?: string;
    away_team_name: string;
    away_team_short?: string;
    away_primary_color?: string;
  }) => Promise<boolean>;
  sendScoreEvent: (eventType: string, teamId?: number, value?: number, playerName?: string) => Promise<void>;
  undoLastEvent: () => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  activeMatch: null,
  isLoading: false,
  error: null,

  fetchMatches: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/v1/matches');
      const matches = res.data.data;
      set({
        matches,
        activeMatch: get().activeMatch || matches[0] || null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  selectMatch: (match: GameMatch) => {
    set({ activeMatch: match });
  },

  createMatch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/api/v1/matches', data);
      const newMatch = res.data.data;
      const currentMatches = get().matches;
      set({
        matches: [newMatch, ...currentMatches],
        activeMatch: newMatch,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to create match.',
        isLoading: false,
      });
      return false;
    }
  },

  sendScoreEvent: async (eventType: string, teamId?: number, value: number = 1, playerName?: string) => {
    const activeMatch = get().activeMatch;
    if (!activeMatch) return;

    try {
      const res = await axios.post(`/api/v1/matches/${activeMatch.id}/score`, {
        event_type: eventType,
        team_id: teamId,
        value,
        player_name: playerName,
      });
      const updatedMatch = res.data.data;
      set({
        activeMatch: updatedMatch,
        matches: get().matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)),
      });
    } catch (err: any) {
      console.error('Score event error:', err);
    }
  },

  undoLastEvent: async () => {
    const activeMatch = get().activeMatch;
    if (!activeMatch) return;

    try {
      const res = await axios.post(`/api/v1/matches/${activeMatch.id}/undo`);
      const updatedMatch = res.data.data;
      set({
        activeMatch: updatedMatch,
        matches: get().matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)),
      });
    } catch (err: any) {
      console.error('Undo error:', err);
    }
  },
}));
