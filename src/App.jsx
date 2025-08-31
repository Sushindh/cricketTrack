// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import LiveMatches from "./LiveMatches";
import PlayerStats from "./PlayerStats";
import MatchSchedule from "./MatchSchedule";
import AiPredictions from "./AiPredictions";
import DetailedMatchReview from "./DetailedMatchReview";
import Personalization from "./Personalization";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live-matches" element={<LiveMatches />} />
        <Route path="/player-stats" element={<PlayerStats />} />
        <Route path="/match-schedule" element={<MatchSchedule />} />
        <Route path="/ai-predictions" element={<AiPredictions />} />
        <Route path="/matches/:id" element={<DetailedMatchReview />} />
        <Route path="/personalization" element={<Personalization />} />
        {/* Add 404 or other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
