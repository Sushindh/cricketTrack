// Personalization.jsx
import React from "react";
import Navbar from "./Navbar";
const favorites = [
  { type: "Team", name: "India", nextMatch: "vs NZ, 2025-09-08" },
  { type: "Player", name: "Joe Root", nextMatch: "vs Ind, 2025-09-10" },
  { type: "Team", name: "Australia", nextMatch: "vs Pak, 2025-09-09" },
  { type: "Player", name: "Rashid Khan", nextMatch: "vs SL, 2025-09-11" },
  { type: "Player", name: "Rohit Sharma", nextMatch: "vs NZ, 2025-09-08" },
];

export default function Personalization() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
        <Navbar />
              <div className="p-1" ></div>
      <h1 className="text-5xl font-extrabold mb-6 text-black">YOUR FAVORITES</h1>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav, idx) => (
          <div key={idx} className="bg-[#fffbe5] border-4 border-black rounded-xl shadow-lg p-5 flex flex-col gap-2">
            <div className="font-bold text-lg text-black">{fav.type}: <span className="text-[#ff4783]">{fav.name}</span></div>
            <div className="bg-[#23ff91] border-2 border-black px-3 py-1 rounded font-mono w-fit text-black">Next: {fav.nextMatch}</div>
            <button className="mt-2 bg-[#fff24f] border-4 border-black rounded px-4 py-2 font-bold text-black">
              Set Notification
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
