import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllSongs,
  handleGetSongById,
  handleInsertSong,
  handleUpdateSong,
  handleDeleteSong,
  handleSearchSongs
} from './../controller/songController';
import { handleGetAllAlbumSongs } from '../controller/albumController'
import { isArtist, isSongOwner, withAuthCheck } from '../utilities/authUtils';

// Vistas
const NEW_SONG_VIEW_PATH = './static/songs/newSongView.html';
const SONG_DETAIL_VIEW_PATH = './static/songs/showSongByID.html';
const EDIT_SONG_VIEW_PATH = './static/songs/editSongView.html';
const ALBUM_SONGS_VIEW_PATH = './static/albums/albumSongsView.html';

const handleUpdateSongAdapter = (req: Request, authResult: any, id: number) => handleUpdateSong(req, id);
const handleDeleteSongAdapter = (req: Request, authResult: any, id: number) => handleDeleteSong(req, id);
const editSongViewAdapter = (req: Request, authResult: any, id: number) => serveHtmlWithSidebar(EDIT_SONG_VIEW_PATH);


export const songRoutes = [

  //            API REST

  // Obtener todas las canciones
  {
    path: '/api/v1/songs',
    method: 'GET',
    handler: handleGetAllSongs,
    protected: true
  },

  // Buscar canciones
  {
    path: '/api/v1/songs/search',
    method: 'GET',
    handler: handleSearchSongs,
    protected: true
  },

  // Obtener canciones de un álbum
  {
    path: '/api/v1/albums/:id/songs',
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
    path: '/api/v1/songs',
    method: 'POST',
    handler: withAuthCheck(isArtist, true)(handleInsertSong),
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
    path: '/api/v1/songs/:id',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_SONG_VIEW_PATH),
    protected: true
  },

  // Detalle de canción por ID
  {
    path: '/songs/:id/view',
    method: 'GET',
    handler: withAuthCheck(isSongOwner)(editSongViewAdapter),
    protected: true
  },

  // Formulario para editar canción
  {
    path: '/api/v1/songs/:id',
    method: 'PUT',
    handler: withAuthCheck(isSongOwner)(handleUpdateSongAdapter),
    protected: true
  },

  // Vista de canciones de un álbum
  {
    path: '/api/v1/songs/:id',
    method: 'DELETE',
    handler: withAuthCheck(isSongOwner)(handleDeleteSongAdapter),
    protected: true
  }

];

