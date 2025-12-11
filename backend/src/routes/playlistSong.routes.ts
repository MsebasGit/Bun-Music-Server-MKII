import { Elysia, t } from "elysia";
// Importamos tu función de guard existente que inyecta el ID de usuario
import { authGuard } from "../guards/auth.guard"; 

// Importación ÚNICA de los controladores API
import {
  handleGetSongsByPlaylistIdController,
  handleInsertPlaylistSongController,
  handleDeletePlaylistSongController,
  handleGetPlaylistsWhereSongNotExistController
} from '../controllers/playlistSong.controller'; 

// --- API REST ROUTES ---

export const playlistSongRoutes = new Elysia()
  
  // Usamos .guard() con tu función authGuard 
  .guard(
    { beforeHandle: authGuard },
    (app) => 
      app
        // 1. GET /api/v1/playlists/:id/songs: Obtener canciones dentro de una playlist
        // Protegida por authGuard
        .get("/playlists/:id/songs", handleGetSongsByPlaylistIdController, {
          params: t.Object({
            id: t.Numeric(),
          }),
        })

        // 2. GET /api/v1/songs/:id/not-in-playlists: Obtener playlists donde NO está una canción
        // Protegida por authGuard
        .get("/songs/:id/not-in-playlists", handleGetPlaylistsWhereSongNotExistController, {
          params: t.Object({
            id: t.Numeric(),
          }),
        })

        // 3. POST /api/v1/playlists/:id/songs: Agregar una canción a una playlist
        .post("/playlists/:id/songs", handleInsertPlaylistSongController, {
          params: t.Object({
            id: t.Numeric(),
          }),
          body: t.Object({
            songId: t.Number() 
          }),
        })

        // 4. DELETE /api/v1/playlists/:id/songs/:songId: Eliminar una canción de una playlist
        // Protegida por authGuard
        .delete("/playlists/:id/songs/:songId", handleDeletePlaylistSongController, {
          params: t.Object({
            id: t.Numeric(),
            songId: t.Numeric()
          }),
        })
  );
