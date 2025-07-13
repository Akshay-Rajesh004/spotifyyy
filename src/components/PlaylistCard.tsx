import React from 'react';
import { Play } from 'lucide-react';
import { Playlist } from '../types';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();
  const { setQueue, setCurrentSong } = usePlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.songs.length > 0) {
      setQueue(playlist.songs);
      setCurrentSong(playlist.songs[0]);
    }
  };

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-spotify-lightGray rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
    >
      <div className="relative mb-4">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 bg-spotify-green rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-105"
        >
          <Play className="w-5 h-5 text-black fill-current ml-0.5" />
        </button>
      </div>
      <h3 className="text-white font-semibold mb-1 truncate">{playlist.name}</h3>
      <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
