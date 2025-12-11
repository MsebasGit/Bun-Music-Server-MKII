// src/routes/artist.routes.ts
import { Elysia, t } from 'elysia';
import {
    handleGetAllArtists,
    handleGetArtistById,
    handleCreateArtist,
    handleUpdateArtist,
    handleDeleteArtist,
    handleSearchArtists
} from '../controllers/artist.controller';
import { handleGetAlbumsByArtist } from '../controllers/album.controller';
import { authGuard } from '../guards/auth.guard';

export const artistRoutes = new Elysia({ prefix: '/artists' })
    // --- Rutas Públicas ---
    .get('/', handleGetAllArtists)
    .get('/search', handleSearchArtists) // e.g., /api/v1/artists/search?q=nombre
    .get('/:id', handleGetArtistById)
    .get('/:id/albums', handleGetAlbumsByArtist, {
        params: t.Object({
            id: t.Numeric()
        })
    })

    // --- Rutas Protegidas ---
    .guard({
        beforeHandle: authGuard
    }, (app) => app
        .post('/', handleCreateArtist, {
            body: t.Object({
                name: t.String({ minLength: 2, maxLength: 100 }),
                nationality: t.Optional(t.String()),
                biography: t.Optional(t.String()),
                debutDate: t.Optional(t.String()), // Formato YYYY-MM-DD
                socialLinks: t.Optional(t.Array(t.Object({
                    name: t.String(),
                    url: t.String()
                })))
            })
        })
        .put('/:id', handleUpdateArtist, {
            body: t.Object({
                name: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
                nationality: t.Optional(t.String()),
                biography: t.Optional(t.String()),
                debutDate: t.Optional(t.String()),
                socialLinks: t.Optional(t.Array(t.Object({
                    name: t.String(),
                    url: t.String()
                })))
            })
        })
        .delete('/:id', handleDeleteArtist)
    );