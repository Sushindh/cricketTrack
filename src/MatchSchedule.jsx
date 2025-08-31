// MatchSchedule.jsx
import React from "react";
import Navbar from "./Navbar";
const schedule = [
  { date: "2025-09-01", teams: "India vs England", venue: "Mumbai", time: "19:00" },
  { date: "2025-09-02", teams: "Australia vs Pakistan", venue: "Sydney", time: "14:00" },
  { date: "2025-09-02", teams: "Bangladesh vs SA", venue: "Dhaka", time: "15:00" },
  { date: "2025-09-03", teams: "Sri Lanka vs NZ", venue: "Colombo", time: "13:30" },
  { date: "2025-09-03", teams: "WI vs Afghanistan", venue: "Barbados", time: "17:00" },
];

export default function MatchSchedule() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] px-4 py-10 font-mono">
        <Navbar />
              <div className="p-1" ></div>
      <h1 className="text-5xl font-extrabold mb-6 text-black">MATCH SCHEDULE</h1>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {schedule.map((match, idx) => (
          <div key={idx} className="bg-[#fffbe5] border-4 border-black rounded-xl shadow-lg p-5 flex flex-col gap-2 hover:scale-105 transition">
            <div className="font-bold text-lg text-black">{match.teams}</div>
            <div className="flex gap-2 text-black">
              <span className="bg-[#44cdff] border-2 border-black px-3 rounded font-mono">{match.date}</span>
              <span className="bg-[#ff4783] border-2 border-black px-3 rounded font-mono">{match.time}</span>
              <span className="bg-[#23ff91] border-2 border-black px-3 rounded font-mono">{match.venue}</span>
            </div>
            <button className="mt-2 bg-[#fff24f] border-4 border-black text-black font-bold rounded px-4 py-2 hover:scale-105 transition">
              Add to Calendar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
