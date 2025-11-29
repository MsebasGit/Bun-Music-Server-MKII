import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllAlbums,
  handleGetAlbumById,
  handleInsertAlbum,
  handleUpdateAlbum,
  handleDeleteAlbum,
  handleGetAllAlbumSongs,
  handleGetAlbumsByArtistId,
  handleSearchAlbums
} from './../controller/albumController';
import { withAuthCheck, isArtist } from '../utilities/authUtils';

const NEW_ALBUM_VIEW_PATH = './static/albums/newAlbumView.html';
const ALBUMS_MENU_VIEW_PATH = './static/albums/albumsMenuView.html';
const ME_ALBUMS_ARTISTS_VIEW_PATH = './static/albums/meAlbumsView.html';
const EDIT_ALBUM_VIEW_PATH = './static/albums/editAlbumView.html';
const ALBUMS_ARTISTS_VIEW_PATH = './static/albums/albumsArtistView.html';

export const albumRoutes = [

  //          API REST

  // Obtener todos los álbumes
  {
    path: '/api/v1/albums',
    method: 'GET',
    handler: handleGetAllAlbums,
    protected: true
  },

  // Buscar álbumes
  {
    path: '/api/v1/albums/search',
    method: 'GET',
    handler: handleSearchAlbums,
    protected: true
  },

  // Obtener un álbum por ID
  {
    path: '/albums/:id',
    method: 'GET',
    handler: handleGetAlbumById,
    protected: true
  },

  // Obtener álbumes de un artista
  {
    path: '/api/v1/albums',
    method: 'POST',
    handler: withAuthCheck(isArtist, true)(handleInsertAlbum),
    protected: true
  },

  // Crear álbum
  {
    path: '/albums',
    method: 'POST',
    handler: handleInsertAlbum,
    protected: true
  },

  // Actualizar álbum
  {
    path: '/albums/:id',
    method: 'PUT',
    handler: handleUpdateAlbum,
    protected: true
  },

  // Eliminar álbum
  {
    path: '/api/v1/albums/:id',
    method: 'GET',
    handler: handleGetAlbumById,
    protected: true
  },

  // Obtener canciones de un álbum
  {
    path: '/api/v1/artists/:id/albums',
    method: 'GET',
    handler: handleGetAllAlbumSongs,
    protected: true
  },

  //          VISTAS HTML
  
  {
    path: '/albums/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_ALBUM_VIEW_PATH),
    protected: true
  },

  {
    path: '/api/v1/albums/:id',
    method: 'PUT',
    handler: handleUpdateAlbum,
    protected: true
  },

  {
    path: '/api/v1/albums/:id',
    method: 'DELETE',
    handler: handleDeleteAlbum,
    protected: true
  },

  {
    path: '/api/v1/albums/:id/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(EDIT_ALBUM_VIEW_PATH),
    protected: true
  },

  {
    path: '/me/albums',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ME_ALBUMS_ARTISTS_VIEW_PATH),
    protected: true
  }

];

