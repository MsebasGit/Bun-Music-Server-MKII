import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllSongs,
  handleGetSongById,
  handleInsertSong,
  handleUpdateSong,
  handleDeleteSong,
  handleSearchSongs
} from './../controller/songController';
import { handleGetAllAlbumSongs } from '../controller/albumController';
import { isArtist, isSongOwner } from '../utilities/authUtils';

// Vistas
const NEW_SONG_VIEW_PATH = './static/songs/newSongView.html';
const SONG_DETAIL_VIEW_PATH = './static/songs/showSongByID.html';
const EDIT_SONG_VIEW_PATH = './static/songs/editSongView.html';
const ALBUM_SONGS_VIEW_PATH = './static/albums/albumSongsView.html';

export const songRoutes = [

  //            API REST

  // Obtener todas las canciones
  {
    path: '/songs',
    method: 'GET',
    handler: handleGetAllSongs,
    protected: true
  },

  // Buscar canciones
  {
    path: '/songs/search',
    method: 'GET',
    handler: handleSearchSongs,
    protected: true
  },

  // Obtener canciones de un álbum
  {
    path: '/albums/:albumId/songs',
    method: 'GET',
    handler: handleGetAllAlbumSongs,
    protected: true
  },

  // Obtener canción por ID
  {
    path: '/songs/:id',
    method: 'GET',
    handler: handleGetSongById,
    protected: true
  },

  // Crear nueva canción
  {
    path: '/songs',
    method: 'POST',
    handler: async (req: Request) => {
      const authError = await isArtist(req);
      if (authError instanceof Response) return authError;
      return handleInsertSong(req);
    },
    protected: true
  },

  // Actualizar canción
  {
    path: '/songs/:id',
    method: 'PUT',
    handler: async (req: Request, id: number) => {
      const authError = await isSongOwner(req, id);
      if (authError) return authError;
      return handleUpdateSong(req, id);
    },
    protected: true
  },

  // Eliminar canción
  {
    path: '/songs/:id',
    method: 'DELETE',
    handler: async (req: Request, id: number) => {
      const authError = await isSongOwner(req, id);
      if (authError) return authError;
      return handleDeleteSong(req, id);
    },
    protected: true
  },

  //            VISTAS HTML

  // Formulario para nueva canción
  {
    path: '/songs/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_SONG_VIEW_PATH),
    protected: true
  },

  // Detalle de canción por ID
  {
    path: '/songs/:id/view',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(SONG_DETAIL_VIEW_PATH),
    protected: true
  },

  // Formulario para editar canción
  {
    path: '/songs/:id/edit',
    method: 'GET',
    handler: async (req: Request, id: number) => {
      const authError = await isSongOwner(req, id);
      if (authError) return authError;
      return serveHtmlWithSidebar(EDIT_SONG_VIEW_PATH);
    },
    protected: true
  },

  // Vista de canciones de un álbum
  {
    path: '/albums/:albumId/songs/view',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ALBUM_SONGS_VIEW_PATH),
    protected: true
  }

];

