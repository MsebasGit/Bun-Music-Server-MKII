import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllPlaylists,
  handleGetPlaylistById,
  handleInsertPlaylist,
  handleUpdatePlaylist,
  handleDeletePlaylist
} from './../controller/playlistController';

const NEW_PLAYLIST_VIEW_PATH = './static/playlists/newPlaylistView.html';
const EDIT_PLAYLIST_VIEW_PATH = './static/playlists/editPlaylistView.html';
const PLAYLISTS_MENU_VIEW_PATH = './static/playlists/playlistsMenuView.html';

export const playlistRoutes = [
  // API para obtener todas las playlists
  {
    path: '/get/playlists',
    method: 'GET',
    handler: handleGetAllPlaylists,
    protected: true
  },
  
  // Ruta para añadir una playlists con el formulario
  {
    path: '/playlists/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_PLAYLIST_VIEW_PATH),
    protected: true
  },
  // Ruta para añadir una playlist
  {
    path: '/playlists/new',
    method: 'POST',
    handler: handleInsertPlaylist,
    protected: true
  },
  
  // Ruta para ver todas las playlists
  {
    path: '/playlists',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(PLAYLISTS_MENU_VIEW_PATH),
    protected: true
  },
  // API para obtener la información de una playlist por ID (JSON)
  {
    path: '/get/playlists/:id',
    method: 'GET',
    handler: handleGetPlaylistById,
    protected: true
  },

  // Ruta para añadir una playlists con el formulario
  {
    path: '/playlists/:id/edit',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(EDIT_PLAYLIST_VIEW_PATH),
    protected: true
  },
  // Editar una playlist
  {
    path: '/playlists/:id',
    method: 'PUT',
    handler: handleUpdatePlaylist,
    protected: true
  },
  /* Borrar una playlist 
  {
    path: '/playlists/:id/delete',
    method: 'POST',
    handler: handleDeletePlaylist,
    protected: true
  },
  */
  // Borrar una playlist con get
  {
    path: '/playlists/:id',
    method: 'DELETE',
    handler: handleDeletePlaylist,
    protected: true
  }
];
