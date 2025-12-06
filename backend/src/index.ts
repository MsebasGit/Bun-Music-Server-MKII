// src/index.ts
import "dotenv/config"; // Carga las variables de entorno
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth.routes";
import { playlistRoutes } from "./routes/playlist.routes";
import { albumRoutes } from "./routes/album.routes";

const app = new Elysia()
  // Prefijo para todas las rutas de la API
  .group("/api/v1", (app) => 
    app
      .use(authRoutes)
      .use(playlistRoutes)
      .use(albumRoutes)
  )
    // Ruta raíz para verificar que el servidor está corriendo

  
  .get("/", () => "Welcome to Music Server API!")
  
  .listen(3000);

console.log(
  `🦊 Servidor Elysia corriendo en http://${app.server?.hostname}:${app.server?.port}`
);
