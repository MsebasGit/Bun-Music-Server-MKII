import { serveHtmlWithSidebar } from '../utilities/view';
import {
    handleLikeSong,
    handleUnlikeSong,
    handleGetLikedSongs,
    handleIsSongLiked,
    handleGetLikesInSong,
    handleSearchLikedSongs
} from '../controller/userSongRatingController';
const LIKED_SONGS_VIEW_PATH = './static/userSongRatings/likedSongsView.html';

export const userSongRatingRoutes = [
  // API para obtener las canciones que le gustan al usuario
  {
    path: '/api/v1/me/liked-songs',
    method: 'GET',
    handler: handleGetLikedSongs,
    protected: true
  },
  // API para buscar canciones que le gustan al usuario
  {
    path: '/api/v1/me/liked-songs/search',
    method: 'GET',
    handler: handleSearchLikedSongs,
    protected: true
  },
  // API para verificar si una canción tiene like
  {
    path: '/api/v1/me/liked-songs/:id_song',
    method: 'GET',
    handler: handleIsSongLiked,
    protected: true
  },  
  // API para ver cantidad de likes en una canción
  {
    path: '/api/v1/songs/:id_song/likes',
    method: 'GET',
    handler: handleGetLikesInSong,
    protected: true
  },
  // Vista de las canciones que le gustan al usuario
  {
    path: '/me/liked/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(LIKED_SONGS_VIEW_PATH),
    protected: true
  },
  // Dar like a una canción
  {
    path: '/api/v1/songs/:id/like',                                                                                                                                                         
    method: 'POST',
    handler: handleLikeSong,
    protected: true
  },
  // Quitar like a una canción
  {
    path: '/api/v1/songs/:id/unlike',
    method: 'POST',
    handler: handleUnlikeSong,
    protected: true
  }
];