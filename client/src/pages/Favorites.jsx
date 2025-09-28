import React, { useState, useEffect } from 'react';
import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useToast } from '../context/ToastContext';
import { getFavorites, removeFavorite } from '../services/api';
import { useAuth } from "../context/AuthContext";

const typeColors = {
  player: "bg-blue-100 text-blue-800 border-blue-300",
  match: "bg-green-100 text-green-800 border-green-300",
  schedule: "bg-pink-100 text-pink-800 border-pink-300",
};

const typeLabels = {
  player: "Player",
  match: "Match",
  schedule: "Schedule",
};

const Favorites = () => {
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites(user.id);
      setFavorites(data);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId, type) => {
    setRemovingId(itemId + type);
    await removeFavorite(user.id, itemId);
    setFavorites(prev => prev.filter(f => !(f.itemId === itemId && f.type === type)));
    setRemovingId('');
    showToast("Removed from favorites!", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-800"></div>
      </div>
    );
  }

  const filteredFavorites = filter === 'all'
    ? favorites
    : favorites.filter(f => f.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-6 tracking-tight">Favorites</h1>
          <p className="text-2xl text-gray-700 font-bold">Your saved players, matches, and schedules</p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {['all', 'player', 'match', 'schedule'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-3 rounded-xl font-bold border-2 border-black transition-all capitalize ${
                  filter === filterType ? 'bg-purple-500 text-white' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {filterType === 'all' ? 'All Favorites' : `${typeLabels[filterType]}s`}
              </button>
            ))}
          </div>
        </div>

        {filteredFavorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-12 max-w-md mx-auto">
              <StarIcon className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-2xl font-black text-black mb-4">No Favorites Yet</h3>
              <p className="text-gray-600 font-medium">
                Start adding players, matches, and schedules to your favorites!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFavorites.map((f) => (
              <div
                key={`${f.type}-${f.itemId}`}
                className={`relative bg-white rounded-2xl border-2 shadow-lg transition-shadow hover:shadow-2xl border-black p-7 flex flex-col justify-between group`}
              >
                <span className={`absolute -top-5 right-5 px-3 py-1 rounded-full border text-xs font-bold uppercase ${typeColors[f.type]}`}>
                  {typeLabels[f.type]}
                </span>
                <div className="mb-4">
                  <h4 className="font-extrabold text-2xl text-purple-900 mb-2 break-words">{f.title}</h4>
                  <p className="text-gray-500 mb-2">{f.subtitle || ''}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <StarIcon className="w-8 h-8 text-yellow-500" />
                  <button
                    disabled={removingId === f.itemId + f.type}
                    onClick={() => handleRemove(f.itemId, f.type)}
                    className="ml-auto px-3 py-2 bg-pink-200 border border-black rounded-xl hover:bg-pink-400 transition flex items-center gap-1 text-black font-bold"
                  >
                    {removingId === f.itemId + f.type ? (
                      <span className="animate-spin h-4 w-4 border-b-2 border-black rounded-full inline-block"></span>
                    ) : (
                      <TrashIcon className="w-5 h-5 text-black" />
                    )}
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
