import React, { useState } from "react";
import Navbar from "./Navbar";

export default function Home() {
  const [query, setQuery] = useState("");      // Track user input
  const [result, setResult] = useState("");    // Store generation result message

  // Handler for Generate Tracker button click
  const handleGenerate = () => {
    if (query.trim() === "") {
      setResult("Please enter a topic to generate a tracker!");
    } else {
      // Placeholder for actual generation logic or API call
      setResult(`Tracker generated for: "${query}"`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] px-6 pt-8 font-mono flex flex-col items-center">
      <Navbar />
      <div className="p-1"></div>

      <div className="flex gap-4 mb-8">
        <div className="bg-[#44cdff] px-4 py-3 text-black font-bold border-4 border-black shadow-lg rounded-md">
          AI-POWERED
        </div>
        <div className="bg-[#23ff91] px-4 py-3 text-black font-bold border-4 border-black shadow-lg rounded-md">
          BRUTALLY EFFICIENT
        </div>
        <div className="bg-[#fff24f] px-4 py-3 text-black font-bold border-4 border-black shadow-lg rounded-md">
          MIND-BLOWING
        </div>
        <div className="bg-[#ff4783] px-4 py-3 text-black font-bold border-4 border-black shadow-lg rounded-md">
          WICKET SMART
        </div>
      </div>

      <h1 className="text-7xl font-extrabold tracking-widest mb-4 text-center text-black max-w-4xl">
        UNLEASH YOUR CRICKET
      </h1>

      <p className="mb-10 text-xl text-center text-black max-w-2xl">
        Track matches, analyze players, and get AI-powered insights
      </p>

      <div className="bg-[#fffbe5] rounded-xl border-4 border-black p-8 w-full max-w-lg mx-auto mb-10 flex flex-col items-center shadow-lg">
        <input
          className="w-full px-5 py-4 mb-5 border-2 border-black rounded bg-white text-black font-mono text-xl focus:outline-none"
          type="text"
          placeholder='Try: "Best bowling figures this season"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="w-full bg-[#16a6fe] text-black font-bold border-4 border-black rounded py-4 shadow-xl text-xl flex justify-center items-center gap-3 hover:scale-105 transition-transform duration-150"
          onClick={handleGenerate}
        >
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          GENERATE TRACKER →
        </button>

        {result && (
          <div className="mt-6 w-full bg-white border-2 border-black rounded px-4 py-3 text-black text-lg font-semibold">
            {result}
          </div>
        )}
      </div>

      <div className="flex gap-6 justify-center mb-14 flex-wrap max-w-4xl">
        <a
          href="/live-matches"
          className="bg-[#23ff91] text-black border-4 border-black rounded-lg px-7 py-4 font-bold text-2xl shadow hover:scale-105 transition-transform flex items-center gap-3"
        >
          🏆 LIVE MATCHES
        </a>
        <a
          href="/player-stats"
          className="bg-[#ff4783] text-black border-4 border-black rounded-lg px-7 py-4 font-bold text-2xl shadow hover:scale-105 transition-transform flex items-center gap-3"
        >
          👥 PLAYER STATS
        </a>
        <a
          href="/match-schedule"
          className="bg-[#44cdff] text-black border-4 border-black rounded-lg px-7 py-4 font-bold text-2xl shadow hover:scale-105 transition-transform flex items-center gap-3"
        >
          📅 MATCH SCHEDULE
        </a>
        <a
          href="/ai-predictions"
          className="bg-[#fff24f] text-black border-4 border-black rounded-lg px-7 py-4 font-bold text-2xl shadow hover:scale-105 transition-transform flex items-center gap-3"
        >
          ⚡ AI PREDICTIONS
        </a>
      </div>

      <div className="w-full max-w-md mx-auto text-black border-4 border-black bg-white rounded-lg px-8 pt-6 pb-10 mt-6 shadow-md">
        <h2 className="font-bold text-3xl mb-4">HOW IT WORKS:</h2>

        <div className="flex items-center gap-5 mb-3">
          <span className="bg-[#ff4783] border-2 border-black px-3 py-2 font-bold rounded text-white text-lg mr-3">
            1
          </span>
          <span className="text-lg font-semibold">ENTER YOUR TOPIC</span>
        </div>

        <div className="flex items-center gap-5 mb-3">
          <span className="bg-[#23ff91] border-2 border-black px-3 py-2 font-bold rounded text-black text-lg mr-3">
            2
          </span>
          <span className="text-lg font-semibold">AI GENERATES DATA</span>
        </div>

        <div className="flex items-center gap-5">
          <span className="bg-[#44cdff] border-2 border-black px-3 py-2 font-bold rounded text-black text-lg mr-3">
            3
          </span>
          <span className="text-lg font-semibold">CRICKET INSIGHTS DELIVERED</span>
        </div>
      </div>
    </div>
  );
}
