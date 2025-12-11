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


// DEBUG: Esto nos dirá exactamente dónde cree Bun que está
console.log("📂 Directorio de trabajo actual:", process.cwd());

// DEBUG: 


const app = new Elysia()
  // CORRECCIÓN MAESTRA:
  // Decimos: "Toma la carpeta 'public' y sirve su contenido en la raíz '/'"
  // Resultado: Petición a "/img/foto.jpg" -> Busca en "public/img/foto.jpg"
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
  )
  .get("/", () => "Welcome to Music Server API!")
  .listen(3000);

console.log(
  `🦊 Servidor Elysia corriendo en http://${app.server?.hostname}:${app.server?.port}`
);
