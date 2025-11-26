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

const NEW_ALBUM_VIEW_PATH = './static/albums/newAlbumView.html';
const ALBUMS_MENU_VIEW_PATH = './static/albums/albumsMenuView.html';
const ME_ALBUMS_ARTISTS_VIEW_PATH = './static/albums/meAlbumsView.html';
const EDIT_ALBUM_VIEW_PATH = './static/albums/editAlbumView.html';
const ALBUMS_ARTISTS_VIEW_PATH = './static/albums/albumsArtistView.html'

export const albumRoutes = [
  // API para obtener todas los albumes
  {
    path: '/get/albums',
    method: 'GET',
    handler: handleGetAllAlbums,
    protected: true
  },
  // API para buscar albumes
  {
    path: '/get/albums/search',
    method: 'GET',
    handler: handleSearchAlbums,
    protected: true
  },
  // Ruta del formulario del album
  {
    path: '/albums/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_ALBUM_VIEW_PATH),
    protected: true
  },
  // Api para añadir un album (POST)
  {
    path: '/albums/new',
    method: 'POST',
    handler: handleInsertAlbum,
    protected: true
  },
  // Ruta para ver todas los albumes
  {
    path: '/albums',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ALBUMS_MENU_VIEW_PATH),
    protected: true
  },
  // Vista de los albumes que tiene un artista por ID
  {
    path: '/artists/:id/albums',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ALBUMS_ARTISTS_VIEW_PATH),
    protected: true
  },
  {
    path: '/get/albums/:id',
    method: 'GET',
    handler: handleGetAlbumById,
    protected: true
  },
  {
    path: '/get/artists/:id/albums',
    method: 'GET',
    handler: handleGetAlbumsByArtistId, // This should be handleGetAlbumsByArtistId
    protected: true
  },
  {
    path: '/albums/:id/edit',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(EDIT_ALBUM_VIEW_PATH),
    protected: true
  },
  {
    path: '/albums/:id',
    method: 'PUT',
    handler: handleUpdateAlbum,
    protected: true
  },
  {
    path: '/albums/:id',
    method: 'DELETE',
    handler: handleDeleteAlbum,
    protected: true
  },
  {
    path: '/get/albums/:id/songs',
    method: 'GET',
    handler: handleGetAllAlbumSongs,
    protected: true
  },
  // Vista de albumes de artista (para administración)
  {
    path: '/me/albums',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ME_ALBUMS_ARTISTS_VIEW_PATH),
    protected: true
  },
];
