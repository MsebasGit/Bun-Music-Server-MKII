import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetSongsByPlaylistId,
  handleInsertPlaylistSong,
  handleDeletePlaylistSong,
  handleGetPlaylistsWhereSongNotExist
} from './../controller/playlistSongController';

const NEW_PLAYLIST_SONG_VIEW_PATH = './static/playlistSongs/newPlaylistSongView.html';
const PLAYLIST_SONGS_VIEW_PATH = './static/playlistSongs/playlistSongsView.html';

export const playlistSongRoutes = [


  //            API REST


  // Obtener canciones dentro de una playlist
  {
    path: '/api/v1/playlists/:id/songs',
    method: 'GET',
    handler: handleGetSongsByPlaylistId,
    protected: true
  },

  // Obtener playlists donde NO está una canción
  {
    path: '/api/v1/songs/:id/not-in-playlists',
    method: 'GET',
    handler: handleGetPlaylistsWhereSongNotExist,
    protected: true
  },

  // Agregar una canción a una playlist
  {
    path: '/playlists/:playlistId/songs',
    method: 'POST',
    handler: handleInsertPlaylistSong,
    protected: true
  },

  // Eliminar una canción de una playlist
  {
    path: '/playlists/:playlistId/songs/:songId',
    method: 'DELETE',
    handler: handleDeletePlaylistSong,
    protected: true
  },

  //            VISTAS HTML

  // Vista: ver canciones de la playlist
  {
    path: '/api/v1/playlists/:id/songs',
    method: 'POST',
    handler: handleInsertPlaylistSong,
    protected: true
  },

  // Vista: formulario para añadir canciones a playlist
  {
    path: '/api/v1/playlists/:id_playlist/songs/:id_song',
    method: 'DELETE',
    handler: handleDeletePlaylistSong,
    protected: true
  }

];

