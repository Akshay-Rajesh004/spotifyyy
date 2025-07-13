import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import SongCard from '../components/SongCard';
import { mockPlaylists } from '../utils/mockData';
import { usePlayer } from '../context/PlayerContext';

const Playlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setQueue, setCurrentSong } = usePlayer();
  
  const playlist = mockPlaylists.find(p => p.id === id);

  if (!playlist) {
    return <div className="p-8 text-white">Playlist not found</div>;
  }

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      setQueue(playlist.songs);
      setCurrentSong(playlist.songs[0]);
    }
  };

  return (
    <div className="pb-32">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-purple-600 to-spotify-darkGray p-8">
        <div className="flex items-end space-x-6">
          <img
            src={playlist.image}
            alt={playlist.name}
            className="w-60 h-60 shadow-2xl rounded-lg"
          />
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-white text-5xl font-bold mb-4">{playlist.name}</h1>
            <p className="text-gray-300 text-lg mb-4">{playlist.description}</p>
            <div className="flex items-center text-gray-300 text-sm">
              <span className="font-medium">{playlist.createdBy}</span>
              <span className="mx-2">•</span>
              <span>{playlist.songs.length} songs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-b from-spotify-darkGray to-spotify-gray px-8 py-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={handlePlayAll}
            className="bg-spotify-green rounded-full p-4 hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6 text-black fill-current ml-0.5" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Heart className="w-8 h-8" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-8">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700">
          <div className="col-span-1">
            <span className="text-gray-400 text-sm">#</span>
          </div>
          <div className="col-span-5">
            <span className="text-gray-400 text-sm">TITLE</span>
          </div>
          <div className="col-span-3">
            <span className="text-gray-400 text-sm">ALBUM</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400 text-sm">DATE ADDED</span>
          </div>
          <div className="col-span-1 text-right">
            <Clock className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        </div>
        
        <div className="pb-4">
          {playlist.songs.map((song, index) => (
            <div key={song.id} className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-spotify-lightGray hover:bg-opacity-50 rounded group">
              <div className="col-span-1">
                <span className="text-gray-400 text-sm group-hover:hidden">{index + 1}</span>
                <Play className="w-4 h-4 text-white hidden group-hover:block cursor-pointer" />
              </div>
              <div className="col-span-5">
                <SongCard song={song} showImage={true} />
              </div>
              <div className="col-span-3">
                <span className="text-gray-400 text-sm truncate">{song.album}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 text-sm">Jan 15, 2024</span>
              </div>
              <div className="col-span-1 text-right">
                <span className="text-gray-400 text-sm">{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
