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
import { isArtist, isSongOwner } from '../utilities/authUtils';

// Vista del formulario
const NEW_SONG_VIEW_PATH = './static/songs/newSongView.html';
// Vista de de los detalles de una canción obtenida por detalles
const SONG_DETAIL_VIEW_PATH = './static/songs/showSongByID.html'
const EDIT_SONG_VIEW_PATH = './static/songs/editSongView.html'
//
const ALBUM_SONGS_VIEW_PATH = './static/albums/albumSongsView.html'

export const songRoutes = [
  // API para obtener todas las canciones (JSON)
  {
    path: '/get/songs',
    method: 'GET',
    handler: handleGetAllSongs,
    protected: true
  },
  // API para buscar canciones (JSON)
  {
    path: '/get/songs/search',
    method: 'GET',
    handler: handleSearchSongs,
    protected: true
  },
  // API para obtener canción por ID (JSON)
  {
    path: '/get/albums/:id/songs',
    method: 'GET',
    handler: handleGetAllAlbumSongs,
    protected: true
  },
  // Ruta de la vista de las canciones que se encuentran en un album por ID
  {
    path: '/albums/:id/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ALBUM_SONGS_VIEW_PATH),
    protected: true
  },
  // Ruta de la vista del formulario para añadir una canción (JSON
  {
    path: '/songs/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_SONG_VIEW_PATH),
    protected: true
  },
  // API para insertar una nueva canción
  {
    path: '/songs/new',
    method: 'POST',
    handler: async (req: Request) => { // Modified handler
        const authError = await isArtist(req);
        if (authError instanceof Response) {
            return authError;
        }
        return handleInsertSong(req);
    },
    protected: true
  },
  // Mostrar detalles de canción obtenida por ID (HTML)
  {
    path: '/songs/:id',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(SONG_DETAIL_VIEW_PATH),
    protected: true
  },
  // API para obtener canción por ID (JSON)
  {
    path: '/get/songs/:id',
    method: 'GET',
    handler: handleGetSongById,
    protected: true
  },
  // Petición GET para ver formulario de edición
  {
    path: '/songs/:id/edit',
    method: 'GET',
    handler: async (req: Request, id: number) => {
        const authError = await isSongOwner(req, id);
        if (authError) {
            return authError;
        }
        return serveHtmlWithSidebar(EDIT_SONG_VIEW_PATH);
    },
    protected: true
  },
  {
    path: '/songs/:id',
    method: 'PUT',
    handler: async (req: Request, id: number) => {
        const authError = await isSongOwner(req, id);
        if (authError) {
            return authError;
        }
        return handleUpdateSong(req, id);
    },
    protected: true
  },
  {
    path: '/songs/:id',
    method: 'DELETE',
    handler: async (req: Request, id: number) => {
        const authError = await isSongOwner(req, id);
        if (authError) {
            return authError;
        }
        return handleDeleteSong(req, id);
    },
    protected: true
  }


];
