import React from 'react';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';
import { Crown, Music, LogOut } from 'lucide-react';

const PremiumRequired: React.FC = () => {
  const { user, logout } = useSpotifyAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-darkGray flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Spotify Premium Required
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome {user?.display_name || 'User'}!
          </p>
        </div>

        <div className="bg-spotify-lightGray rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Upgrade to Premium
            </h2>
            <p className="text-gray-400 mb-6">
              This app requires Spotify Premium to play music using the Web Playback SDK.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-300">
              <Music className="w-4 h-4 text-spotify-green mr-3" />
              <span>High-quality music streaming</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Music className="w-4 h-4 text-spotify-green mr-3" />
              <span>Unlimited skips and offline listening</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Music className="w-4 h-4 text-spotify-green mr-3" />
              <span>No ads and enhanced features</span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="https://www.spotify.com/premium/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-spotify-green hover:bg-green-500 text-black font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 block"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to Premium</span>
            </a>
            
            <button
              onClick={logout}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Already have Premium? Try refreshing the page or signing out and back in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumRequired;