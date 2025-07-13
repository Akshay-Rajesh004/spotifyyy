import React from 'react';
import { Play, Heart } from 'lucide-react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  uri: string;
  preview_url: string | null;
}

interface SpotifyTrackCardProps {
  track: SpotifyTrack;
  onPlay: (track: SpotifyTrack) => void;
  showImage?: boolean;
}

const SpotifyTrackCard: React.FC<SpotifyTrackCardProps> = ({ track, onPlay, showImage = true }) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    onPlay(track);
  };

  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-spotify-lightGray hover:bg-opacity-50 transition-colors group">
      {showImage && (
        <div className="relative">
          <img
            src={track.album.images[2]?.url || track.album.images[0]?.url || 'https://via.placeholder.com/64'}
            alt={track.name}
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
        <p className="text-white text-sm font-medium truncate">
          {track.name}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {track.artists.map(artist => artist.name).join(', ')}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
          <Heart className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-400">{formatDuration(track.duration_ms)}</span>
      </div>
    </div>
  );
};

export default SpotifyTrackCard;