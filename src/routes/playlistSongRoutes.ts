import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetSongsByPlaylistId,
  handleInsertPlaylistSong,
  handleDeletePlaylistSong,
  handleGetPlaylistsWhereSongNotExist
} from './../controller/playlistSongController';

const NEW_PLAYLIST_SONG_VIEW_PATH = './static/playlistSongs/newPlaylistSongView.html';
const PLAYLIST_SONGS_VIEW_PATH = './static/playlistSongs/playlistSongsView.html'

export const playlistSongRoutes = [
  // API de las canciones de una playlist por ID
  {
    path: '/get/playlists/:id/songs',
    method: 'GET',
    handler: handleGetSongsByPlaylistId,
    protected: true
  },
  // API de las playlists donde no esta una canción por ID
  {
    path: '/get/songs/:id/not/playlists',
    method: 'GET',
    handler: handleGetPlaylistsWhereSongNotExist,
    protected: true
  },
  // Vista de las canciones que se encuentran en una playlist por ID
  {
    path: '/playlists/:id/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(PLAYLIST_SONGS_VIEW_PATH),
    protected: true
  },
  // formulario para añadir añadir una canción a una playlist (con get)
  {
    path: '/playlists/songs/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_PLAYLIST_SONG_VIEW_PATH),
    protected: true
  },
  // Ruta para añadir una canción una canción a una playlist
  {
    path: '/playlists/songs/new/:id',
    method: 'POST',
    handler: handleInsertPlaylistSong,
    protected: true
  },
  
  // Borrar canción de una playlist con DELETE
  {
    path: '/playlists/:id_playlist/songs/:id_song',
    method: 'DELETE',
    handler: handleDeletePlaylistSong,
    protected: true
  }
];
