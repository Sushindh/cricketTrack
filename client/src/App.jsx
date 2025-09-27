import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LiveMatches from './pages/LiveMatches';
import PlayerStats from './pages/PlayerStats';
import MatchSchedule from './pages/MatchSchedule';
import AIPredictions from './pages/AIPredictions';
import Favorites from './pages/Favorites';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/live-matches" element={<LiveMatches />} />
            <Route path="/player-stats" element={<PlayerStats />} />
            <Route path="/match-schedule" element={<MatchSchedule />} />
            <Route path="/ai-predictions" element={<AIPredictions />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
