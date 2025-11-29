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

// Vista del formulario
const NEW_SONG_VIEW_PATH = './static/songs/newSongView.html';
// Vista de de los detalles de una canción obtenida por detalles
const SONG_DETAIL_VIEW_PATH = './static/songs/showSongByID.html'
const EDIT_SONG_VIEW_PATH = './static/songs/editSongView.html'
//
const ALBUM_SONGS_VIEW_PATH = './static/albums/albumSongsView.html'

const handleUpdateSongAdapter = (req: Request, authResult: any, id: number) => handleUpdateSong(req, id);
const handleDeleteSongAdapter = (req: Request, authResult: any, id: number) => handleDeleteSong(req, id);
const editSongViewAdapter = (req: Request, authResult: any, id: number) => serveHtmlWithSidebar(EDIT_SONG_VIEW_PATH);


export const songRoutes = [
  // API para obtener todas las canciones (JSON)
  {
    path: '/api/v1/songs',
    method: 'GET',
    handler: handleGetAllSongs,
    protected: true
  },
  // API para buscar canciones (JSON)
  {
    path: '/api/v1/songs/search',
    method: 'GET',
    handler: handleSearchSongs,
    protected: true
  },
  // API para obtener canción por ID (JSON)
  {
    path: '/api/v1/albums/:id/songs',
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
    path: '/api/v1/songs',
    method: 'POST',
    handler: withAuthCheck(isArtist, true)(handleInsertSong),
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
    path: '/api/v1/songs/:id',
    method: 'GET',
    handler: handleGetSongById,
    protected: true
  },
  // Petición GET para ver formulario de edición
  {
    path: '/songs/:id/edit',
    method: 'GET',
    handler: withAuthCheck(isSongOwner)(editSongViewAdapter),
    protected: true
  },
  {
    path: '/api/v1/songs/:id',
    method: 'PUT',
    handler: withAuthCheck(isSongOwner)(handleUpdateSongAdapter),
    protected: true
  },
  {
    path: '/api/v1/songs/:id',
    method: 'DELETE',
    handler: withAuthCheck(isSongOwner)(handleDeleteSongAdapter),
    protected: true
  }


];
