import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetSongsByArtistId,
  handleGetArtistsBySongId,
  handleInsertSongArtist,
  handleDeleteSongArtist,
  handleGetArtistsWhereSongNotExist
} from './../controller/songArtistController';

const NEW_SONG_ARTIST_VIEW_PATH = './static/songArtists/newSongArtistView.html';
const SONGS_ARTISTS_VIEW_PATH = './static/songArtists/songsArtistView.html'
const ME_SONGS_ARTISTS_VIEW_PATH = './static/songArtists/meSongsView.html'

export const songArtistRoutes = [
  // API de las canciones de un artista por ID
  {
    path: '/api/v1/artists/:id/songs',
    method: 'GET',
    handler: handleGetSongsByArtistId,
    protected: true
  },
  // API de los artistas de una cancion por ID
  {
    path: '/api/v1/songs/:id/artists',
    method: 'GET',
    handler: handleGetArtistsBySongId,
    protected: true
  },
  // API de los artistas donde no esta una canción por ID
  {
    path: '/api/v1/songs/:id/not-artists',
    method: 'GET',
    handler: handleGetArtistsWhereSongNotExist,
    protected: true
  },
  // Vista formulario para añadir añadir un artista a una cancion (con get)
  {
    path: '/songs/artists/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_SONG_ARTIST_VIEW_PATH),
    protected: true
  },

  // Vista de las canciones que tiene un artista por ID
  {
    path: '/artists/:id/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(SONGS_ARTISTS_VIEW_PATH),
    protected: true
  },
  {
    path: '/api/v1/songs/:id/artists',
    method: 'POST',
    handler: handleInsertSongArtist,
    protected: true
  },

  // Borrar artista de una cancion con DELETE
  {
    path: '/api/v1/artists/:id_artist/songs/:id_song',
    method: 'DELETE',
    handler: handleDeleteSongArtist,
    protected: true
  },
  // Vista de canciones de artista (para administración)
  {
    path: '/me/songs',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ME_SONGS_ARTISTS_VIEW_PATH),
    protected: true
  },
  // Vista para administrar colaboradores de una canción
  {
    path: '/songs/collaborators/manage',
    method: 'GET',
    handler: () => serveHtmlWithSidebar('./static/songArtists/manageCollaboratorsView.html'),
    protected: true
  },
];
