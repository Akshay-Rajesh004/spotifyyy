import React from 'react';
import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import { mockPlaylists, mockSongs } from '../utils/mockData';

const Home: React.FC = () => {
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentlyPlayed = mockSongs.slice(0, 6);
  const madeForYou = mockPlaylists.slice(0, 5);
  const recentlyPlayedPlaylists = mockPlaylists.slice(5, 11);

  return (
    <div className="p-8 pb-32">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-white mb-8">{timeOfDay()}</h1>

      {/* Recently Played Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {recentlyPlayedPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-spotify-lightGray rounded-lg flex items-center hover:bg-gray-600 transition-colors cursor-pointer group"
          >
            <img
              src={playlist.image}
              alt={playlist.name}
              className="w-20 h-20 rounded-l-lg"
            />
            <div className="flex-1 p-4">
              <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity p-4">
              <div className="bg-spotify-green rounded-full p-2">
                <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Played */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recently played</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recentlyPlayed.map((song) => (
            <div key={song.id} className="bg-spotify-lightGray rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group">
              <div className="relative mb-4">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button className="absolute bottom-2 right-2 bg-spotify-green rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-105">
                  <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <h3 className="text-white font-semibold mb-1 truncate">{song.title}</h3>
              <p className="text-gray-400 text-sm truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Made for You */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Made for you</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {madeForYou.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* Popular Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Popular playlists</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {mockPlaylists.slice(11, 16).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
