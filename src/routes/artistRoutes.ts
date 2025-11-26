import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllArtists,
  handleGetArtistById,
  handleInsertArtist,
  handleUpdateArtist,
  handleDeleteArtist,
  handleGetArtistByUserId,
  handleSearchArtists
} from './../controller/artistController';

const NEW_ARTIST_VIEW_PATH = './static/artists/newArtistView.html';
const ARTISTS_MENU_VIEW_PATH = './static/artists/artistsMenuView.html';

export const artistRoutes = [
  {
    path: '/get/artists',
    method: 'GET',
    handler: handleGetAllArtists,
    protected: true
  },
  // API para buscar artistas
  {
    path: '/get/artists/search',
    method: 'GET',
    handler: handleSearchArtists,
    protected: true
  },
  // Ruta para ver todos los artistas
  {
    path: '/artists',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ARTISTS_MENU_VIEW_PATH),
    protected: true
  },
  {
    path: '/artists/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_ARTIST_VIEW_PATH),
    protected: true
  },
  {
    path: '/artists/new',
    method: 'POST',
    handler: handleInsertArtist,
    protected: true
  },
  {
    path: '/artists/user/:id',
    method: 'GET',
    handler: handleGetArtistByUserId,
    protected: true
  },
  {
    path: '/get/artists/:id',
    method: 'GET',
    handler: handleGetArtistById,
    protected: true
  },
  {
    path: '/artists/:id',
    method: 'PUT',
    handler: handleUpdateArtist,
    protected: true
  },
  {
    path: '/artists/:id',
    method: 'DELETE',
    handler: handleDeleteArtist,
    protected: true
  }
];
