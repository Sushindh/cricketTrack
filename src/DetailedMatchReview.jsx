// DetailedMatchReview.jsx
import React from "react";
import Navbar from "./Navbar";
const matchDetails = {
  teams: "India vs Australia",
  score: "167/3 (18.4)",
  venue: "Delhi",
  highlights: [
    "Rohit Sharma: 78* (55)",
    "Maxwell: 2-22 in 4",
    "18th Over: 20 runs",
    "4th Wicket: 100-run partnership",
    "Kohli: 45 (29)",
  ],
  commentary: [
    "18.4: FOUR! Rohit pulls to deep mid-wicket.",
    "18.3: Single to long on.",
    "18.2: SIX! Kohli clears deep cover.",
    "18.1: Dot ball.",
    "17.6: Run out missed at keeper's end.",
  ],
};

export default function DetailedMatchReview() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
        <Navbar />
              <div className="p-1" ></div>
      <h1 className="text-4xl font-extrabold mb-4 text-black">{matchDetails.teams}</h1>
      <div className="bg-[#fffbe5] border-4 border-black rounded-xl p-6 mb-7 flex flex-col md:flex-row gap-7">
        <div className="flex-1">
          <div className="font-bold text-2xl text-black mb-2">Live Score: <span className="bg-[#44cdff] border-2 border-black px-3 rounded font-mono">{matchDetails.score}</span></div>
          <div className="text-black font-bold mb-2"><span className="bg-[#23ff91] border-2 border-black px-2 rounded">Venue: {matchDetails.venue}</span></div>
          <div className="mb-2">
            <div className="font-bold text-black mb-1">Highlights:</div>
            {matchDetails.highlights.map((item, idx) =>
              <div key={idx} className="bg-[#fff24f] border-2 border-black rounded px-3 py-1 my-1 text-black">{item}</div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold text-black mb-2">Live Commentary</div>
          <div className="bg-white border-4 border-black rounded-lg px-4 py-3 min-h-[180px]">
            {matchDetails.commentary.map((line, idx) =>
              <div key={idx} className="text-black mb-1">• {line}</div>
            )}
          </div>
        </div>
      </div>
      <a href="/live-matches" className="bg-[#16a6fe] border-4 border-black rounded px-6 py-3 font-bold text-black shadow hover:scale-105 transition">
        ← Back to Live Matches
      </a>
    </div>
  );
}
