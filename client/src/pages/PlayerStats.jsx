import React, { useState, useEffect } from "react";
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import FavoriteButton from "../components/FavoriteButton";

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetail, setPlayerDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/players");
      if (!resp.ok) throw new Error("Error fetching player list");
      const data = await resp.json();
      setPlayers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPlayerClick = async (player) => {
    setSelectedPlayer(player);
    setPlayerDetail(null);
    setDetailLoading(true);
    try {
      const resp = await fetch(`http://localhost:3000/api/players/${player.id}/detail`);
      const data = await resp.json();
      setPlayerDetail(data);
    } catch (err) {
      setPlayerDetail({ bio: "No player profile or stats found." });
    }
    setDetailLoading(false);
  };

  const toggleFav = (id) => {
    if (!id) return;
    const updated = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("playerFavorites", JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playerFavorites") || "[]");
    setFavorites(saved);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-black mx-auto"></div>
        <p className="mt-3">Loading player stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{error}</p>
        <button onClick={fetchPlayers} className="mt-4 px-4 py-2 border rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!players.length) {
    return <p className="p-8 text-center">No player data found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Player Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="p-6 bg-white border-2 border-black rounded-xl shadow-lg cursor-pointer"
            onClick={() => onPlayerClick(player)}
          >
            <div className="border rounded-lg p-4 mb-4 flex justify-between items-center">
              <span className="font-bold">{player.name}</span>
              <FavoriteButton
  itemId={player.id}
  itemType="player" // <-- ADD THIS!
  title={player.name} // <-- recommended for user-friendly favorites
  data={{ country: player.country }} // optional
  isFavorite={favorites.some(f => f.itemId === player.id && f.type === "player")}
/>
            </div>
            <p className="mb-3 text-gray-600">{player.country}</p>
          </div>
        ))}
      </div>
      {/* Player Profile Modal/Card */}
      {selectedPlayer && (
        <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg border-2 border-black text-center">
          <h3 className="text-2xl font-bold mb-4">{selectedPlayer.name} - Player Profile</h3>
          {detailLoading ? (
            <p>Loading...</p>
          ) : playerDetail ? (
            <div>
              <p>{playerDetail.bio}</p>
              {/* Render additional stats if available: */}
              {playerDetail.runs && <div>Total Runs: {playerDetail.runs}</div>}
              {playerDetail.matches && <div>Total Matches: {playerDetail.matches}</div>}
            </div>
          ) : null}
          <button onClick={() => setSelectedPlayer(null)} className="mt-4 text-red-600 underline">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
