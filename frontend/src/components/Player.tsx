import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Player: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    togglePlayPause,
    nextSong,
    previousSong,
    setVolume
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="bg-spotify-lightGray border-t border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-14 h-14 rounded"
          />
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
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
              onClick={previousSong}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayPause}
              className="bg-white rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black" />
              ) : (
                <Play className="w-4 h-4 text-black ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">1:23</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1">
              <div className="bg-white rounded-full h-1 w-1/3"></div>
            </div>
            <span className="text-xs text-gray-400">{currentSong.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="w-24 bg-gray-600 rounded-full h-1">
            <div 
              className="bg-white rounded-full h-1 transition-all"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
