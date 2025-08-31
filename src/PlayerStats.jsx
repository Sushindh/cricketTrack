// PlayerStats.jsx
import React from "react";
import Navbar from "./Navbar";
const players = [
  {
    name: "Virat Kohli",
    runs: 12502,
    avg: 54.2,
    matches: 257,
    sr: 87.2,
    highlight: "Recent: 78, 102, 33",
  },
  {
    name: "Joe Root",
    runs: 11200,
    avg: 52.1,
    matches: 234,
    sr: 84.4,
    highlight: "Recent: 50, 77, 99",
  },
  {
    name: "Rashid Khan",
    runs: 1586,
    avg: 21.3,
    matches: 110,
    sr: 105.7,
    highlight: "Recent: 3-22, 5-18",
  },
  {
    name: "Jasprit Bumrah",
    runs: 138,
    avg: 4.4,
    matches: 108,
    sr: 58.2,
    highlight: "Recent: 4-35, 2-42",
  },
  {
    name: "Rohit Sharma",
    runs: 9784,
    avg: 49.8,
    matches: 180,
    sr: 89.5,
    highlight: "Recent: 121, 67, 95",
  },
];

export default function PlayerStats() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
        <Navbar />
              <div className="p-1" ></div>
      <h1 className="text-5xl font-extrabold mb-5 text-black">PLAYER STATS</h1>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {players.map((player, idx) => (
          <div key={idx} className="bg-white border-4 border-black rounded-xl p-7 shadow-lg flex flex-col gap-2 hover:scale-105 transition">
            <div className="font-bold text-xl text-black mb-1">{player.name}</div>
            <div className="flex gap-2 text-black">
              <span className="bg-[#44cdff] border-2 border-black px-3 rounded font-bold">Runs: {player.runs}</span>
              <span className="bg-[#ff4783] border-2 border-black px-3 rounded">Avg: {player.avg}</span>
            </div>
            <div className="flex gap-2 text-black">
              <span className="bg-[#23ff91] border-2 border-black px-3 rounded">Matches: {player.matches}</span>
              <span className="bg-[#fff24f] border-2 border-black px-3 rounded">SR: {player.sr}</span>
            </div>
            <div className="mt-1 font-mono text-black">{player.highlight}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
