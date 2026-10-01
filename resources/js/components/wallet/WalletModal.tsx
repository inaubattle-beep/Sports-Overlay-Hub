import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CoinPackage, WalletTransaction } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { X, Coins, Check, Zap, CreditCard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [packages, setPackages] = useState<CoinPackage[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isBuying, setIsBuying] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'history'>('packages');
  const { user, updateUserWalletBalance } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      axios.get('/api/v1/wallet/packages').then((res) => setPackages(res.data.data));
      axios.get('/api/v1/wallet/transactions').then((res) => setTransactions(res.data.data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async (pkg: CoinPackage) => {
    setIsBuying(pkg.id);
    try {
      const res = await axios.post('/api/v1/wallet/checkout', {
        coin_package_id: pkg.id,
      });

      if (res.data.status === 'success') {
        alert(`Success! Purchased ${pkg.name}. Added ${pkg.coins + pkg.bonus_coins} coins to your wallet!`);
        if (res.data.wallet) {
          updateUserWalletBalance(res.data.wallet.balance_coins);
        }
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setIsBuying(null);
    }
  };

  const balance = user?.wallet?.balance_coins ?? 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl text-white">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">Coin Wallet</h3>
              <p className="text-xs text-slate-400">Current Balance: <span className="text-amber-400 font-bold">{balance} Coins</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition ${
              activeTab === 'packages' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            Buy Coin Packages
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition ${
              activeTab === 'history' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            Transaction History
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[480px] overflow-y-auto space-y-4">
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between relative ${
                    pkg.is_popular ? 'border-amber-500/60 shadow-lg shadow-amber-500/10' : 'border-slate-800'
                  }`}
                >
                  {pkg.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-widest shadow">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="space-y-3 text-center pt-2">
                    <h4 className="font-bold text-sm text-slate-200">{pkg.name}</h4>
                    <div className="text-3xl font-black text-amber-400 font-mono">
                      {pkg.coins} <span className="text-xs text-slate-400">Coins</span>
                    </div>
                    {pkg.bonus_coins > 0 && (
                      <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> +{pkg.bonus_coins} Bonus Coins
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                    <div className="text-center font-black text-lg text-white">${pkg.price_usd}</div>
                    <button
                      onClick={() => handleCheckout(pkg)}
                      disabled={isBuying === pkg.id}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      {isBuying === pkg.id ? 'Processing...' : 'Checkout'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No transactions recorded yet.</div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{tx.description}</div>
                      <div className="text-[10px] text-slate-500">{new Date(tx.created_at).toLocaleString()}</div>
                    </div>
                    <div className={`font-mono font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{tx.amount} Coins
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
