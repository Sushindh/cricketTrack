import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, PlayIcon, UserGroupIcon, CalendarIcon, 
  LightBulbIcon, StarIcon, Bars3Icon, XMarkIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/home', icon: HomeIcon, color: 'bg-blue-400' },
    { name: 'Live Matches', href: '/live-matches', icon: PlayIcon, color: 'bg-green-400' },
    { name: 'Player Stats', href: '/player-stats', icon: UserGroupIcon, color: 'bg-pink-400' },
    { name: 'Match Schedule', href: '/match-schedule', icon: CalendarIcon, color: 'bg-blue-400' },
    { name: 'AI Predictions', href: '/ai-predictions', icon: LightBulbIcon, color: 'bg-yellow-400' },
    { name: 'Favorites', href: '/favorites', icon: StarIcon, color: 'bg-purple-400' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="bg-gray-100 shadow-lg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <h1 className="text-3xl font-black text-black">CricketTrack</h1>
          
          <div className="hidden md:flex space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border-3 border-black transition-all flex items-center space-x-2 ${
                    isActive(item.href) ? `${item.color} text-black` : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white border-2 border-black"
          >
            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-bold border-2 border-black ${
                    isActive(item.href) ? `${item.color} text-black` : 'bg-white text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
