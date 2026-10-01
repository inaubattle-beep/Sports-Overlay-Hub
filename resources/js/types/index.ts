export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'user';
  avatar?: string;
  status: 'active' | 'suspended';
  wallet?: Wallet;
}

export interface Wallet {
  id: number;
  user_id: number;
  balance_coins: number;
}

export interface WalletTransaction {
  id: number;
  type: 'credit' | 'debit' | 'refund' | 'bonus' | 'purchase';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface Sport {
  id: number;
  name: string;
  code: string;
  icon: string;
}

export interface Player {
  id: number;
  team_id: number;
  name: string;
  jersey_number?: number;
  position?: string;
  is_starter: boolean;
}

export interface Team {
  id: number;
  name: string;
  short_name: string;
  logo_path?: string;
  primary_color: string;
  secondary_color?: string;
  text_color?: string;
  players?: Player[];
}

export interface ScoreboardTemplate {
  id: number;
  sport_id: number;
  name: string;
  slug: string;
  category: string;
  aspect_ratio: string;
  default_width: number;
  default_height: number;
  is_premium: boolean;
  price_coins: number;
  is_unlocked?: boolean;
}

export interface BroadcastOutput {
  id: number;
  match_id: number;
  token: string;
  is_active: boolean;
}

export interface MatchState {
  sport: string;
  home_score: number;
  away_score: number;
  elapsed_seconds: number;
  current_elapsed_seconds?: number;
  timer_running: boolean;
  period?: string;
  home_scorers?: string[];
  away_scorers?: string[];
  home_yellow_cards?: number;
  away_yellow_cards?: number;
  home_red_cards?: number;
  away_red_cards?: number;
  // Cricket
  runs?: number;
  wickets?: number;
  overs?: number;
  current_batsman?: string;
  // Volleyball
  home_sets?: number;
  away_sets?: number;
  home_points?: number;
  away_points?: number;
  current_set?: number;
  active_server?: string;
}

export interface GameMatch {
  id: number;
  name: string;
  slug: string;
  status: 'scheduled' | 'live' | 'paused' | 'finished' | 'cancelled';
  sport: Sport;
  homeTeam: Team;
  awayTeam: Team;
  template?: ScoreboardTemplate;
  broadcastOutputs?: BroadcastOutput[];
  current_state: MatchState;
}

export interface CoinPackage {
  id: number;
  name: string;
  coins: number;
  bonus_coins: number;
  price_usd: number;
  is_popular: boolean;
}
