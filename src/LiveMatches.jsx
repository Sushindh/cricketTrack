// LiveMatches.jsx
import React from "react";
import Navbar from "./Navbar";
const matches = [
  {
    teams: "India vs Australia",
    status: "LIVE",
    score: "167/3 (18.4)",
    venue: "Delhi",
    overs: "18.4",
    highlight: "Rohit 78*",
  },
  {
    teams: "England vs Pakistan",
    status: "LIVE",
    score: "123/7 (16)",
    venue: "Lords",
    overs: "16.0",
    highlight: "Shaheen 4-22",
  },
  {
    teams: "SA vs NZ",
    status: "LIVE",
    score: "140/2 (15)",
    venue: "Cape Town",
    overs: "15.0",
    highlight: "De Kock 55",
  },
  {
    teams: "Bangladesh vs SL",
    status: "LIVE",
    score: "112/4 (14)",
    venue: "Dhaka",
    overs: "14.0",
    highlight: "Kusal 39",
  },
  {
    teams: "West Indies vs Afghanistan",
    status: "LIVE",
    score: "98/5 (11.5)",
    venue: "Bridgetown",
    overs: "11.5",
    highlight: "Hetmyer 24*",
  },
];

export default function LiveMatches() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
        <Navbar />
              <div className="p-1" ></div>
      <h1 className="text-5xl font-extrabold mb-6 text-black">LIVE MATCHES</h1>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, idx) => (
          <div key={idx} className="bg-[#fffbe5] border-4 border-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:scale-105 transition">
            <div className="font-bold text-2xl mb-1 text-black">{match.teams}</div>
            <div className="flex gap-2 text-black">
              <span className="bg-[#23ff91] border-2 border-black px-3 rounded font-bold">{match.status}</span>
              <span className="bg-[#44cdff] border-2 border-black px-3 rounded font-mono ml-2">{match.score}</span>
              <span className="bg-[#fff24f] border-2 border-black px-2 rounded font-mono ml-2">{match.overs} overs</span>
            </div>
            <div className="text-black mt-1">
              <span className="font-bold">Venue:</span> {match.venue}
            </div>
            <div className="mt-1 text-[#ff4783] font-bold">{match.highlight}</div>
            <a href={`/matches/${idx}`} className="mt-3 bg-[#16a6fe] text-black border-4 border-black rounded px-4 py-2 font-bold w-fit hover:scale-105 transition">
              Detailed Review →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
