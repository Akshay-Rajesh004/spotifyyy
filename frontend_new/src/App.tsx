import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import LikedSongs from './pages/LikedSongs';
import CreatePlaylist from './pages/CreatePlaylist';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="h-screen bg-spotify-gray text-white flex flex-col">
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
      </Router>
    </PlayerProvider>
  );
}

export default App;
