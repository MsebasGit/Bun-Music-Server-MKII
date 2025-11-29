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
    path: '/api/v1/artists',
    method: 'GET',
    handler: handleGetAllArtists,
    protected: true
  },
  // API para buscar artistas
  {
    path: '/api/v1/artists/search',
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
    path: '/api/v1/artists',
    method: 'POST',
    handler: handleInsertArtist,
    protected: true
  },
  {
    path: '/api/v1/artists/user/:id',
    method: 'GET',
    handler: handleGetArtistByUserId,
    protected: true
  },
  {
    path: '/api/v1/artists/:id',
    method: 'GET',
    handler: handleGetArtistById,
    protected: true
  },
  {
    path: '/api/v1/artists/:id',
    method: 'PUT',
    handler: handleUpdateArtist,
    protected: true
  },
  {
    path: '/api/v1/artists/:id',
    method: 'DELETE',
    handler: handleDeleteArtist,
    protected: true
  }
];
