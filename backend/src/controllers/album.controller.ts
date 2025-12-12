// src/controllers/album.controller.ts
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  searchAlbums,
  getAlbumsByArtistId,
} from '../services/album.service';
import { handleRequest } from '../utilities/controllerUtils';
import { Context } from 'elysia';

/**
 * 1. Crear Álbum (POST /albums)
 */
export const handleCreateAlbum = (context: Context) => {
  // The artistId should be available from the auth guard
  const artistId = (context as any).artist?.id;
  if (!artistId) {
    context.set.status = 403; // Forbidden
    return { message: "Operation failed", error: "User is not an artist or not authenticated." };
  }
  return handleRequest(() => createAlbum(artistId, context.body), context, 201);
}

/**
 * 2. Obtener Todos los Álbumes (GET /albums)
 */
export const handleGetAlbums = (context: Context) =>
  handleRequest(getAlbums, context);

/**
 * 3. Obtener Álbum por ID (GET /albums/:id)
 */
export const handleGetAlbumById = (context: Context) =>
  handleRequest(() => getAlbumById(Number(context.params.id)), context);

/**
 * 4. Actualizar Álbum (PUT /albums/:id)
*/
export const handleUpdateAlbum = (context: Context) => {
  const artistId = (context as any).artist?.id;
  const albumId = Number(context.params.id);
  if (!artistId) {
    context.set.status = 403; // Forbidden
    return { message: "Operation failed", error: "Only the artist of the album can update it." };
  }

  return handleRequest((body) => updateAlbum(albumId, body), context);
}

/**
 * 5. Eliminar Álbum (DELETE /albums/:id)
 */
export const handleDeleteAlbum = (context: Context) => {
  const artistId = (context as any).artist?.id;
  const albumId = Number(context.params.id);

  if (!artistId) {
    context.set.status = 403; // Forbidden
    return { message: "Operation failed", error: "Only the artist of the song can delete it." };
  }
  return handleRequest(() => deleteAlbum(albumId), context);
};

/**
 * 6. Buscar Álbumes (GET /albums/search)
 */
export const handleSearchAlbums = (context: Context) => {
  const term = new URL(context.request.url).searchParams.get('term') || '';
  return handleRequest(() => searchAlbums(term), context);
}

/**
 * 7. Obtener Álbumes por Artista (GET /artists/:id/albums)
 */
export const handleGetAlbumsByArtist = (context: Context) => {
  const artistId = Number(context.params.id);
  return handleRequest(() => getAlbumsByArtistId(artistId), context);
}
