import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserWalletBalance: (newBalance: number) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user, token, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Login failed. Please check credentials.',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/api/v1/auth/register', { name, email, password });
      const { user, token } = res.data;
      localStorage.setItem('auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user, token, isLoading: false });
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Registration failed.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/v1/auth/logout');
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const res = await axios.get('/api/v1/auth/me');
      set({ user: res.data.user });
    } catch (e) {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null });
    }
  },

  updateUserWalletBalance: (newBalance: number) => {
    const currentUser = get().user;
    if (currentUser && currentUser.wallet) {
      set({
        user: {
          ...currentUser,
          wallet: {
            ...currentUser.wallet,
            balance_coins: newBalance,
          },
        },
      });
    }
  },
}));
