export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  songs: Song[];
  createdBy: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  followers: number;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
  year: number;
}
