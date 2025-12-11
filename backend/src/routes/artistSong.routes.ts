// src/routes/artistSong.routes.ts
import { Elysia, t } from "elysia";
import { authGuard } from "../guards/auth.guard";

// Importación de los controladores
import {
  handleGetSongsByArtistId,
  handleGetArtistsBySongId,
  handleGetArtistsWhereSongNotExist,
} from '../controllers/artistSong.controller'; 

export const artistSongRoutes = new Elysia()
  // No prefix here, as it's defined in the file content from user
  
  .guard(
    { beforeHandle: authGuard },
    (app) => 
      app
        // 1. GET /api/v1/artists/:id/songs
        .get("/artists/:id/songs", handleGetSongsByArtistId)
        // 2. GET /api/v1/songs/:id/artists
        .get("/songs/:id/artists", handleGetArtistsBySongId)

        // 3. GET /api/v1/songs/:id/not-artists
        .get("/songs/:id/not-artists", handleGetArtistsWhereSongNotExist)
  );
