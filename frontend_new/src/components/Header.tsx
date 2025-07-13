import React from 'react';
import { ChevronLeft, ChevronRight, User, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-spotify-darkGray bg-opacity-95 backdrop-blur-sm sticky top-0 z-40 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-spotify-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="bg-spotify-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-80 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 bg-spotify-black bg-opacity-70 rounded-full px-2 py-1 hover:bg-opacity-80 transition-colors cursor-pointer">
            <div className="bg-gray-600 rounded-full p-1">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
