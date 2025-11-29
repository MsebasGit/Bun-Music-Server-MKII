import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllPlaylists,
  handleGetPlaylistById,
  handleInsertPlaylist,
  handleUpdatePlaylist,
  handleDeletePlaylist
} from './../controller/playlistController';

// Rutas de vistas HTML
const NEW_PLAYLIST_VIEW_PATH = './static/playlists/newPlaylistView.html';
const EDIT_PLAYLIST_VIEW_PATH = './static/playlists/editPlaylistView.html';
const PLAYLISTS_MENU_VIEW_PATH = './static/playlists/playlistsMenuView.html';

export const playlistRoutes = [

  /* ------------------------ API JSON ------------------------ */

  // Obtener todas las playlists (JSON)
  {
    path: '/get/playlists',
    method: 'GET',
    handler: handleGetAllPlaylists,
    protected: true
  },

  // Obtener una playlist por ID (JSON)
  {
    path: '/get/playlists/:id',
    method: 'GET',
    handler: handleGetPlaylistById,
    protected: true
  },

  /* ------------------------ Vistas HTML ------------------------ */

  // Vista: formulario nueva playlist
  {
    path: '/playlists/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_PLAYLIST_VIEW_PATH),
    protected: true
  },

  // Vista: ver todas las playlists
  {
    path: '/playlists',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(PLAYLISTS_MENU_VIEW_PATH),
    protected: true
  },

  // Vista: editar playlist por ID
  {
    path: '/playlists/:id/edit',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(EDIT_PLAYLIST_VIEW_PATH),
    protected: true
  },

  /* ------------------------ Acciones CRUD ------------------------ */

  // Crear playlist
  {
    path: '/playlists/new',
    method: 'POST',
    handler: handleInsertPlaylist,
    protected: true
  },

  // Editar playlist
  {
    path: '/playlists/:id',
    method: 'PUT',
    handler: handleUpdatePlaylist,
    protected: true
  },

  // Eliminar playlist
  {
    path: '/playlists/:id',
    method: 'DELETE',
    handler: handleDeletePlaylist,
    protected: true
  }

];
