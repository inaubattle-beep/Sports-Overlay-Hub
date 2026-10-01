import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Team, Player } from '../../types';
import { Users, Plus, Trash2, Edit2, UserPlus, Shirt } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#1e293b');

  // Player management modal state
  const [selectedTeamForPlayers, setSelectedTeamForPlayers] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState('Forward');

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

  const openPlayersModal = async (team: Team) => {
    setSelectedTeamForPlayers(team);
    try {
      const res = await axios.get(`/api/v1/teams/${team.id}/players`);
      setPlayers(res.data.data);
    } catch (e) {
      console.error('Failed to load players');
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForPlayers) return;

    try {
      const res = await axios.post(`/api/v1/teams/${selectedTeamForPlayers.id}/players`, {
        name: playerName,
        jersey_number: jerseyNumber ? Number(jerseyNumber) : null,
        position,
      });

      setPlayers([...players, res.data.data]);
      setPlayerName('');
      setJerseyNumber('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add player');
    }
  };

  const handleDeletePlayer = async (playerId: number) => {
    try {
      await axios.delete(`/api/v1/players/${playerId}`);
      setPlayers(players.filter((p) => p.id !== playerId));
    } catch (e) {
      alert('Failed to remove player');
    }
  };

  const handleSubmitTeam = async (e: React.FormEvent) => {
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

  const handleDeleteTeam = async (teamId: number) => {
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
            Broadcast Assets & Rosters
          </span>
          <h2 className="text-3xl font-black text-white">Teams & Player Rosters</h2>
          <p className="text-slate-400 text-sm mt-1">Manage custom team names, theme colors, jersey numbers, and registered player lists.</p>
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
            <div>
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

              <div className="flex items-center gap-3 pt-3 mt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: team.primary_color }} />
                  <span className="text-slate-400 font-mono">{team.primary_color}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: team.secondary_color || '#1e293b' }} />
                  <span className="text-slate-400 font-mono">{team.secondary_color || '#1e293b'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <button
                onClick={() => openPlayersModal(team)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <Users className="w-3.5 h-3.5" /> Manage Roster
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(team)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                  title="Edit Team"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="p-2 bg-slate-800 hover:bg-red-900/50 text-red-400 rounded-xl"
                  title="Delete Team"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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

            <form onSubmit={handleSubmitTeam} className="p-6 space-y-4 text-xs">
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

      {/* Modal for Managing Team Players Roster */}
      {selectedTeamForPlayers && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl text-white">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-lg font-black">{selectedTeamForPlayers.name} Roster</h3>
                <p className="text-xs text-slate-400">Register players for live broadcast scoring</p>
              </div>
              <button onClick={() => setSelectedTeamForPlayers(null)} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
                &times;
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Form to add player */}
              <form onSubmit={handleAddPlayer} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <span className="font-bold text-blue-400 block uppercase tracking-widest text-[10px] flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" /> Add Player to Team
                </span>

                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Player Full Name"
                    className="col-span-6 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                    required
                  />
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(e.target.value)}
                    placeholder="Jersey #"
                    className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  />
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="col-span-3 bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-white outline-none"
                  >
                    <option value="Forward">Forward</option>
                    <option value="Midfielder">Midfield</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Keeper</option>
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white shadow transition"
                >
                  Register Player
                </button>
              </form>

              {/* Roster List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {players.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">No registered players in roster.</div>
                ) : (
                  players.map((p) => (
                    <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono font-bold flex items-center justify-center">
                          #{p.jersey_number ?? '-'}
                        </div>
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-500">{p.position}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePlayer(p.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900"
                        title="Remove Player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
