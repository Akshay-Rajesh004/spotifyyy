import React from 'react';
import { Play, Heart, MoreHorizontal, Clock, Download } from 'lucide-react';
import SongCard from '../components/SongCard';
import { mockSongs } from '../utils/mockData';
import { usePlayer } from '../context/PlayerContext';

const LikedSongs: React.FC = () => {
  const { setQueue, setCurrentSong } = usePlayer();
  
  // Use first 30 songs as "liked" songs
  const likedSongs = mockSongs.slice(0, 30);

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setQueue(likedSongs);
      setCurrentSong(likedSongs[0]);
    }
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-700 to-spotify-darkGray p-8">
        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center shadow-2xl">
            <Heart className="w-24 h-24 text-white fill-current" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-white text-5xl font-bold mb-4">Liked Songs</h1>
            <div className="flex items-center text-gray-300 text-sm">
              <span className="font-medium">You</span>
              <span className="mx-2">•</span>
              <span>{likedSongs.length} songs</span>
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
            <Download className="w-8 h-8" />
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
          {likedSongs.map((song, index) => (
            <div key={song.id} className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-spotify-lightGray hover:bg-opacity-50 rounded group">
              <div className="col-span-1">
                <span className="text-gray-400 text-sm group-hover:hidden">{index + 1}</span>
                <Play className="w-4 h-4 text-white hidden group-hover:block cursor-pointer" 
                      onClick={() => setCurrentSong(song)} />
              </div>
              <div className="col-span-5">
                <div className="flex items-center space-x-4">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-10 h-10 rounded"
                  />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{song.title}</p>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-3">
                <span className="text-gray-400 text-sm truncate">{song.album}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400 text-sm">
                  {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="col-span-1 text-right flex items-center justify-end space-x-2">
                <Heart className="w-4 h-4 text-spotify-green fill-current opacity-0 group-hover:opacity-100" />
                <span className="text-gray-400 text-sm">{song.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
