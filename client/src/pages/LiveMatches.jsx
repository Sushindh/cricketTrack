import React, { useState, useEffect } from "react";
import { Star, Calendar, Clock } from "lucide-react";

// API endpoint
const API_URL = "http://localhost:3000/api/matches/live";

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("matchFavorites") || "[]");
    setFavorites(saved);
  }, []);

  async function fetchMatches() {
    try {
      setError("");
      const resp = await fetch(API_URL);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data = await resp.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to fetch live matches: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
  };

  const toggleFavorite = (matchId) => {
    let updated;
    if (favorites.includes(matchId)) {
      updated = favorites.filter(f => f !== matchId);
    } else {
      updated = [...favorites, matchId];
    }
    setFavorites(updated);
    localStorage.setItem("matchFavorites", JSON.stringify(updated));
  };

  const getMatchStatus = (match) => {
    if (!match.status) return { text: 'Unknown', color: 'bg-gray-400' };
    const status = match.status.toLowerCase();
    if (status.includes('live') || status === 'live') {
      return { text: 'LIVE', color: 'bg-red-500' };
    } else if (status.includes('finished') || status.includes('completed')) {
      return { text: 'FINISHED', color: 'bg-green-500' };
    } else if (status.includes('upcoming') || status.includes('scheduled')) {
      return { text: 'UPCOMING', color: 'bg-blue-500' };
    } else if (status.includes('cancelled')) {
      return { text: 'CANCELLED', color: 'bg-gray-400' };
    } else if (status.includes('postponed')) {
      return { text: 'POSTPONED', color: 'bg-yellow-500' };
    }
    return { text: status.toUpperCase(), color: 'bg-gray-400' };
  };

  const getTeamName = (team) => {
    if (typeof team === 'string') return team;
    return team?.name || 'Unknown Team';
  };

  const getTeamCode = (team) => {
    if (typeof team === 'string') return team.substring(0, 3).toUpperCase();
    return team?.code || (team?.name ? team.name.substring(0,3).toUpperCase() : 'T');
  };

  const getVenueName = (venue) => {
    if (typeof venue === 'string') return venue;
    return venue?.name || 'Unknown Venue';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-slate-200">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Live Matches</h2>
            <p className="text-slate-600">Fetching the latest cricket updates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-red-200 text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <span className="block text-red-600 font-bold text-3xl">!</span>
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-4">Connection Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-6 tracking-tight">Live Matches</h1>
          <p className="text-2xl text-gray-700 font-bold">See live scores and updates on current games</p>
        </div>
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-black mb-4">No Live Matches</h3>
              <p className="text-gray-600 font-medium">There are no live cricket matches at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {matches.map((match) => {
              const matchId = match.id;
              const isFavorite = favorites.includes(matchId);
              const status = getMatchStatus(match);
              const team1 = getTeamName(match.localteam);
              const team2 = getTeamName(match.visitorteam);
              const team1Code = getTeamCode(match.localteam);
              const team2Code = getTeamCode(match.visitorteam);

              return (
                <div key={matchId} className="bg-white rounded-3xl shadow-2xl border-4 border-black p-6 max-w-md w-full flex flex-col">
                  {/* Status + Favorite */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-4 py-2 rounded-full text-white text-sm font-bold ${status.color}`}>
                      {status.text}
                    </div>
                    <button onClick={() => toggleFavorite(matchId)} className="p-2 rounded-full border-2 border-gray-300 hover:border-yellow-400">
                      {isFavorite ? (
                        <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                      ) : (
                        <Star className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {/* Name & Venue */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-black text-black mb-2">{match.name || `${team1} vs ${team2}`}</h3>
                    <p className="text-sm text-gray-600 font-medium">{getVenueName(match.venue)}</p>
                  </div>
                  {/* Teams Row */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center flex-1">
                      <div className="font-bold text-black">{team1}</div>
                      <div className="text-2xl font-black text-blue-600">{team1Code}</div>
                    </div>
                    <div className="mx-4">
                      <div className="text-3xl font-black text-black">VS</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="font-bold text-black">{team2}</div>
                      <div className="text-2xl font-black text-red-600">{team2Code}</div>
                    </div>
                  </div>
                  {/* Result/Note */}
                  {match.note && (
                    <div className="mt-2 bg-green-100 border border-green-300 text-green-900 font-bold rounded-xl py-2 px-4 text-center">
                      {match.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
