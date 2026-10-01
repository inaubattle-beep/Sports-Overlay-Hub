import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Team } from '../../types';
import { Users, Plus, Trash2, Edit2, Shield } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#1e293b');

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/v1/teams');
      setTeams(res.data.data);
    } catch (e) {
      console.error('Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openCreateModal = () => {
    setEditingTeam(null);
    setName('');
    setShortName('');
    setPrimaryColor('#2563eb');
    setSecondaryColor('#1e293b');
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setName(team.name);
    setShortName(team.short_name);
    setPrimaryColor(team.primary_color);
    setSecondaryColor(team.secondary_color || '#1e293b');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await axios.put(`/api/v1/teams/${editingTeam.id}`, {
          name,
          short_name: shortName,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        });
      } else {
        await axios.post('/api/v1/teams', {
          name,
          short_name: shortName,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        });
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save team');
    }
  };

  const handleDelete = async (teamId: number) => {
    if (!confirm('Are you sure you want to delete this team?')) return;
    try {
      await axios.delete(`/api/v1/teams/${teamId}`);
      fetchTeams();
    } catch (e) {
      alert('Failed to delete team');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
            Broadcast Assets
          </span>
          <h2 className="text-3xl font-black text-white">Custom Team Roster Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage team names, 3-letter codes, and broadcast theme colors for your scoreboards.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/20"
                style={{ backgroundColor: team.primary_color }}
              >
                {team.name.charAt(0)}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">[{team.short_name}]</span>
                <h3 className="text-xl font-black text-white">{team.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: team.primary_color }} />
                <span className="text-slate-400 font-mono">{team.primary_color}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: team.secondary_color || '#1e293b' }} />
                <span className="text-slate-400 font-mono">{team.secondary_color || '#1e293b'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => openEditModal(team)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                title="Edit Team"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                className="p-2 bg-slate-800 hover:bg-red-900/50 text-red-400 rounded-xl"
                title="Delete Team"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit Team */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl text-white">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-lg font-black">{editingTeam ? 'Edit Team' : 'Create Custom Team'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dhaka Abahani"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Short Code (Max 5 Chars)</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. DHA"
                  maxLength={5}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
