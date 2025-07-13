import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import { mockPlaylists } from '../utils/mockData';

const Sidebar: React.FC = () => {
  const mainNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' }
  ];

  const libraryItems = [
    { icon: Plus, label: 'Create Playlist', path: '/create-playlist' },
    { icon: Heart, label: 'Liked Songs', path: '/liked' }
  ];

  return (
    <div className="w-64 bg-spotify-black h-full flex flex-col text-gray-300">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Music className="w-8 h-8 text-spotify-green" />
          <span className="text-white text-xl font-bold">Spotify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-2">
        <ul className="space-y-2">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-4 px-4 py-2 rounded-lg hover:text-white transition-colors ${
                    isActive ? 'text-white bg-spotify-lightGray' : ''
                  }`
                }
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 px-2">
        <ul className="space-y-2">
          {libraryItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="flex items-center space-x-4 px-4 py-2 rounded-lg hover:text-white transition-colors"
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Playlists */}
      <div className="mt-6 flex-1 overflow-y-auto px-2">
        <div className="space-y-2">
          {mockPlaylists.slice(0, 10).map((playlist) => (
            <NavLink
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="block px-4 py-2 text-sm hover:text-white transition-colors truncate"
            >
              {playlist.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
