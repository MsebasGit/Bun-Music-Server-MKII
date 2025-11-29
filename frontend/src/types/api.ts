// frontend/src/types/api.ts

export interface Song {
  id_song: number;
  title: string;
  language: string;
  release_date: string;
  duration: number;
  genre: string;
  song_path: string;
  cover_path: string;
  id_album: number | null; // Assuming id_album can be null if not associated with an album
  album_name?: string;
  artist_ids?: string; // Comma-separated string of artist IDs
  artist_names?: string; // Comma-separated string of artist names
}

export interface Album {
  id_album: number;
  name: string;
  release_date: string;
  cover_path: string;
  id_artist: number;
  artist_name?: string;
}

export interface Artist {
  id_artist: number;
  name: string;
  nationality: string;
  biography: string;
  debut_date: string;
  id_user: number;
}

export interface User {
  id_user: number;
  name: string;
  email: string;
  creation_date: string;
}

export interface Comment {
    id_comment: number,
    comment_text: string,
    creation_date: string,
    modification_date: string,
    id_song: number,
    id_user: number,
    username: string
}

export interface Playlist {
  id_playlist: number;
  name: string;
  description: string;
  modification_date: string;
  creation_date: string;
  id_user: number;
}

export interface SocialNetwork {
    id_network: number;
    name: string;
    url: string;
    id_artist: number;
}

// For responses from `isSongLikedByUser`
export interface LikeStatus {
    is_liked: boolean;
}

// For responses from `countLikesInSong`
export interface LikeCount {
    cuantity_of_likes: number;
}

// Interface for API responses that might include a message or error
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}