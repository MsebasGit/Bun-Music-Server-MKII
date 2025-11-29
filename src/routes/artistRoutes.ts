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

  //          API REST
  
  // Obtener todos los artistas
  {
    path: '/artists',
    method: 'GET',
    handler: handleGetAllArtists,
    protected: true
  },

  // Buscar artistas
  {
    path: '/artists/search',
    method: 'GET',
    handler: handleSearchArtists,
    protected: true
  },

  // Obtener artista por ID
  {
    path: '/artists/:id',
    method: 'GET',
    handler: handleGetArtistById,
    protected: true
  },

  // Obtener artista asociado a un usuario
  {
    path: '/users/:id/artists',
    method: 'GET',
    handler: handleGetArtistByUserId,
    protected: true
  },

  // Crear artista
  {
    path: '/artists',
    method: 'POST',
    handler: handleInsertArtist,
    protected: true
  },

  // Actualizar artista
  {
    path: '/artists/:id',
    method: 'PUT',
    handler: handleUpdateArtist,
    protected: true
  },

  // Eliminar artista
  {
    path: '/artists/:id',
    method: 'DELETE',
    handler: handleDeleteArtist,
    protected: true
  },

  //            VISTAS


  // Vista lista de artistas
  {
    path: '/artists',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ARTISTS_MENU_VIEW_PATH),
    protected: true
  },

  // Formulario para crear artista
  {
    path: '/artists/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_ARTIST_VIEW_PATH),
    protected: true
  }

];

