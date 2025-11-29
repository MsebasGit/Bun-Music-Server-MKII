import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetSongsByArtistId,
  handleGetArtistsBySongId,
  handleInsertSongArtist,
  handleDeleteSongArtist,
  handleGetArtistsWhereSongNotExist
} from './../controller/songArtistController';

const NEW_SONG_ARTIST_VIEW_PATH = './static/songArtists/newSongArtistView.html';
const SONGS_ARTISTS_VIEW_PATH = './static/songArtists/songsArtistView.html';
const ME_SONGS_ARTISTS_VIEW_PATH = './static/songArtists/meSongsView.html';
const MANAGE_COLLABORATORS_VIEW_PATH = './static/songArtists/manageCollaboratorsView.html';

export const songArtistRoutes = [
  // API: canciones de un artista por ID
  {
    path: '/api/v1/artists/:id/songs',
    method: 'GET',
    handler: handleGetSongsByArtistId,
    protected: true
  },

  // API: artistas de una canción por ID
  {
    path: '/api/v1/songs/:id/artists',
    method: 'GET',
    handler: handleGetArtistsBySongId,
    protected: true
  },

  // API: artistas donde NO está una canción por ID
  {
    path: '/api/v1/songs/:id/not-artists',
    method: 'GET',
    handler: handleGetArtistsWhereSongNotExist,
    protected: true
  },

  // Vista: formulario para añadir un artista a una canción
  {
    path: '/songs/artists/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_SONG_ARTIST_VIEW_PATH),
    protected: true
  },

  // Agregar artista a canción (POST)
  {
    path: '/api/v1/songs/:id/artists',
    method: 'POST',
    handler: handleInsertSongArtist,
    protected: true
  },

  // Vista: canciones de un artista por ID
  {
    path: '/artists/:id/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(SONGS_ARTISTS_VIEW_PATH),
    protected: true
  },

  // Eliminar artista de una canción (DELETE)
  {
    path: '/api/v1/artists/:id_artist/songs/:id_song',
    method: 'DELETE',
    handler: handleDeleteSongArtist,
    protected: true
  },

  // Vista: canciones del artista que administra (usuario logueado)
  {
    path: '/me/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ME_SONGS_ARTISTS_VIEW_PATH),
    protected: true
  },

  // Vista: administración de colaboradores de una canción
  {
    path: '/songs/collaborators/manage',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(MANAGE_COLLABORATORS_VIEW_PATH),
    protected: true
  }
];
