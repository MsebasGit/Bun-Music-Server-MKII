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
    path: '/playlists/:playlistId/songs',
    method: 'GET',
    handler: handleGetSongsByPlaylistId,
    protected: true
  },

  // Obtener playlists donde NO está una canción
  {
    path: '/songs/:songId/available-playlists',
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
    path: '/playlists/:playlistId/songs/view',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(PLAYLIST_SONGS_VIEW_PATH),
    protected: true
  },

  // Vista: formulario para añadir canciones a playlist
  {
    path: '/playlists/songs/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_PLAYLIST_SONG_VIEW_PATH),
    protected: true
  }

];

