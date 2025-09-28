import React, { useState, useEffect } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import FavoriteButton from "../components/FavoriteButton";

// Helper function for safe display
function safeString(val) {
  if (typeof val === 'object' && val !== null) {
    return val.name || JSON.stringify(val);
  }
  return val || '';
}

const MatchSchedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/matches/schedule');
      if (!response.ok) throw new Error('Failed to fetch match schedule');
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = (id) => {
    const updated = favorites.includes(id) 
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("scheduleFavorites", JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scheduleFavorites") || "[]");
    setFavorites(saved);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-black text-black mb-8">Match Schedule</h1>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-black text-black mb-8">Match Schedule</h1>
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-12 max-w-md mx-auto">
            <div className="text-red-600 font-bold mb-4">{error}</div>
            <button onClick={fetchSchedule} className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-6 tracking-tight">Match Schedule</h1>
          <p className="text-2xl text-gray-700 font-bold">Upcoming cricket matches and fixtures</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-black mb-4">No Matches Scheduled</h3>
              <p className="text-gray-600 font-medium">No matches found for the selected period.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const matchDate = new Date(match.starting_at);
              const isToday = matchDate.toDateString() === new Date().toDateString();
              const team1 = match.localteam?.name || 'T1';
              const team2 = match.visitorteam?.name || 'T2';

              return (
                <div key={match.id} className="bg-white rounded-3xl shadow-2xl border-4 border-black p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-4 py-2 rounded-full text-white text-sm font-bold ${isToday ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {isToday ? 'TODAY' : 'UPCOMING'}
                    </div>
                    <div className="border rounded-lg p-4 mb-4 flex justify-between items-center">
                      {/* <span className="font-bold">{match.id}</span> */}
                      <div className="border rounded-lg p-4 mb-4 flex justify-between items-center">
                        <span className="font-bold">{team1} vs {team2}</span>
                        <FavoriteButton
                          itemId={match.id}
                          itemType="match" // <-- ADD THIS!
                          title={`${match.localteam.name} vs ${match.visitorteam.name}`}
                          data={{
                            series: match.series?.name,
                            team1: match.localteam?.name,
                            team2: match.visitorteam?.name,
                            venue: match.venue?.name,
                            date: match.starting_at
                          }}
                          isFavorite={favorites.some(f => f.itemId === match.id && f.type === "match")}
                        />
                      </div>


                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-black text-black mb-2">{safeString(match.name) || 'Cricket Match'}</h3>
                    <p className="text-sm text-gray-600 font-medium">{safeString(match.venue?.name)}</p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center flex-1">
                      <p className="font-bold text-black text-sm">{team1}</p>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-3xl font-black text-black">VS</div>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-black text-sm">{team2}</p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-200 space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-gray-700">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="font-bold">
                        {isNaN(matchDate.getTime()) ? 'Invalid Date' : matchDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-gray-700">
                      <ClockIcon className="w-4 h-4" />
                      <span className="font-bold">
                        {isNaN(matchDate.getTime()) ? 'Invalid Date' : matchDate.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border-2 border-green-300">
                      {safeString(match.type)?.toUpperCase() || 'T20'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSchedule;
