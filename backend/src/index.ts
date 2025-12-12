// src/index.ts
import "dotenv/config"; // Carga las variables de entorno
import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static';
import { authRoutes } from "./routes/auth.routes";
import { playlistRoutes } from "./routes/playlist.routes";
import { albumRoutes } from "./routes/album.routes";
import { songRoutes } from "./routes/songs.routes";
import { artistSongRoutes } from "./routes/artistSong.routes";
import { artistRoutes } from "./routes/artist.routes";
import { playlistSongRoutes } from "./routes/playlistSong.routes";
// 1. Importamos las nuevas rutas de ratings/likes
import { userSongRatingRoutes } from "./routes/userSongRating.routes";

const app = new Elysia()
  .use(staticPlugin({ 
      assets: 'public', 
      prefix: '/' 
  }))

  .group("/api/v1", (app) => 
    app
      .use(authRoutes)
      .use(playlistRoutes)
      .use(playlistSongRoutes)
      .use(albumRoutes)
      .use(songRoutes)
      .use(artistRoutes)
      .use(artistSongRoutes)
      // 2. Registramos la ruta en el grupo de la API
      .use(userSongRatingRoutes)
  )
  .get("/", () => "Welcome to Music Server API!")
  .listen(3000);

console.log(
  `🦊 Servidor Elysia corriendo en http://${app.server?.hostname}:${app.server?.port}`
);