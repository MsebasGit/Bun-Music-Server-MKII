// src/routes/song.routes.ts
import { Elysia, t } from "elysia"; // Import 't' for validation
import { authGuard } from "../guards/auth.guard";
import { 
  handleGetSongs,
  handleCreateSong, 
  handleUpdateSong,
  handleDeleteSong
} from "../controllers/song.controller"; // Import new controller



export const songRoutes = new Elysia({ prefix: "/songs" })
  // Este 'guard' se aplica a todas las rutas definidas dentro de él.
  .guard(
    {
      beforeHandle: authGuard,
    },
    (app) =>
      app
        .get("/", handleGetSongs)
        // POST /api/v1/songs
        .post("/", handleCreateSong, {
          body: t.Object({
            title: t.String(),
            cover_image: t.File({
              type: ['image/jpeg', 'image/png', 'image/webp']
            }),
            albumId: t.Optional(t.String()),
            audio_file: t.File({
              type: ['audio/mpeg', 'audio/wav', 'audio/ogg']
            }),
            language: t.Optional(t.String()),
            genres: t.Optional(t.Array(t.String()))
          }),
        })
        
        .put("/:_id", handleUpdateSong, {
          body: t.Object({
            title: t.String(),
            cover_image: t.File({
              type: ['image/jpeg', 'image/png', 'image/webp']
            }),
            albumId: t.Optional(t.String()),
            language: t.Optional(t.String()),
            genres: t.Optional(t.Array(t.String()))
          }),
        })
        .delete("/:_id", handleDeleteSong )
  );