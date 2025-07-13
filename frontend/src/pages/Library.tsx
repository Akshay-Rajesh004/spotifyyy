import React, { useState } from 'react';
import { Search, Grid3X3, List, Filter } from 'lucide-react';
import PlaylistCard from '../components/PlaylistCard';
import { mockPlaylists, mockAlbums, mockArtists } from '../utils/mockData';

const Library: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'playlists' | 'artists' | 'albums'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterItems = () => {
    let items: any[] = [];
    
    switch (filter) {
      case 'playlists':
        items = mockPlaylists.map(p => ({ ...p, type: 'playlist' }));
        break;
      case 'artists':
        items = mockArtists.map(a => ({ ...a, type: 'artist' }));
        break;
      case 'albums':
        items = mockAlbums.map(a => ({ ...a, type: 'album' }));
        break;
      default:
        items = [
          ...mockPlaylists.slice(0, 10).map(p => ({ ...p, type: 'playlist' })),
          ...mockArtists.slice(0, 5).map(a => ({ ...a, type: 'artist' })),
          ...mockAlbums.slice(0, 5).map(a => ({ ...a, type: 'album' }))
        ];
    }

    if (searchQuery) {
      items = items.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  };

  const filteredItems = filterItems();

  return (
    <div className="p-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search in Your Library"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-spotify-lightGray rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-spotify-lightGray text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green"
          >
            <option value="all">All</option>
            <option value="playlists">Playlists</option>
            <option value="artists">Artists</option>
            <option value="albums">Albums</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => {
            if (item.type === 'playlist') {
              return <PlaylistCard key={item.id} playlist={item} />;
            }
            
            if (item.type === 'artist') {
              return (
                <div key={item.id} className="text-center group cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover rounded-full mb-4 group-hover:shadow-lg transition-shadow"
                  />
                  <h3 className="text-white font-semibold mb-1 truncate">{item.name}</h3>
                  <p className="text-gray-400 text-sm">Artist</p>
                </div>
              );
            }
            
            if (item.type === 'album') {
              return (
                <div key={item.id} className="bg-spotify-lightGray rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-white font-semibold mb-1 truncate">{item.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{item.year} • {item.artist}</p>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-spotify-lightGray hover:bg-opacity-50 transition-colors">
              <img
                src={item.image}
                alt={item.name || item.title}
                className={`w-12 h-12 object-cover ${item.type === 'artist' ? 'rounded-full' : 'rounded'}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{item.name || item.title}</p>
                <p className="text-gray-400 text-sm truncate">
                  {item.type === 'playlist' && `Playlist • ${item.createdBy}`}
                  {item.type === 'artist' && 'Artist'}
                  {item.type === 'album' && `Album • ${item.artist} • ${item.year}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
