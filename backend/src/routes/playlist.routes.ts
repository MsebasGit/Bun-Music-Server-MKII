// src/routes/playlist.routes.ts
import { Elysia, t } from "elysia"; // Import 't' for validation
import { authGuard } from "../guards/auth.guard";
import { getMyPlaylistsController, createPlaylistController } from "../controllers/playlist.controller"; // Import new controller

export const playlistRoutes = new Elysia({ prefix: "/playlists" })
  // Este 'guard' se aplica a todas las rutas definidas dentro de él.
  .guard(
    {
      beforeHandle: authGuard,
    },
    (app) =>
      app
        // GET /api/v1/playlists/me
        .get("/me", getMyPlaylistsController)
        // POST /api/v1/playlists
        .post("/", createPlaylistController, {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
          }),
        })
  );
