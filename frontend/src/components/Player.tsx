import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Heart, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';

const Player: React.FC = () => {
  const { currentSong } = usePlayer();
  const { 
    playerState, 
    isReady, 
    playTrack, 
    pauseTrack, 
    skipToNext, 
    skipToPrevious,
    seek,
    setVolume 
  } = useSpotifyPlayer();
  
  const [volume, setVolumeLocal] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Update progress from Spotify player state
  useEffect(() => {
    if (playerState?.progress_ms && playerState?.track?.duration_ms) {
      setProgress((playerState.progress_ms / playerState.track.duration_ms) * 100);
    }
  }, [playerState]);

  // Format time in mm:ss
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (playerState?.is_playing) {
      pauseTrack();
    } else if (playerState?.track) {
      // Resume current track
      playTrack(playerState.track.uri, playerState?.progress_ms || 0);
    } else if (currentSong?.audioUrl) {
      // Play from old context if available
      playTrack(currentSong.audioUrl);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (playerState?.track?.duration_ms) {
      const newProgress = parseFloat(e.target.value);
      const newPositionMs = (newProgress / 100) * playerState.track.duration_ms;
      seek(newPositionMs);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeLocal(newVolume);
    setVolume(newVolume / 100);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(volume / 100);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  // Use Spotify player state if available, otherwise fall back to local state
  const displayTrack = playerState?.track || currentSong;
  const isPlaying = playerState?.is_playing || false;

  if (!displayTrack) return null;

  const trackImage = playerState?.track?.album?.images?.[0]?.url || displayTrack.image;
  const trackTitle = playerState?.track?.name || displayTrack.title;
  const trackArtist = playerState?.track?.artists?.[0]?.name || displayTrack.artist;
  const trackDuration = playerState?.track?.duration_ms || 
    (displayTrack.duration ? parseInt(displayTrack.duration.split(':')[0]) * 60000 + parseInt(displayTrack.duration.split(':')[1]) * 1000 : 0);

  return (
    <div className="bg-spotify-lightGray border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={trackImage}
            alt={trackTitle}
            className="w-14 h-14 rounded"
          />
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{trackTitle}</p>
            <p className="text-gray-400 text-xs truncate">{trackArtist}</p>
          </div>
          <button className="text-gray-400 hover:text-spotify-green transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={skipToPrevious}
              disabled={!isReady}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              disabled={!isReady && !currentSong}
              className="bg-white rounded-full p-2 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black" />
              ) : (
                <Play className="w-4 h-4 text-black ml-0.5" />
              )}
            </button>
            <button
              onClick={skipToNext}
              disabled={!isReady}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">
              {formatTime(playerState?.progress_ms || 0)}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #fff 0%, #fff ${progress}%, #666 ${progress}%, #666 100%)`
                }}
              />
            </div>
            <span className="text-xs text-gray-400">
              {formatTime(trackDuration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="w-24 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #fff 0%, #fff ${isMuted ? 0 : volume}%, #666 ${isMuted ? 0 : volume}%, #666 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
