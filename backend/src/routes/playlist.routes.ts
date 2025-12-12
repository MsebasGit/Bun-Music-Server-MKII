// src/routes/playlist.routes.ts
import { Elysia, t } from "elysia"; // Import 't' for validation
import { authGuard } from "../guards/auth.guard";
import { 
  handleCreatePlaylist, 
  handleGetMyPlaylists,
  handleUpdatePlaylist,
  handleDeletePlaylist,
  handleSearchPlaylist
} from "../controllers/playlist.controller"; // Import new controller

export const playlistRoutes = new Elysia({ prefix: "/playlists" })
  // Este 'guard' se aplica a todas las rutas definidas dentro de él.
  .guard(
    {
      beforeHandle: authGuard,
    },
    (app) =>
      app
        // GET /api/v1/playlists/me
        .get("/me", handleGetMyPlaylists)
        .get('/search', handleSearchPlaylist)
        // POST /api/v1/playlists
        .post("/", handleCreatePlaylist, {
          body: t.Object({
            name: t.String(),
            description: t.Optional(t.String()),
          }),
        })
        .put("/:id", handleUpdatePlaylist, {
          body: t.Object({
            name: t.Optional(t.String()),
            description: t.Optional(t.String()),
          }),
        })
        .delete("/:id", handleDeletePlaylist )
  );
