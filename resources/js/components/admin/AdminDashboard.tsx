import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../types';
import { Users, Shield, Tv, Coins, Activity, FileText, Flag, UserCheck, Plus, Minus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coinAmount, setCoinAmount] = useState<number>(100);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const statsRes = await axios.get('/api/v1/admin/stats');
      setStats(statsRes.data.stats);

      const usersRes = await axios.get('/api/v1/admin/users');
      setUsers(usersRes.data.data);
    } catch (e) {
      console.error('Failed to load admin stats', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateRole = async (user: User, newRole: string) => {
    try {
      await axios.put(`/api/v1/admin/users/${user.id}`, {
        role: newRole,
        status: user.status || 'active',
      });
      alert(`Updated ${user.name}'s role to ${newRole}`);
      fetchAdminData();
    } catch (e) {
      alert('Failed to update role');
    }
  };

  const handleAdjustCoins = async (user: User, type: 'credit' | 'debit') => {
    try {
      await axios.post(`/api/v1/admin/users/${user.id}/coins`, {
        amount: coinAmount,
        type: type,
        reason: `Super Admin ${type} coin grant`,
      });
      alert(`${type === 'credit' ? 'Granted' : 'Deducted'} ${coinAmount} coins for ${user.name}`);
      fetchAdminData();
    } catch (e) {
      alert('Failed to adjust coins balance');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-8 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">
            Super Admin Control Center
          </span>
          <h2 className="text-3xl font-black text-white">Main Platform Governance & Master Ledger</h2>
        </div>
        <div className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center gap-2">
          <Shield className="w-4 h-4" /> Super User Authorized
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.total_users}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Teams</span>
              <Flag className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats.total_teams ?? 0}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Players</span>
              <UserCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-400">{stats.total_players ?? 0}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Live Matches</span>
              <Tv className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats.active_matches}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Templates</span>
              <FileText className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">{stats.total_templates}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Coins Pool</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{stats.coins_distributed}</div>
          </div>
        </div>
      )}

      {/* Users & Main Panel Governance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Master User Accounts & Coin Management
          </h3>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-bold">Quick Coin Batch:</span>
            <input
              type="number"
              value={coinAmount}
              onChange={(e) => setCoinAmount(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-white font-mono w-20 px-2 py-0.5 rounded outline-none text-center"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-widest font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Coins Balance</th>
                <th className="p-3">Manage Coins</th>
                <th className="p-3">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-mono font-bold text-slate-500">#{u.id}</td>
                  <td className="p-3 font-bold text-white">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        u.role === 'super_admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-400">{u.wallet?.balance_coins ?? 0} Coins</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustCoins(u, 'credit')}
                        className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded font-bold text-[10px] flex items-center gap-1 transition"
                        title="Grant Coins"
                      >
                        <Plus className="w-3 h-3" /> Add {coinAmount}
                      </button>
                      <button
                        onClick={() => handleAdjustCoins(u, 'debit')}
                        className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded font-bold text-[10px] flex items-center gap-1 transition"
                        title="Deduct Coins"
                      >
                        <Minus className="w-3 h-3" /> Deduct
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white outline-none"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

