import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScoreboardTemplate } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { Coins, CheckCircle, Lock, ShoppingBag } from 'lucide-react';

interface Props {
  onOpenWallet: () => void;
}

export const TemplateMarketplace: React.FC<Props> = ({ onOpenWallet }) => {
  const [templates, setTemplates] = useState<ScoreboardTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const { user, updateUserWalletBalance } = useAuthStore();

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/v1/templates/public');
      setTemplates(res.data.data);
    } catch (e) {
      console.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handlePurchase = async (template: ScoreboardTemplate) => {
    if (!user) {
      alert('Please login first to purchase templates.');
      return;
    }

    setBuyingId(template.id);
    try {
      const res = await axios.post('/api/v1/templates/purchase', {
        template_id: template.id,
      });

      if (res.data.status === 'success') {
        alert(res.data.message);
        if (res.data.wallet) {
          updateUserWalletBalance(res.data.wallet.balance_coins);
        }
        fetchTemplates();
      } else {
        alert(res.data.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Purchase failed.');
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            Broadcast Graphics Marketplace
          </span>
          <h2 className="text-3xl font-black text-white">Scoreboard Template Store</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Unlock premium 3D broadcast overlays for Football, Cricket, Volleyball and more using your wallet coins.
          </p>
        </div>

        <button
          onClick={onOpenWallet}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition"
        >
          <Coins className="w-5 h-5 text-slate-950" />
          <span>Buy Coins / Subscription</span>
        </button>
      </div>

      {/* Enterprise Pro Organization Plan Feature Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-2">
              ⭐ Advanced Tier
            </div>
            <h3 className="text-2xl font-black text-white">Enterprise Organization Plan</h3>
            <p className="text-slate-400 text-xs mt-1">Designed for larger sports organizations with advanced broadcasting needs.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">$20 <span className="text-xs text-slate-400 font-normal">/month</span></div>
            <div className="text-[11px] text-emerald-400 font-bold">Billed annually at $240 (Save 4 months)</div>
            <button
              onClick={onOpenWallet}
              className="mt-3 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Upgrade to Enterprise Pro
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Rooms & Presets</div>
            <div className="text-sm font-black text-emerald-400">✓ Unlimited</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Concurrent Displays</div>
            <div className="text-sm font-black text-white">5 Displays</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Controllers & Overlays</div>
            <div className="text-sm font-black text-emerald-400">✓ Unlimited</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Templates Access</div>
            <div className="text-sm font-black text-purple-400">All Templates</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Leaderboards</div>
            <div className="text-sm font-black text-amber-400">10 (25 Teams)</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">PIN Protection & Support</div>
            <div className="text-sm font-black text-cyan-400">✓ Priority</div>
          </div>
        </div>

        {/* Detailed Plan Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-purple-500/20 text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Unlimited rooms & presets
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> 5 concurrent live displays
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Unlimited controllers & overlays
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> All templates & PIN protection
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> 10 leaderboards (up to 25 teams each)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">✓</span> Priority 24/7 SLA Support
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              {/* Preview Graphic Box */}
              <div className="h-44 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center border-b border-slate-800 relative p-4">
                <div className="w-full h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between px-4 text-xs font-bold text-white shadow">
                  <span className="text-blue-400">HOME</span>
                  <span className="text-slate-400 font-mono text-base">2 - 1</span>
                  <span className="text-red-400">AWAY</span>
                </div>

                {!tpl.is_unlocked && tpl.is_premium && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-slate-950/80 backdrop-blur text-amber-400 border border-amber-500/40 rounded-full text-xs font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Premium
                  </div>
                )}
              </div>

              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  {tpl.category}
                </span>
                <h3 className="text-lg font-black text-white">{tpl.name}</h3>
                <p className="text-xs text-slate-400">Aspect Ratio: {tpl.aspect_ratio} | {tpl.default_width}x{tpl.default_height}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
              <div>
                {!tpl.is_premium || tpl.price_coins === 0 ? (
                  <span className="text-emerald-400 font-bold text-sm">FREE</span>
                ) : (
                  <span className="text-amber-400 font-black text-base flex items-center gap-1">
                    <Coins className="w-4 h-4" /> {tpl.price_coins} Coins
                  </span>
                )}
              </div>

              {tpl.is_unlocked ? (
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Unlocked
                </span>
              ) : (
                <button
                  onClick={() => handlePurchase(tpl)}
                  disabled={buyingId === tpl.id}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg active:scale-95 transition disabled:opacity-50"
                >
                  {buyingId === tpl.id ? 'Unlocking...' : 'Unlock Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
