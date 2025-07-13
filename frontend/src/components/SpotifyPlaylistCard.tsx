import React from 'react';
import { Play } from 'lucide-react';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
  uri: string;
}

interface SpotifyPlaylistCardProps {
  playlist: SpotifyPlaylist;
}

const SpotifyPlaylistCard: React.FC<SpotifyPlaylistCardProps> = ({ playlist }) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement playlist playback
    console.log('Playing playlist:', playlist.name);
  };

  return (
    <div className="bg-spotify-lightGray rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group">
      <div className="relative mb-4">
        <img
          src={playlist.images[0]?.url || 'https://via.placeholder.com/300'}
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
      <p className="text-gray-400 text-sm truncate">
        By {playlist.owner.display_name} • {playlist.tracks.total} songs
      </p>
    </div>
  );
};

export default SpotifyPlaylistCard;