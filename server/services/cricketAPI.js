const axios = require('axios');

// Using SportMonks Cricket API (Free tier - 180 calls/hour/endpoint)
const API_BASE = 'https://api.cricapi.com/v1';
const API_KEY = '1768a3d2-3575-43bb-82be-e0db8a384c4e'; // Get from https://www.sportmonks.com

const cricketAPI = axios.create({
  baseURL: API_BASE,
  params: {
    api_token: API_KEY
  },
  timeout: 10000,
});

// Get live matches
const getLiveMatches = async () => {
  try {
    const response = await cricketAPI.get('/livescores');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching live matches:', error.message);
    // Return mock data for demo
    return [
      {
        id: 1,
        name: "India vs Australia, 3rd T20I",
        localteam: { name: "India", code: "IND" },
        visitorteam: { name: "Australia", code: "AUS" },
        venue: { name: "Sydney Cricket Ground" },
        status: "live",
        note: "India won by 6 wickets"
      }
    ];
  }
};

// Get fixtures/schedule
const getMatchSchedule = async (days = 7) => {
  try {
    const response = await cricketAPI.get('/fixtures');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    // Return mock data
    return [
      {
        id: 1,
        name: "India vs England, 1st Test",
        localteam: { name: "India", code: "IND" },
        visitorteam: { name: "England", code: "ENG" },
        venue: { name: "Lords, London" },
        starting_at: "2025-09-25T10:30:00Z",
        type: "Test",
        league: { name: "Test Championship" }
      },
      {
        id: 2,
        name: "Australia vs Pakistan, 2nd ODI", 
        localteam: { name: "Australia", code: "AUS" },
        visitorteam: { name: "Pakistan", code: "PAK" },
        venue: { name: "Melbourne Cricket Ground" },
        starting_at: "2025-09-26T08:00:00Z",
        type: "ODI",
        league: { name: "Bilateral ODI Series" }
      }
    ];
  }
};

// Get players (simplified)
const getPlayerStats = async () => {
  try {
    // SportMonks doesn't have a simple players endpoint, so using mock data
    return [
      {
        id: 1,
        name: "Virat Kohli",
        country: "India",
        role: "Batsman",
        matches: 275,
        runs: 13906,
        strikeRate: 93.42,
        average: 59.33,
        wickets: 4
      },
      {
        id: 2,
        name: "Rohit Sharma",
        country: "India", 
        role: "Batsman",
        matches: 267,
        runs: 10866,
        strikeRate: 89.12,
        average: 49.16,
        wickets: 8
      },
      {
        id: 3,
        name: "Babar Azam",
        country: "Pakistan",
        role: "Batsman", 
        matches: 102,
        runs: 4442,
        strikeRate: 88.55,
        average: 56.83,
        wickets: 0
      },
      {
        id: 4,
        name: "Kane Williamson",
        country: "New Zealand",
        role: "Batsman",
        matches: 161,
        runs: 6173,
        strikeRate: 81.98,
        average: 47.48,
        wickets: 0
      }
    ];
  } catch (error) {
    console.error('Error fetching players:', error.message);
    return [];
  }
};

module.exports = {
  getLiveMatches,
  getMatchSchedule,
  getPlayerStats
};
