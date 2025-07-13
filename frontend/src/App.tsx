import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { SpotifyAuthProvider } from './context/SpotifyAuthContext';
import { SpotifyPlayerProvider } from './context/SpotifyPlayerContext';
import LoginScreen from './components/LoginScreen';
import MainApp from './components/MainApp';

function App() {
  return (
    <SpotifyAuthProvider>
      <PlayerProvider>
        <SpotifyPlayerProvider>
          <Router>
            <div className="h-screen bg-spotify-gray text-white">
              <Routes>
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/*" element={<MainApp />} />
              </Routes>
            </div>
          </Router>
        </SpotifyPlayerProvider>
      </PlayerProvider>
    </SpotifyAuthProvider>
  );
}

export default App;
