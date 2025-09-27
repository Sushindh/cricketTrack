import React, { useState, useEffect } from 'react';
import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useToast } from '../context/ToastContext';
import { getFavorites, removeFromFavorites } from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      showToast('Failed to load favorites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemId, type) => {
    try {
      await removeFromFavorites(itemId, type);
      setFavorites(prev => prev.filter(f => !(f.itemId === itemId && f.type === type)));
      showToast('Removed from favorites', 'success');
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      showToast('Failed to remove favorite', 'error');
    }
  };

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(f => f.type === filter);

  const getTypeColor = (type) => {
    switch (type) {
      case 'player': return 'bg-purple-400';
      case 'match': return 'bg-green-400';
      case 'schedule': return 'bg-blue-400';
      default: return 'bg-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'player': return '👤';
      case 'match': return '🏏';
      case 'schedule': return '📅';
      default: return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black text-black mb-8 text-center">Favorites</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

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
                {filterType === 'all' ? 'All Favorites' : `${filterType}s`}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <div
                key={`${favorite.type}-${favorite.itemId}`}
                className="bg-white rounded-3xl shadow-2xl border-4 border-black p-6 transform hover:scale-105 transition-transform duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-4 py-2 rounded-full text-white text-sm font-bold ${getTypeColor(favorite.type)}`}>
                    <span className="mr-2">{getTypeIcon(favorite.type)}</span>
                    {favorite.type.toUpperCase()}
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.itemId, favorite.type)}
                    className="p-2 rounded-full border-2 border-red-300 hover:border-red-500 hover:bg-red-50 transition-colors duration-200"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-black">{favorite.title}</h3>
                  
                  {favorite.type === 'player' && favorite.data && (
                    <div className="space-y-2">
                      <p className="text-gray-600 font-medium">{favorite.data.country}</p>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-black text-black">{favorite.data.matches || '0'}</p>
                          <p className="text-xs text-gray-600">Matches</p>
                        </div>
                        <div>
                          <p className="text-lg font-black text-black">{favorite.data.runs || '0'}</p>
                          <p className="text-xs text-gray-600">Runs</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {favorite.type === 'match' && favorite.data && (
                    <div className="space-y-2">
                      <p className="text-gray-600 font-medium">{favorite.data.series}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">{favorite.data.team1}</span>
                        <span className="font-black">VS</span>
                        <span className="font-bold">{favorite.data.team2}</span>
                      </div>
                      {favorite.data.venue && (
                        <p className="text-xs text-gray-500">{favorite.data.venue}</p>
                      )}
                    </div>
                  )}

                  {favorite.type === 'schedule' && favorite.data && (
                    <div className="space-y-2">
                      <p className="text-gray-600 font-medium">{favorite.data.series}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">{favorite.data.team1}</span>
                        <span className="font-black">VS</span>
                        <span className="font-bold">{favorite.data.team2}</span>
                      </div>
                      {favorite.data.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(favorite.data.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 font-medium">
                    Added: {new Date(favorite.createdAt || Date.now()).toLocaleDateString()}
                  </div>
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
