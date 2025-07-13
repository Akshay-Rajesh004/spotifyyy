import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';
import { Music, Play } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login, isLoading } = useSpotifyAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-darkGray flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-16 h-16 text-spotify-green mr-3" />
            <h1 className="text-5xl font-bold text-white">Spotify</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Connect your Spotify account to start listening
          </p>
        </div>

        <div className="bg-spotify-lightGray rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Welcome to Spotify Clone
            </h2>
            <p className="text-gray-400">
              Sign in with your Spotify Premium account to enjoy full music playback
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-300">
              <Play className="w-4 h-4 text-spotify-green mr-3" />
              <span>Full music playback with Spotify Premium</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Music className="w-4 h-4 text-spotify-green mr-3" />
              <span>Access to your Spotify library</span>
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Music className="w-4 h-4 text-spotify-green mr-3" />
              <span>Real-time search and discovery</span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-spotify-green hover:bg-green-500 text-black font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Music className="w-5 h-5" />
                <span>Connect with Spotify</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              You'll be redirected to Spotify to authorize this application.
              <br />
              A Spotify Premium subscription is required for music playback.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have Spotify Premium?{' '}
            <a
              href="https://www.spotify.com/premium/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-spotify-green hover:underline"
            >
              Upgrade here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;