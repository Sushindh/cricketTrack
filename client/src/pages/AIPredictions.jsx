import React, { useState, useEffect, useRef } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, ChatBubbleLeftIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

// Helper function for safe display
function safeString(val) {
  if (typeof val === 'object' && val !== null) {
    return val.name || JSON.stringify(val);
  }
  return val || '';
}

// --- ChatBot component as an inline component ---
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const ChatBot = ({ match }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", content: "Hello! Ask me anything about this match." }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { type: "user", content: input }]);
    setLoading(true);
    try {
      // Provide match details/context in the prompt
      const prompt = `
      Match: ${safeString(match.name)}
      Teams: ${match.localteam?.name || ''} vs ${match.visitorteam?.name || ''}
      Venue: ${safeString(match.venue?.name)}
      Type: ${safeString(match.type)}
      Date: ${match.starting_at}
      User: ${input}
      Give specific cricket insights, predictions, and answers.
      `;

      const result = await model.generateContent(prompt);
      setMessages(prev => [
        ...prev,
        { type: "bot", content: result.response.text() }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { type: "bot", content: "Error: Could not get response from Gemini." }
      ]);
      console.error(error);
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-3 mt-6 flex flex-col h-80">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-2 flex ${m.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl border font-medium ${
                m.type === "user"
                  ? "bg-blue-500 text-white border-blue-700"
                  : "bg-gray-100 text-black border-gray-300"
              }`}
            >
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-2xl border bg-gray-100 text-black border-gray-300">
              <span>Gemini is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-1 py-1 border-2 border-gray-300 rounded-xl"
          placeholder="Type your cricket question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          className="px-2 py-1 bg-blue-500 text-white border-2 border-blue-700 rounded-xl font-bold"
          onClick={send}
          disabled={loading}
        >
          Send
        </button>
        <button
          className="px-2 py-1 bg-gray-300 text-black border-2 border-gray-700 rounded-xl font-bold"
          onClick={() => setMessages([{ type: "bot", content: "Hello! Ask me anything about this match." }])}
          disabled={loading}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const AIPredictions = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black text-black mb-8 text-center">AI Predictions</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-black text-black mb-8">AI Predictions</h1>
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-12 max-w-md mx-auto">
            <div className="text-red-600 font-bold mb-4">{error}</div>
            <button onClick={fetchSchedule} className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-6 tracking-tight">AI Predictions</h1>
          <p className="text-2xl text-gray-700 font-bold">Get AI-powered insights & predictions for upcoming matches</p>
        </div>
        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-black mb-4">No Matches Scheduled</h3>
              <p className="text-gray-600 font-medium">No matches found for the selected period.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
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
                    <button onClick={() => toggleFav(match.id)} className="p-2 rounded-full border-2 border-gray-300 hover:border-yellow-400">
                      {favorites.includes(match.id) ? (
                        <StarIconSolid className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <StarIconOutline className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
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
                  {/* Inline ChatBot! */}
                  <ChatBot match={match} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictions;
