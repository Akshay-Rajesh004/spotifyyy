import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Player from './Player';
import SpotifyPlayer from './SpotifyPlayer';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Library from '../pages/Library';
import Playlist from '../pages/Playlist';
import LikedSongs from '../pages/LikedSongs';
import CreatePlaylist from '../pages/CreatePlaylist';
import LoadingScreen from './LoadingScreen';
import PremiumRequired from './PremiumRequired';

const MainApp: React.FC = () => {
  const { isAuthenticated, isPremium, isLoading, user } = useSpotifyAuth();
  const { error: playerError } = useSpotifyPlayer();

  // Redirect to login if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" replace />;
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show premium required screen for free users
  if (!isPremium) {
    return <PremiumRequired />;
  }

  return (
    <div className="h-screen bg-spotify-gray text-white flex flex-col">
      {/* Spotify Web Playback SDK Player */}
      <SpotifyPlayer />
      
      {/* Player Error Display */}
      {playerError && (
        <div className="bg-red-600 text-white p-2 text-center text-sm">
          {playerError}
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-darkGray to-spotify-gray">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<Playlist />} />
              <Route path="/liked" element={<LikedSongs />} />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
            </Routes>
          </main>
        </div>
      </div>
      
      {/* Player */}
      <Player />
    </div>
  );
};

export default MainApp;