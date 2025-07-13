import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSpotifyAuth } from './SpotifyAuthContext';
import axios from 'axios';

interface SpotifyPlayerState {
  is_playing: boolean;
  track?: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
    duration_ms: number;
    uri: string;
  };
  progress_ms: number;
  device?: {
    id: string;
    name: string;
    type: string;
  };
}

interface SpotifyPlayerContextType {
  player: any;
  deviceId: string | null;
  playerState: SpotifyPlayerState | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  playTrack: (trackUri: string, positionMs?: number) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType | undefined>(undefined);

export const useSpotifyPlayer = () => {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error('useSpotifyPlayer must be used within a SpotifyPlayerProvider');
  }
  return context;
};

interface SpotifyPlayerProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const SpotifyPlayerProvider: React.FC<SpotifyPlayerProviderProps> = ({ children }) => {
  const { accessToken, isPremium, isAuthenticated } = useSpotifyAuth();
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!isAuthenticated || !accessToken || !isPremium) {
      return;
    }

    const initializePlayer = () => {
      // Load Spotify Web Playback SDK if not already loaded
      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
          createPlayer();
        };
      } else {
        createPlayer();
      }
    };

    const createPlayer = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify Clone Web Player',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }: any) => {
        setError(`Initialization error: ${message}`);
        console.error('Initialization error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }: any) => {
        setError(`Authentication error: ${message}`);
        console.error('Authentication error:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }: any) => {
        setError(`Account error: ${message}`);
        console.error('Account error:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }: any) => {
        setError(`Playback error: ${message}`);
        console.error('Playback error:', message);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', (state: any) => {
        if (!state) return;

        setPlayerState({
          is_playing: !state.paused,
          track: state.track_window.current_track ? {
            id: state.track_window.current_track.id,
            name: state.track_window.current_track.name,
            artists: state.track_window.current_track.artists,
            album: state.track_window.current_track.album,
            duration_ms: state.track_window.current_track.duration_ms,
            uri: state.track_window.current_track.uri
          } : undefined,
          progress_ms: state.position,
          device: state.device ? {
            id: state.device.device_id,
            name: state.device.name,
            type: state.device.type
          } : undefined
        });
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
        setError(null);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      // Connect to the player
      spotifyPlayer.connect().then((success: boolean) => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        } else {
          setError('Failed to connect to Spotify');
        }
      });

      setPlayer(spotifyPlayer);
    };

    initializePlayer();

    // Cleanup
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, isPremium, isAuthenticated]);

  const playTrack = async (trackUri: string, positionMs: number = 0) => {
    if (!deviceId || !accessToken) {
      setError('Player not ready or not authenticated');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/play`, {
        track_uri: trackUri,
        position_ms: positionMs,
        device_id: deviceId
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setError(null);
    } catch (error: any) {
      console.error('Error playing track:', error);
      setError(error.response?.data?.detail || 'Error playing track');
    }
  };

  const pauseTrack = async () => {
    if (!deviceId || !accessToken) return;

    try {
      await axios.post(`${API_BASE_URL}/api/pause`, {
        device_id: deviceId
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setError(null);
    } catch (error: any) {
      console.error('Error pausing track:', error);
      setError(error.response?.data?.detail || 'Error pausing track');
    }
  };

  const resumeTrack = async () => {
    if (!player) return;

    try {
      await player.resume();
      setError(null);
    } catch (error: any) {
      console.error('Error resuming track:', error);
      setError('Error resuming track');
    }
  };

  const skipToNext = async () => {
    if (!player) return;

    try {
      await player.nextTrack();
      setError(null);
    } catch (error: any) {
      console.error('Error skipping to next track:', error);
      setError('Error skipping to next track');
    }
  };

  const skipToPrevious = async () => {
    if (!player) return;

    try {
      await player.previousTrack();
      setError(null);
    } catch (error: any) {
      console.error('Error skipping to previous track:', error);
      setError('Error skipping to previous track');
    }
  };

  const seek = async (positionMs: number) => {
    if (!player) return;

    try {
      await player.seek(positionMs);
      setError(null);
    } catch (error: any) {
      console.error('Error seeking:', error);
      setError('Error seeking');
    }
  };

  const setVolume = async (volume: number) => {
    if (!player) return;

    try {
      await player.setVolume(volume);
      setError(null);
    } catch (error: any) {
      console.error('Error setting volume:', error);
      setError('Error setting volume');
    }
  };

  const value: SpotifyPlayerContextType = {
    player,
    deviceId,
    playerState,
    isReady,
    isLoading,
    error,
    playTrack,
    pauseTrack,
    resumeTrack,
    skipToNext,
    skipToPrevious,
    seek,
    setVolume
  };

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};