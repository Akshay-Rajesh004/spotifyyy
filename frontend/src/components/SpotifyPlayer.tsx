import React, { useEffect } from 'react';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';

// This component handles the invisible Spotify Web Playback SDK player
// The actual UI controls are in the Player component
const SpotifyPlayer: React.FC = () => {
  const { isReady, error, deviceId } = useSpotifyPlayer();

  useEffect(() => {
    if (isReady && deviceId) {
      console.log('Spotify Player is ready with device ID:', deviceId);
    }
  }, [isReady, deviceId]);

  // This component doesn't render anything visible - it just manages the SDK
  return null;
};

export default SpotifyPlayer;