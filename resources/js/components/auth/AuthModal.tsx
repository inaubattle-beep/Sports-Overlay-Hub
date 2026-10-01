import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, isLoading, error } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl text-white">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h3 className="text-lg font-black">{isLogin ? 'Sign In' : 'Create Account'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-300 rounded-xl text-xs">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block font-bold text-slate-300 mb-1">Full Name</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
                <UserIcon className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-transparent text-white outline-none w-full"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
              <Mail className="w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@sportsoverlay.com"
                className="bg-transparent text-white outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent text-white outline-none w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
          </button>

          {/* Quick Login Presets / Default Credentials Notice */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/80 pb-1">
              <span>🔑 Default Demo Credentials</span>
              <span className="text-[10px] text-blue-400 font-mono">Click to Auto-fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@sportsoverlay.com');
                  setPassword('password');
                }}
                className="bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/50 p-2 rounded-xl text-left transition"
              >
                <div className="font-bold text-purple-300 text-[10px] uppercase">Super Admin</div>
                <div className="text-slate-300 truncate font-mono text-[10px]">admin@sportsoverlay.com</div>
                <div className="text-slate-500 font-mono text-[9px]">Pass: password</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('user@sportsoverlay.com');
                  setPassword('password');
                }}
                className="bg-blue-950/40 border border-blue-500/30 hover:bg-blue-900/50 p-2 rounded-xl text-left transition"
              >
                <div className="font-bold text-blue-300 text-[10px] uppercase">Broadcaster User</div>
                <div className="text-slate-300 truncate font-mono text-[10px]">user@sportsoverlay.com</div>
                <div className="text-slate-500 font-mono text-[9px]">Pass: password</div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-blue-400 hover:underline font-bold"
            >
              {isLogin ? "Don't have an account? Register" : 'Already registered? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
