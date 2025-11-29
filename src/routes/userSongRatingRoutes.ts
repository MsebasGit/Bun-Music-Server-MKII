import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleLikeSong,
  handleUnlikeSong,
  handleGetLikedSongs,
  handleIsSongLiked,
  handleGetLikesInSong,
  handleSearchLikedSongs
} from '../controller/userSongRatingController';

// Vista HTML de canciones que le gustan al usuario
const LIKED_SONGS_VIEW_PATH = './static/userSongRatings/likedSongsView.html';

export const userSongRatingRoutes = [

  //          VISTAS HTML

  // Vista de canciones que le gustan al usuario
  {
    path: '/api/v1/me/liked-songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(LIKED_SONGS_VIEW_PATH),
    protected: true
  },

  //          API REST
            
  // Obtener todas las canciones que le gustan al usuario
  {
    path: '/api/v1/me/liked-songs/search',
    method: 'GET',
    handler: handleGetLikedSongs,
    protected: true
  },

  // Buscar canciones que le gustan al usuario
  {
    path: '/api/v1/me/liked-songs/:id_song',
    method: 'GET',
    handler: handleSearchLikedSongs,
    protected: true
  },

  // Verificar si una canción específica tiene like del usuario
  {
    path: '/api/v1/songs/:id_song/likes',
    method: 'GET',
    handler: handleIsSongLiked,
    protected: true
  },

  // Obtener la cantidad de likes de una canción
  {
    path: '/songs/:id/likes',
    method: 'GET',
    handler: handleGetLikesInSong,
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
