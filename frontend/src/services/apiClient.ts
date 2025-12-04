// frontend/src/services/apiClient.ts

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { Song, Album, Artist, User, Comment, Playlist, SocialNetwork, LikeStatus, LikeCount, ApiResponse } from '../types/api';

const API_BASE_URL = '/'; // Replace with your backend URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If you need to send cookies with requests
});

async function apiClientCall<T>(
  request: Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> {
  try {
    const response = await request;
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`API call failed:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data?.message || error.message || 'An unknown error occurred' };
  }
}

// --- Song API calls ---
export const songApi = {
  getAll: async (): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>('/api/v1/songs'));
  },
  getById: async (id: number): Promise<ApiResponse<Song>> => {
    return apiClientCall(axiosInstance.get<Song>(`/api/v1/songs/${id}`));
  },
  search: async (searchTerm: string): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/songs/search?term=${encodeURIComponent(searchTerm)}`));
  },
  create: async (newSong: Omit<Song, 'id_song' | 'release_date' | 'album_name' | 'artist_ids' | 'artist_names'>): Promise<ApiResponse<number>> => {
    return apiClientCall(axiosInstance.post<number>('/songs', newSong));
  },
  update: async (id: number, updatedSong: Omit<Song, 'id_song' | 'release_date' | 'album_name' | 'artist_ids' | 'artist_names'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/songs/${id}`, updatedSong));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/songs/${id}`));
  },
};

// --- Album API calls ---
export const albumApi = {
  getAll: async (): Promise<ApiResponse<Album[]>> => {
    return apiClientCall(axiosInstance.get<Album[]>('/api/v1/albums'));
  },
  getSongs: async (albumId: number): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/albums/${albumId}/songs`));
  },
  getById: async (id: number): Promise<ApiResponse<Album>> => {
    return apiClientCall(axiosInstance.get<Album>(`/albums/${id}`));
  },
  search: async (searchTerm: string): Promise<ApiResponse<Album[]>> => {
    return apiClientCall(axiosInstance.get<Album[]>(`/albums/search?term=${encodeURIComponent(searchTerm)}`));
  },
  getByArtistId: async (artistId: number): Promise<ApiResponse<Album[]>> => {
    return apiClientCall(axiosInstance.get<Album[]>(`/albums/artist/${artistId}`));
  },
  create: async (newAlbum: Omit<Album, 'id_album' | 'release_date' | 'artist_name'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>('/albums', newAlbum));
  },
  update: async (id: number, updatedAlbum: Omit<Album, 'id_album' | 'release_date' | 'artist_name'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/albums/${id}`, updatedAlbum));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/albums/${id}`));
  },
};

// --- Artist API calls ---
export const artistApi = {
  getAll: async (): Promise<ApiResponse<Artist[]>> => {
    return apiClientCall(axiosInstance.get<Artist[]>('/api/v1/artists'));
  },
  getSongs: async (artistId: number): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/artists/${artistId}/songs`));
  },
  getById: async (id: number): Promise<ApiResponse<Artist>> => {
    return apiClientCall(axiosInstance.get<Artist>(`/api/v1/artists/${id}`));
  },
  search: async (searchTerm: string): Promise<ApiResponse<Artist[]>> => {
    return apiClientCall(axiosInstance.get<Artist[]>(`/artists/search?term=${encodeURIComponent(searchTerm)}`));
  },
  create: async (newArtist: Omit<Artist, 'id_artist' | 'debut_date'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>('/artists', newArtist));
  },
  update: async (id: number, updatedArtist: Omit<Artist, 'id_artist' | 'id_user' | 'debut_date'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/artists/${id}`, updatedArtist));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/artists/${id}`));
  },
};

// --- User API calls ---
export const userApi = {
  getById: async (id: number): Promise<ApiResponse<User>> => {
    return apiClientCall(axiosInstance.get<User>(`/users/${id}`));
  },
  login: async (user: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClientCall(axiosInstance.post('/api/v1/login', { user, password }));
  },
  signup: async (user: string, email: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClientCall(axiosInstance.post('/api/v1/signup', { user, email, password }));
  },
  // Note: For login/signup, you'd typically have specific endpoints and handle credentials carefully.
  // This example focuses on data retrieval/management after authentication.
  update: async (id: number, updatedUser: Omit<User, 'id_user' | 'creation_date'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/users/${id}`, updatedUser));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/users/${id}`));
  },
};

// --- Comment API calls ---
export const commentApi = {
  getBySongId: async (songId: number): Promise<ApiResponse<Comment[]>> => {
    return apiClientCall(axiosInstance.get<Comment[]>(`/api/v1/songs/${songId}/comments`));
  },
  getById: async (id: number): Promise<ApiResponse<Comment>> => {
    return apiClientCall(axiosInstance.get<Comment>(`/api/v1/comments/${id}`));
  },
  create: async (newComment: Omit<Comment, 'id_comment' | 'creation_date' | 'modification_date' | 'username'>): Promise<ApiResponse<Comment>> => {
    return apiClientCall(axiosInstance.post<Comment>('/comments', newComment));
  },
  update: async (id: number, updatedComment: Omit<Comment, 'id_comment' | 'creation_date' | 'modification_date' | 'id_song' | 'id_user' | 'username'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/comments/${id}`, updatedComment));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/comments/${id}`));
  },
};

// --- Playlist API calls ---
export const playlistApi = {
  getAll: async (): Promise<ApiResponse<Playlist[]>> => {
    return apiClientCall(axiosInstance.get<Playlist[]>(`/api/v1/playlists`));
  },
  getById: async (id: number): Promise<ApiResponse<Playlist>> => {
    return apiClientCall(axiosInstance.get<Playlist>(`/playlists/${id}`));
  },
  create: async (newPlaylist: Omit<Playlist, 'id_playlist' | 'creation_date' | 'modification_date'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>('/playlists', newPlaylist));
  },
  update: async (id: number, updatedPlaylist: Omit<Playlist, 'id_playlist' | 'creation_date' | 'modification_date' | 'id_user'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/playlists/${id}`, updatedPlaylist));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/playlists/${id}`));
  },
  getSongs: async (playlistId: number): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/playlists/${playlistId}/songs`));
  },
  addSong: async (playlistId: number, songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>(`/playlists/${playlistId}/songs`, { id_song: songId }));
  },
  removeSong: async (playlistId: number, songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/playlists/${playlistId}/songs/${songId}`));
  },
  getPlaylistsWhereSongNotExist: async (songId: number, userId: number): Promise<ApiResponse<Playlist[]>> => {
    return apiClientCall(axiosInstance.get<Playlist[]>(`/api/v1/playlists/song-not-exist/${songId}/user/${userId}`));
  },
};

// --- Social Network API calls ---
export const socialNetworkApi = {
  getByArtistId: async (artistId: number): Promise<ApiResponse<SocialNetwork[]>> => {
    return apiClientCall(axiosInstance.get<SocialNetwork[]>(`/social-networks/artist/${artistId}`));
  },
  getById: async (id: number): Promise<ApiResponse<SocialNetwork>> => {
    return apiClientCall(axiosInstance.get<SocialNetwork>(`/social-networks/${id}`));
  },
  create: async (newSocialNetwork: Omit<SocialNetwork, 'id_network'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>('/social-networks', newSocialNetwork));
  },
  update: async (id: number, updatedSocialNetwork: Omit<SocialNetwork, 'id_network'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/social-networks/${id}`, updatedSocialNetwork));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/social-networks/${id}`));
  },
};

// --- User Song Rating (Likes) API calls ---
export const userSongRatingApi = {
  getLikedSongsByUser: async (): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/me/liked-songs`));
  },
  isSongLikedByUser: async (userId: number, songId: number): Promise<ApiResponse<LikeStatus>> => {
    return apiClientCall(axiosInstance.get<LikeStatus>(`/user-song-ratings/user/${userId}/song/${songId}/is-liked`));
  },
  countLikesInSong: async (songId: number): Promise<ApiResponse<LikeCount>> => {
    return apiClientCall(axiosInstance.get<LikeCount>(`/api/v1/songs/${songId}/likes-count`));
  },
  likeSong: async (userId: number, songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>(`/user-song-ratings/like`, { id_user: userId, id_song: songId }));
  },
  unlikeSong: async (userId: number, songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/user-song-ratings/unlike`, { data: { id_user: userId, id_song: songId } }));
  },
  searchLikedSongs: async (userId: number, searchTerm: string): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/user-song-ratings/user/${userId}/liked-songs/search?term=${encodeURIComponent(searchTerm)}`));
  },
};