import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto mb-12 px-6 py-3 flex justify-center gap-6 bg-[#fffbe5] border-4 border-black rounded-lg shadow-lg">
      <a
        href="/"
        className="bg-[#44cdff] text-black font-bold border-4 border-black rounded-lg px-5 py-2 hover:scale-105 transition flex items-center gap-2"
      >
        🏠 Home
      </a>
      <a
        href="/live-matches"
        className="bg-[#23ff91] text-black font-bold border-4 border-black rounded-lg px-5 py-2 hover:scale-105 transition flex items-center gap-2"
      >
        🏆 Live Matches
      </a>
      <a
        href="/player-stats"
        className="bg-[#ff4783] text-black font-bold border-4 border-black rounded-lg px-5 py-2 hover:scale-105 transition flex items-center gap-2"
      >
        👥 Player Stats
      </a>
      <a
        href="/match-schedule"
        className="bg-[#44cdff] text-black font-bold border-4 border-black rounded-lg px-5 py-2 hover:scale-105 transition flex items-center gap-2"
      >
        📅 Match Schedule
      </a>
      <a
        href="/ai-predictions"
        className="bg-[#fff24f] text-black font-bold border-4 border-black rounded-lg px-5 py-2 hover:scale-105 transition flex items-center gap-2"
      >
        ⚡ AI Predictions
      </a>
      <a
        href="/personalization"
        className="bg-[#ff4783] text-black font-bold border-4 border-black rounded-lg px-5 py-2 hover:scale-105 transition flex items-center gap-2"
      >
        ⭐ Favorites
      </a>
    </nav>
  );
}
