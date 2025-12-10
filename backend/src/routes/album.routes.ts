// src/routes/albums.routes.ts
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
// Importamos todos los controladores como un objeto para usarlos como handlers
import {
  handleCreateAlbum
} from "../controllers/album.controller"; 

// Configuración del JWT
const jwtPlugin = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET as string,
  exp: "7d",
});

export const albumRoutes = new Elysia({ prefix: "/albums" })
  .use(jwtPlugin)
  
  // Middleware para verificar autenticación
  .onBeforeHandle(async ({ jwt, headers, set }) => {
    // ... (Lógica de verificación de JWT sin cambios)
    const authHeader = headers["authorization"];
    if (!authHeader) {
      set.status = 401;
      return "Unauthorized: Missing token";
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      set.status = 401;
      return "Unauthorized: Invalid token format";
    }

    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = 401;
      return "Unauthorized: Invalid or expired token";
    }
  })

  // --- Rutas CRUD ---

  // POST /albums: Crear un nuevo álbum y subir archivo
  // Usamos una función de flecha para forzar a Elysia a inferir el contexto (con body: File)
  .post("/", (context) => createAlbumController(context), { 
    body: t.Object({
      name: t.String({ minLength: 1 }),
      release_date: t.String({ format: "date" }),
      // CAMBIO CLAVE: Usamos t.String() para que Elysia lo acepte como cadena
      id_artist: t.String(), 
      cover_image: t.File({
        type: ['image/jpeg', 'image/png', 'image/webp']
      }),
    }),
  })

  // GET /albums: Obtener todos los álbumes
  .get("/", (context) => getAlbumsController(context)) // <--- Envoltorio para inferir contexto sin params

  // GET /albums/:id: Obtener un álbum específico
  .get("/:id", (context) => getAlbumByIdController(context), { // <--- Envoltorio para inferir contexto con params
    params: t.Object({
      id: t.Numeric(), 
    }),
  })

  // PUT /albums/:id: Actualizar un álbum
  .put("/:id", (context) => updateAlbumController(context), { // <--- Envoltorio para inferir contexto con params y body opcional
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      release_date: t.Optional(t.String({ format: "date" })),
      id_artist: t.Optional(t.Number()),
    }),
  })

  // DELETE /albums/:id: Eliminar un álbum
  .delete("/:id", (context) => deleteAlbumController(context), { // <--- Envoltorio para inferir contexto con params y sin body
    params: t.Object({
      id: t.Numeric(),
    }),
  });