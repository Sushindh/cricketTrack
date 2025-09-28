// services/api.js
const API_BASE = 'http://localhost:3000/api';

export const getLiveMatches = async () => {
  const response = await fetch(`${API_BASE}/matches/live`);
  if (!response.ok) throw new Error('Failed to fetch live matches');
  return response.json();
};


export const getPlayerStats = async () => {
  const response = await fetch(`${API_BASE}/players`);
  if (!response.ok) throw new Error('Failed to fetch player stats');
  return response.json();
};

export const getMatchSchedule = async (days = 7) => {
  const response = await fetch(`${API_BASE}/matches/schedule?days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch match schedule');
  return response.json();
};

//const API_BASE = 'http://localhost:3000/api';

export async function getFavorites(userId) {
  const res = await fetch(`${API_BASE}/favorites/${userId}`);
  return await res.json();
}

export async function addFavorite(userId, favorite) {
  const res = await fetch(`${API_BASE}/favorites/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, favorite }) // favorite = {itemId, type, title, data, createdAt}
  });
  return await res.json();
}

export async function removeFavorite(userId, favoriteId) {
  const res = await fetch(`${API_BASE}/favorites/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, favoriteId })
  });
  return await res.json();
}

