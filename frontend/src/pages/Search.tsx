import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useSpotifyAuth } from '../context/SpotifyAuthContext';
import { useSpotifyPlayer } from '../context/SpotifyPlayerContext';
import SpotifyTrackCard from '../components/SpotifyTrackCard';
import SpotifyPlaylistCard from '../components/SpotifyPlaylistCard';
import SpotifyArtistCard from '../components/SpotifyArtistCard';
import axios from 'axios';

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

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  uri: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
  uri: string;
}

const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const Search: React.FC = () => {
  const { accessToken } = useSpotifyAuth();
  const { playTrack } = useSpotifyPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    tracks: SpotifyTrack[];
    artists: SpotifyArtist[];
    playlists: SpotifyPlaylist[];
  }>({
    tracks: [],
    artists: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const browseCategories = [
    { name: 'Pop', color: 'bg-pink-500', image: 'https://picsum.photos/300/300?random=1' },
    { name: 'Rock', color: 'bg-red-500', image: 'https://picsum.photos/300/300?random=2' },
    { name: 'Hip-Hop', color: 'bg-purple-500', image: 'https://picsum.photos/300/300?random=3' },
    { name: 'Jazz', color: 'bg-blue-500', image: 'https://picsum.photos/300/300?random=4' },
    { name: 'Electronic', color: 'bg-green-500', image: 'https://picsum.photos/300/300?random=5' },
    { name: 'Country', color: 'bg-yellow-500', image: 'https://picsum.photos/300/300?random=6' }
  ];

  const searchSpotify = async (query: string) => {
    if (!query.trim() || !accessToken) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Search for tracks, artists, and playlists
      const [tracksResponse, artistsResponse, playlistsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&type=artist&limit=6`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&type=playlist&limit=6`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ]);

      setSearchResults({
        tracks: tracksResponse.data.tracks?.items || [],
        artists: artistsResponse.data.artists?.items || [],
        playlists: playlistsResponse.data.playlists?.items || []
      });
    } catch (error: any) {
      console.error('Search error:', error);
      setError(error.response?.data?.detail || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchSpotify(query);
    } else {
      setSearchResults({ tracks: [], artists: [], playlists: [] });
    }
  };

  const handleTrackPlay = (track: SpotifyTrack) => {
    playTrack(track.uri);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName);
    searchSpotify(categoryName);
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Searching Spotify...</p>
        </div>
      )}

      {searchQuery && !isLoading ? (
        /* Search Results */
        <div>
          {/* Top Result */}
          {searchResults.tracks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Top result</h2>
              <div className="bg-spotify-lightGray rounded-lg p-6 max-w-md hover:bg-gray-700 transition-colors cursor-pointer"
                   onClick={() => handleTrackPlay(searchResults.tracks[0])}>
                <img
                  src={searchResults.tracks[0].album.images[0]?.url || 'https://via.placeholder.com/300'}
                  alt={searchResults.tracks[0].name}
                  className="w-24 h-24 rounded-lg mb-4"
                />
                <h3 className="text-white text-2xl font-bold mb-2">{searchResults.tracks[0].name}</h3>
                <p className="text-gray-400">{searchResults.tracks[0].artists.map(a => a.name).join(', ')}</p>
                <span className="inline-block mt-2 bg-spotify-black px-3 py-1 rounded-full text-xs text-white">
                  SONG
                </span>
              </div>
            </section>
          )}

          {/* Songs */}
          {searchResults.tracks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
              <div className="space-y-2">
                {searchResults.tracks.map((track) => (
                  <SpotifyTrackCard key={track.id} track={track} onPlay={handleTrackPlay} />
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
                  <SpotifyArtistCard key={artist.id} artist={artist} />
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
                  <SpotifyPlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {!isLoading && searchResults.tracks.length === 0 && searchResults.artists.length === 0 && searchResults.playlists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for something else</p>
            </div>
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
                onClick={() => handleCategoryClick(category.name)}
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
