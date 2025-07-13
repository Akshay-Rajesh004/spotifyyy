import React from 'react';
import { Play, Heart } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface SongCardProps {
  song: Song;
  showImage?: boolean;
}

const SongCard: React.FC<SongCardProps> = ({ song, showImage = true }) => {
  const { setCurrentSong, currentSong, isPlaying } = usePlayer();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
    setCurrentSong(song);
  };

  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-spotify-lightGray hover:bg-opacity-50 transition-colors group">
      {showImage && (
        <div className="relative">
          <img
            src={song.image}
            alt={song.title}
            className="w-12 h-12 rounded"
          />
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentSong ? 'text-spotify-green' : 'text-white'}`}>
          {song.title}
        </p>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
          <Heart className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-400">{song.duration}</span>
      </div>
    </div>
  );
};

export default SongCard;
