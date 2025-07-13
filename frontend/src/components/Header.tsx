import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Bell, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useSpotifyAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-spotify-darkGray bg-opacity-95 backdrop-blur-sm sticky top-0 z-40 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-spotify-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="bg-spotify-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-80 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-spotify-black bg-opacity-70 rounded-full px-2 py-1 hover:bg-opacity-80 transition-colors"
            >
              {user?.images && user.images.length > 0 ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="bg-gray-600 rounded-full p-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white text-sm font-medium max-w-32 truncate">
                {user?.display_name || 'User'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-spotify-lightGray rounded-lg shadow-xl border border-gray-600 z-50">
                <div className="p-4 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    {user?.images && user.images.length > 0 ? (
                      <img
                        src={user.images[0].url}
                        alt={user.display_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="bg-gray-600 rounded-full p-2">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{user?.display_name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                          Premium
                        </span>
                        <span className="text-gray-400 text-xs">
                          {user?.followers} followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <a
                    href="https://open.spotify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-spotify-black rounded transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Spotify</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-spotify-black rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
