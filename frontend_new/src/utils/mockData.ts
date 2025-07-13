import { faker } from '@faker-js/faker';
import { Song, Playlist, Artist, Album } from '../types';

// Generate mock songs
export const generateMockSongs = (count: number): Song[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.music.songName(),
    artist: faker.person.fullName(),
    album: faker.music.album(),
    duration: `${faker.number.int({ min: 2, max: 5 })}:${faker.number.int({ min: 10, max: 59 })}`,
    image: `https://picsum.photos/400/400?random=${faker.number.int({ min: 1, max: 1000 })}`,
    audioUrl: faker.internet.url()
  }));
};

// Generate mock playlists
export const generateMockPlaylists = (count: number): Playlist[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.music.genre() + ' Mix',
    description: faker.lorem.sentence(),
    image: `https://picsum.photos/300/300?random=${faker.number.int({ min: 1001, max: 2000 })}`,
    songs: generateMockSongs(faker.number.int({ min: 10, max: 50 })),
    createdBy: faker.person.fullName()
  }));
};

// Generate mock artists
export const generateMockArtists = (count: number): Artist[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    image: `https://picsum.photos/300/300?random=${faker.number.int({ min: 2001, max: 3000 })}`,
    followers: faker.number.int({ min: 1000, max: 10000000 })
  }));
};

// Generate mock albums
export const generateMockAlbums = (count: number): Album[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.music.album(),
    artist: faker.person.fullName(),
    image: `https://picsum.photos/300/300?random=${faker.number.int({ min: 3001, max: 4000 })}`,
    year: faker.number.int({ min: 1970, max: 2024 })
  }));
};

// Static data
export const mockSongs = generateMockSongs(100);
export const mockPlaylists = generateMockPlaylists(20);
export const mockArtists = generateMockArtists(50);
export const mockAlbums = generateMockAlbums(30);
