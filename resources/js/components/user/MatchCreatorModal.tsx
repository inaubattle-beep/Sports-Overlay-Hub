import React, { useState } from 'react';
import { useMatchStore } from '../../stores/useMatchStore';
import { X, PlusCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchCreatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createMatch, isLoading } = useMatchStore();
  const [name, setName] = useState('');
  const [sportId, setSportId] = useState(1);
  const [homeName, setHomeName] = useState('Dhaka');
  const [homeShort, setHomeShort] = useState('DHA');
  const [homeColor, setHomeColor] = useState('#2563eb');
  const [awayName, setAwayName] = useState('Saver');
  const [awayShort, setAwayShort] = useState('SAV');
  const [awayColor, setAwayColor] = useState('#dc2626');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createMatch({
      name: name || `${homeName} vs ${awayName}`,
      sport_id: Number(sportId),
      home_team_name: homeName,
      home_team_short: homeShort,
      home_primary_color: homeColor,
      away_team_name: awayName,
      away_team_short: awayShort,
      away_primary_color: awayColor,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl text-white">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <h3 className="text-lg font-black flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-400" /> Create New Live Match
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Match Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dhaka vs Saver Championship Final"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Sport Type</label>
            <select
              value={sportId}
              onChange={(e) => setSportId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:border-blue-500 outline-none"
            >
              <option value={1}>Football / Soccer</option>
              <option value={2}>Cricket</option>
              <option value={3}>Volleyball / Badminton</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Home Team */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="font-bold text-blue-400 block uppercase tracking-widest text-[10px]">Home Team</span>
              <input
                type="text"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                placeholder="Team Name"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                required
              />
              <input
                type="text"
                value={homeShort}
                onChange={(e) => setHomeShort(e.target.value)}
                placeholder="Short (e.g. DHA)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Color:</span>
                <input
                  type="color"
                  value={homeColor}
                  onChange={(e) => setHomeColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>

            {/* Away Team */}
            <div className="space-y-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="font-bold text-red-400 block uppercase tracking-widest text-[10px]">Away Team</span>
              <input
                type="text"
                value={awayName}
                onChange={(e) => setAwayName(e.target.value)}
                placeholder="Team Name"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                required
              />
              <input
                type="text"
                value={awayShort}
                onChange={(e) => setAwayShort(e.target.value)}
                placeholder="Short (e.g. SAV)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Color:</span>
                <input
                  type="color"
                  value={awayColor}
                  onChange={(e) => setAwayColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
            >
              {isLoading ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
