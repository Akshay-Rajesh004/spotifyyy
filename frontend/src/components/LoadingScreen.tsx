import React from 'react';
import { Music } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-darkGray flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Music className="w-16 h-16 text-spotify-green animate-pulse" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Loading Spotify Clone
        </h2>
        <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 mt-4">
          Connecting to your Spotify account...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;