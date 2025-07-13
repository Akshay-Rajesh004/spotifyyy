import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import PlaylistCard from '../components/PlaylistCard';
import SongCard from '../components/SongCard';
import { mockPlaylists, mockSongs, mockArtists } from '../utils/mockData';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({
    songs: mockSongs.slice(0, 6),
    playlists: mockPlaylists.slice(0, 6),
    artists: mockArtists.slice(0, 6)
  });

  const browseCategories = [
    { name: 'Pop', color: 'bg-pink-500', image: 'https://picsum.photos/300/300?random=1' },
    { name: 'Rock', color: 'bg-red-500', image: 'https://picsum.photos/300/300?random=2' },
    { name: 'Hip-Hop', color: 'bg-purple-500', image: 'https://picsum.photos/300/300?random=3' },
    { name: 'Jazz', color: 'bg-blue-500', image: 'https://picsum.photos/300/300?random=4' },
    { name: 'Electronic', color: 'bg-green-500', image: 'https://picsum.photos/300/300?random=5' },
    { name: 'Country', color: 'bg-yellow-500', image: 'https://picsum.photos/300/300?random=6' }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Filter mock data based on search query
      const filteredSongs = mockSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase())
      );
      const filteredPlaylists = mockPlaylists.filter(playlist =>
        playlist.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredArtists = mockArtists.filter(artist =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        songs: filteredSongs.slice(0, 10),
        playlists: filteredPlaylists.slice(0, 6),
        artists: filteredArtists.slice(0, 6)
      });
    }
  };

  return (
    <div className="p-8 pb-32">
      {/* Search Input */}
      <div className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-white rounded-full py-4 pl-14 pr-6 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green"
        />
      </div>

      {searchQuery ? (
        /* Search Results */
        <div>
          {/* Top Result */}
          {searchResults.songs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Top result</h2>
              <div className="bg-spotify-lightGray rounded-lg p-6 max-w-md">
                <img
                  src={searchResults.songs[0].image}
                  alt={searchResults.songs[0].title}
                  className="w-24 h-24 rounded-lg mb-4"
                />
                <h3 className="text-white text-2xl font-bold mb-2">{searchResults.songs[0].title}</h3>
                <p className="text-gray-400">{searchResults.songs[0].artist}</p>
                <span className="inline-block mt-2 bg-spotify-black px-3 py-1 rounded-full text-xs text-white">
                  SONG
                </span>
              </div>
            </section>
          )}

          {/* Songs */}
          {searchResults.songs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
              <div className="space-y-2">
                {searchResults.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}

          {/* Artists */}
          {searchResults.artists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {searchResults.artists.map((artist) => (
                  <div key={artist.id} className="text-center group cursor-pointer">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-full mb-4 group-hover:shadow-lg transition-shadow"
                    />
                    <h3 className="text-white font-semibold mb-1">{artist.name}</h3>
                    <p className="text-gray-400 text-sm">Artist</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Playlists */}
          {searchResults.playlists.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Playlists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Browse Categories */
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {browseCategories.map((category) => (
              <div
                key={category.name}
                className={`${category.color} rounded-lg p-6 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
              >
                <h3 className="text-white text-xl font-bold mb-4">{category.name}</h3>
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute -bottom-4 -right-4 w-20 h-20 rounded-lg transform rotate-12"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
