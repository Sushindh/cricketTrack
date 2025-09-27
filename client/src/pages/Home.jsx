import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ChatBot from '../components/ChatBot';
import { getFavorites } from '../services/api';

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const favorites = await getFavorites();
      if (favorites.length > 0) {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorites })
        });
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto min-h-full">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black text-black mb-6 tracking-tight">
            Unleash Your Cricket
          </h1>
          <div className="bg-white rounded-full px-8 py-4 border-4 border-black inline-block mb-8">
            <input
              type="text"
              placeholder="Try: 'Best bowling figures' or 'Top run scorers'"
              className="text-xl text-gray-700 bg-transparent outline-none w-96"
            />
            <button className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-full font-bold border-2 border-blue-600">
              Generate Tracker
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-8 min-h-[500px]">
            <div className="flex items-center mb-6">
              <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3 text-blue-600" />
              <h2 className="text-3xl font-black text-black">Cricket AI Assistant</h2>
            </div>
            <ChatBot />
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border-4 border-black p-8 min-h-[500px]">
            <div className="flex items-center mb-6">
              <SparklesIcon className="w-8 h-8 mr-3 text-purple-600" />
              <h2 className="text-3xl font-black text-black">Personalized Recommendations</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-black">
                    <h3 className="font-bold text-black mb-2">{rec.title}</h3>
                    <p className="text-gray-700">{rec.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-8">
                  <h3 className="text-2xl font-black text-yellow-800 mb-4">
                    Start Building Your Favorites!
                  </h3>
                  <p className="text-yellow-700 font-bold">
                    Add players and matches to get personalized recommendations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;