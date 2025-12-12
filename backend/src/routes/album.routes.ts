// src/routes/album.routes.ts
import { Elysia, t } from 'elysia';
import {
  handleCreateAlbum,
  handleGetAlbums,
  handleGetAlbumById,
  handleUpdateAlbum,
  handleDeleteAlbum,
  handleSearchAlbums,
} from '../controllers/album.controller';
import {handleSongsByAlbumId} from '../controllers/song.controller'
import { authGuard } from '../guards/auth.guard';

export const albumRoutes = new Elysia({ prefix: '/albums' })

  // --- Protected Routes ---
  .guard({
    beforeHandle: authGuard
  }, (app) => app
    .get('/', handleGetAlbums)
    .get('/search', handleSearchAlbums) // e.g., /api/v1/albums/search?q=name
    .get('/:id', handleGetAlbumById)
    .get('/:id/songs', handleSongsByAlbumId)

    .post('/', handleCreateAlbum, {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        cover_image: t.File({
          type: ['image/jpeg', 'image/png', 'image/webp']
        }),
      })
    })
    .put('/:id', handleUpdateAlbum, {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        cover_image: t.Optional(t.File({
          type: ['image/jpeg', 'image/png', 'image/webp']
        })),
      })
    })
    .delete('/:id', handleDeleteAlbum)
  );
