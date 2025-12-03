import {
  handleGetAllPlaylists,
  handleGetPlaylistById,
  handleInsertPlaylist,
  handleUpdatePlaylist,
  handleDeletePlaylist
} from './../controller/playlistController';

// NOTA: Ya no importamos 'serveHtmlWithSidebar' ni las rutas de los HTML files.
// Svelte se encarga de eso ahora.

export const playlistRoutes = [
  // 1. GET Todas (JSON) - MANTENER
  {
    path: '/api/v1/playlists',
    method: 'GET',
    handler: handleGetAllPlaylists,
    protected: true
  },
  
  // 2. CREAR (JSON) - MANTENER
  {
    path: '/api/v1/playlists',
    method: 'POST',
    handler: handleInsertPlaylist,
    protected: true
  },

  // 4. EDITAR (JSON) - MANTENER
  {
    path: '/api/v1/playlists/:id',
    method: 'PUT',
    handler: handleUpdatePlaylist,
    protected: true
  },

  // 5. BORRAR (JSON) - MANTENER
  {
    path: '/api/v1/playlists/:id',
    method: 'DELETE',
    handler: handleDeletePlaylist,
    protected: true
  }

];

// RESUMEN:
// Borramos: /playlists/new, /playlists, /playlists/:id/edit
// Porque esas rutas ahora son "Paginas virtuales" en el frontend.