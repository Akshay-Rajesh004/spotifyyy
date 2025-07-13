import React, { useState } from 'react';
import { ArrowLeft, Music, Image as ImageIcon, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePlaylist: React.FC = () => {
  const navigate = useNavigate();
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const defaultImages = [
    'https://picsum.photos/300/300?random=101',
    'https://picsum.photos/300/300?random=102',
    'https://picsum.photos/300/300?random=103',
    'https://picsum.photos/300/300?random=104',
    'https://picsum.photos/300/300?random=105',
    'https://picsum.photos/300/300?random=106'
  ];

  const handleCreate = () => {
    if (playlistName.trim()) {
      // In a real app, this would save to a backend
      alert(`Playlist "${playlistName}" created successfully!`);
      navigate('/library');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-darkGray to-spotify-gray p-8 pb-32">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-spotify-black bg-opacity-70 rounded-full p-2 hover:bg-opacity-80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">Create Playlist</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Playlist Cover & Basic Info */}
        <div className="bg-spotify-lightGray rounded-lg p-8 mb-6">
          <div className="flex items-start space-x-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-spotify-darkGray rounded-lg flex items-center justify-center mb-4">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Playlist cover"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Music className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button className="flex items-center space-x-2 text-white hover:text-spotify-green transition-colors">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm">Choose photo</span>
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="My Playlist #1"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-transparent text-white text-2xl font-bold placeholder-gray-400 border-none outline-none border-b border-gray-600 focus:border-white pb-2"
                />
              </div>

              <div>
                <textarea
                  placeholder="Add an optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none border-b border-gray-600 focus:border-white pb-2 resize-none"
                />
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Privacy</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="text-spotify-green focus:ring-spotify-green"
                    />
                    <div>
                      <p className="text-white font-medium">Public</p>
                      <p className="text-gray-400 text-sm">Everyone can see this playlist</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="text-spotify-green focus:ring-spotify-green"
                    />
                    <div>
                      <p className="text-white font-medium">Private</p>
                      <p className="text-gray-400 text-sm">Only you can see this playlist</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image Options */}
        <div className="bg-spotify-lightGray rounded-lg p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Choose a cover image</h3>
          <div className="grid grid-cols-3 gap-4">
            {defaultImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === image ? 'border-spotify-green' : 'border-transparent hover:border-gray-500'
                }`}
              >
                <img
                  src={image}
                  alt={`Cover option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 text-white border border-gray-500 rounded-full hover:border-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!playlistName.trim()}
            className="flex items-center space-x-2 bg-spotify-green text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
