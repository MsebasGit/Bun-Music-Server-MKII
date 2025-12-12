// frontend/src/services/apiClient.ts
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { Song, Album, Artist, User, Playlist, SocialNetwork, LikeStatus, LikeCount, ApiResponse } from '../types/api';

const API_BASE_URL = '/'; // La base para las llamadas a la API

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR DE AXIOS ---
// Esto se ejecuta ANTES de cada petición.
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Intentamos obtener el token del localStorage
    const token = localStorage.getItem('jwt_token');
    
    console.log("Adding Authorization header with token:", token);

    // 2. Si existe el token, lo añadimos a la cabecera 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Devolvemos la configuración modificada para que la petición continúe
    return config;
  },
  (error) => {
    // Manejar errores en la configuración de la petición
    return Promise.reject(error);
  }
);


async function apiClientCall<T>(
  request: Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> {
  try {
    const response = await request;
    // Check if the response.data itself has a 'data' property (common for API wrappers)
    // If so, use that nested 'data' property as the actual payload.
    const actualData = (response.data && typeof response.data === 'object' && 'data' in response.data)
        ? (response.data as any).data
        : response.data;

    return { success: true, data: actualData as T };
  } catch (error: any) {
    console.error(`API call failed:`, error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    
    // Si el error es de no autorizado, podríamos redirigir al login
    if (error.response?.status === 401) {
        console.log("Unauthorized, redirecting to login...");
        // window.location.href = '/login'; // Descomenta esto para redirigir automáticamente
    }
    
    return { success: false, error: errorMessage };
  }
}

// --- User API calls ---
export const userApi = {
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClientCall(axiosInstance.get<User>(`/api/v1/auth/me`));
  }, 
  login: async (email: string, password: string): Promise<ApiResponse<{ message: string, token: string, user: any }>> => {
    // Se ajusta el tipo de respuesta para que incluya el token y el usuario
    return apiClientCall(axiosInstance.post('/api/v1/auth/login', { email, password }));
  },
  signup: async (name: string, email: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClientCall(axiosInstance.post('/api/v1/auth/register', { name, email, password }));
  },
  update: async (id: number, updatedUser: Omit<User, 'id_user' | 'creation_date'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/users/${id}`, updatedUser));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/users/${id}`));
  },
};


// --- Playlist API calls ---
export const playlistApi = {
  getMe: async (): Promise<ApiResponse<Playlist[]>> => {
    // Esta llamada ahora debería funcionar porque el interceptor añadirá el token
    return apiClientCall(axiosInstance.get<Playlist[]>(`/api/v1/playlists/me`));
  },
  create: async (newPlaylist: { name: string; description?: string }): Promise<ApiResponse<Playlist>> => {
    // Esta también funcionará
    return apiClientCall(axiosInstance.post<Playlist>('/api/v1/playlists', newPlaylist));
  },
  // ... (otras llamadas a la API de playlists)
  getAll: async (): Promise<ApiResponse<Playlist[]>> => {
    return apiClientCall(axiosInstance.get<Playlist[]>(`/api/v1/playlists`));
  },
  getById: async (id: number): Promise<ApiResponse<Playlist>> => {
    return apiClientCall(axiosInstance.get<Playlist>(`/playlists/${id}`));
  },
  update: async (id: number, updatedPlaylist: Omit<Playlist, 'id' | 'creationDate' | 'modificationDate' | 'userId'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/api/v1/playlists/${id}`, updatedPlaylist));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/api/v1/playlists/${id}`));
  },
  getSongs: async (playlistId: number): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/playlists/${playlistId}/songs`));
  },
  addSong: async (playlistId: number, songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>(`/api/v1/playlists/${playlistId}/songs`, { songId: songId }));
  },
  removeSong: async (playlistId: number, songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/playlists/${playlistId}/songs/${songId}`));
  },
  search: async (searchTerm: string): Promise<ApiResponse<Playlist[]>> => {
    return apiClientCall(axiosInstance.get<Playlist[]>(`/api/v1/playlists/search?term=${encodeURIComponent(searchTerm)}`));
  },
  getPlaylistsWhereSongNotExist: async (songId: number): Promise<ApiResponse<Playlist[]>> => {
    return apiClientCall(axiosInstance.get<Playlist[]>(`/api/v1/songs/${songId}/not-in-playlists`));
  },
};


// --- (El resto de tus llamadas a la API: songApi, albumApi, etc. no necesitan cambios) ---

export const songApi = {
  getAll: async (): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>('/api/v1/songs'));
  },
  getFavorites: async (): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>('/api/v1/songs/favorites'));
  },
  
  getById: async (id: number): Promise<ApiResponse<Song>> => {
    return apiClientCall(axiosInstance.get<Song>(`/api/v1/songs/${id}`));
  },
  getByArtistId: async (artistId: number): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/artists/${artistId}/songs`));
  },
  search: async (searchTerm: string): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/songs/search?term=${encodeURIComponent(searchTerm)}`));
  },
  searchFavourites: async (searchTerm: string): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/ratings/me/search?term=${encodeURIComponent(searchTerm)}`));
  },
  create: async (formData: FormData): Promise<ApiResponse<number>> => {
    return apiClientCall(axiosInstance.post<number>('/api/v1/songs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  },
  update: async (id: number, updatedSong: Omit<Song, 'id_song' | 'release_date' | 'album_name' | 'artist_ids' | 'artist_names'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/songs/${id}`, updatedSong));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/songs/${id}`));
  },
};

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
    return apiClientCall(axiosInstance.get<Album[]>(`/api/v1/albums/search?term=${encodeURIComponent(searchTerm)}`));
  },
  getByArtistId: async (artistId: number): Promise<ApiResponse<Album[]>> => {
    return apiClientCall(axiosInstance.get<Album[]>(`/api/v1/artists/${artistId}/albums`));
  },
  create: async (formData: FormData): Promise<ApiResponse<Album>> => {
    return apiClientCall(axiosInstance.post<Album>('/api/v1/albums', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));
  },
  update: async (id: number, updatedAlbum: Omit<Album, 'id_album' | 'release_date' | 'artist_name'>): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.put<void>(`/albums/${id}`, updatedAlbum));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/albums/${id}`));
  },
};

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
    return apiClientCall(axiosInstance.get<Artist[]>(`/api/v1/artists/search?term=${encodeURIComponent(searchTerm)}`));
  },
  create: async (newArtist: Omit<Artist, 'id' | 'debutDate' | 'socialLinks'>): Promise<ApiResponse<Artist>> => {
    return apiClientCall(axiosInstance.post<Artist>('/api/v1/artists', newArtist));
  },
  update: async (id: number, updatedArtist: Omit<Artist, 'id' | 'debutDate'>): Promise<ApiResponse<Artist>> => {
    return apiClientCall(axiosInstance.put<Artist>(`/api/v1/artists/${id}`, updatedArtist));
  },
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/artists/${id}`));
  },
};

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

export const userSongRatingApi = {
  // GET /api/v1/ratings/me
  getLikedSongsByUser: async (): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(axiosInstance.get<Song[]>(`/api/v1/ratings/me`));
  },

  // GET /api/v1/ratings/me/search?q=...
  searchLikedSongs: async (searchTerm: string): Promise<ApiResponse<Song[]>> => {
    return apiClientCall(
      axiosInstance.get<Song[]>(`/api/v1/ratings/me/search?q=${encodeURIComponent(searchTerm)}`)
    );
  },

  // GET /api/v1/ratings/song/:id/check
  isSongLikedByUser: async (songId: number): Promise<ApiResponse<LikeStatus>> => {
    return apiClientCall(axiosInstance.get<LikeStatus>(`/api/v1/ratings/song/${songId}/check`));
  },

  // GET /api/v1/ratings/song/:id/count
  countLikesInSong: async (songId: number): Promise<ApiResponse<LikeCount>> => {
    return apiClientCall(axiosInstance.get<LikeCount>(`/api/v1/ratings/song/${songId}/count`));
  },

  // POST /api/v1/ratings/song/:id/like
  likeSong: async (songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.post<void>(`/api/v1/ratings/song/${songId}/like`));
  },

  // DELETE /api/v1/ratings/song/:id/unlike
  unlikeSong: async (songId: number): Promise<ApiResponse<void>> => {
    return apiClientCall(axiosInstance.delete<void>(`/api/v1/ratings/song/${songId}/unlike`));
  },
};