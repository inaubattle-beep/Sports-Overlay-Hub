import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, Activity, Award, AlertTriangle, Tv, CheckCircle2 } from 'lucide-react';

export const UserReports: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/v1/reports/summary');
      setAnalytics(res.data.analytics);
      setRecentEvents(res.data.recent_events);
    } catch (e) {
      console.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Broadcasting Intelligence
          </span>
          <h2 className="text-3xl font-black text-white">Match Reports & Event Analytics</h2>
          <p className="text-slate-400 text-sm mt-1">Detailed statistical insights across all your broadcast matches and score events.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Live Analytics Active
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Broadcasts</span>
              <Tv className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{analytics.total_matches}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Score Events</span>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{analytics.total_events}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Goals / Points</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{analytics.total_goals}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Yellow / Red Cards</span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-3xl font-black text-rose-400">{analytics.total_cards}</div>
          </div>
        </div>
      )}

      {/* Recent Score Events Audit Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Recent Immutable Score Events Feed
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-widest font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Event ID</th>
                <th className="p-3">Match</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Event Time</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {recentEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-mono font-bold text-slate-500">#{evt.id}</td>
                  <td className="p-3 font-bold text-white">{evt.match?.name || 'Live Match'}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-slate-950 text-blue-400 border border-slate-800 rounded text-[10px] font-mono uppercase font-bold">
                      {evt.event_type}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">+{evt.value}</td>
                  <td className="p-3 font-mono text-slate-400">{evt.event_time}s</td>
                  <td className="p-3 text-slate-500">{new Date(evt.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
