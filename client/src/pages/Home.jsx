import React, { useState, useEffect } from "react";
import { ChatBubbleLeftRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ChatBot from "../components/ChatBot";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth(); // user must have "id"
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [trackerResult, setTrackerResult] = useState(null);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerError, setTrackerError] = useState("");

  useEffect(() => {
    if (user?.id) loadRecommendations();
    // eslint-disable-next-line
  }, [user]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/tracker/${user.id}`);
      const recs = await response.json();
      setRecommendations(
        recs.map((t) => ({
          title: t.query,
          description: t.answer,
        }))
      );
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const generateTracker = async () => {
    if (!query.trim()) return;
    setTrackerLoading(true);
    setTrackerError("");
    setTrackerResult(null);
    try {
      const response = await fetch("http://localhost:3000/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, userId: user.id }),
      });
      const data = await response.json();
      if (data.result) setTrackerResult(data.result);
      else setTrackerError(data.error || "Error generating tracker!");
      setQuery("");
      await loadRecommendations();
    } catch {
      setTrackerError("Error generating tracker!");
    } finally {
      setTrackerLoading(false);
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
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={trackerLoading}
            />
            <button
              className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-full font-bold border-2 border-blue-600"
              onClick={generateTracker}
              disabled={!query || trackerLoading}
            >
              {trackerLoading ? "Generating..." : "Generate Tracker"}
            </button>
          </div>
          {trackerLoading && (
            <div className="mt-4 font-bold text-blue-700">Generating...</div>
          )}
          {trackerError && (
            <div className="mt-4 font-bold text-red-500">{trackerError}</div>
          )}
          {trackerResult && (
            <div className="mt-4 p-6 bg-blue-50 border-4 border-blue-300 rounded-2xl">
              <h3 className="font-black text-2xl text-blue-700 mb-2">Tracker Result</h3>
              <div className="text-lg text-black">
                {typeof trackerResult === "string" ? trackerResult : JSON.stringify(trackerResult)}
              </div>
            </div>
          )}
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
