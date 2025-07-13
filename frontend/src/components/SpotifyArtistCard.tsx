import React from 'react';

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  uri: string;
}

interface SpotifyArtistCardProps {
  artist: SpotifyArtist;
}

const SpotifyArtistCard: React.FC<SpotifyArtistCardProps> = ({ artist }) => {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M followers`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K followers`;
    }
    return `${count} followers`;
  };

  return (
    <div className="text-center group cursor-pointer">
      <img
        src={artist.images[0]?.url || 'https://via.placeholder.com/300'}
        alt={artist.name}
        className="w-full aspect-square object-cover rounded-full mb-4 group-hover:shadow-lg transition-shadow"
      />
      <h3 className="text-white font-semibold mb-1 truncate">{artist.name}</h3>
      <p className="text-gray-400 text-sm">{formatFollowers(artist.followers.total)}</p>
    </div>
  );
};

export default SpotifyArtistCard;