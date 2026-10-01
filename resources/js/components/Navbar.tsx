import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Activity, Coins, LogOut, Shield, User as UserIcon, PlusCircle, ShoppingBag } from 'lucide-react';

interface Props {
  onOpenWallet: () => void;
  onOpenMarketplace: () => void;
  onOpenCreateMatch: () => void;
  onOpenAuth: () => void;
  activeView: 'dashboard' | 'admin' | 'marketplace';
  setActiveView: (view: 'dashboard' | 'admin' | 'marketplace') => void;
}

export const Navbar: React.FC<Props> = ({
  onOpenWallet,
  onOpenMarketplace,
  onOpenCreateMatch,
  onOpenAuth,
  activeView,
  setActiveView,
}) => {
  const { user, logout } = useAuthStore();
  const isAdmin = user && ['super_admin', 'admin', 'superadmin'].includes(user.role);
  const coins = user?.wallet?.balance_coins ?? 100;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-red-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase leading-none">
              SPORTS OVERLAY <span className="text-blue-500">HUB</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
              Scoreboard & Broadcast SaaS
            </span>
          </div>
        </div>

        {/* View Switchers */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === 'dashboard'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Matches
          </button>
          <button
            onClick={() => {
              setActiveView('marketplace');
              onOpenMarketplace();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeView === 'marketplace'
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            Template Marketplace
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveView('admin')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Admin Panel
            </button>
          )}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Create Match CTA */}
        {user && (
          <button
            onClick={onOpenCreateMatch}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition"
          >
            <PlusCircle className="w-4 h-4" /> Create Match
          </button>
        )}

        {/* Coin Wallet Button */}
        {user && (
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-amber-500/40 hover:border-amber-400 rounded-xl text-amber-400 text-xs font-black shadow transition active:scale-95"
          >
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{coins} Coins</span>
          </button>
        )}

        {/* User Auth Profile */}
        {user ? (
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 shadow transition"
          >
            <UserIcon className="w-4 h-4" /> Login / Register
          </button>
        )}
      </div>
    </header>
  );
};
