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

export const getFavorites = async () => {
  const response = await fetch(`${API_BASE}/favorites`);
  if (!response.ok) throw new Error('Failed to fetch favorites');
  return response.json();
};

export const addToFavorites = async (item) => {
  const response = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!response.ok) throw new Error('Failed to add to favorites');
  return response.json();
};

export const removeFromFavorites = async (itemId, type) => {
  const response = await fetch(`${API_BASE}/favorites/${itemId}/${type}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to remove from favorites');
  return response.json();
};
