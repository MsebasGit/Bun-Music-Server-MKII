// src/controllers/album.controller.ts
import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from '../services/album.service'; 
import { handleRequest } from '../utilities/controllerUtils';

// Corregido: Usamos 'any' para el contexto de Elysia. 
// Esto resuelve los errores de incompatibilidad de tipos entre rutas 
// (ya que POST espera un 'body' con File, y GET/DELETE esperan 'params' sin 'body').
type ElysiaContext = any; 

/**
 * 1. Crear Álbum (POST /albums)
 * Delega la lógica de validación, subida de archivos y DB al servicio.
 */
export const createAlbumController = (context: ElysiaContext) => 
  handleRequest(createAlbum, context, 201);

/**
 * 2. Obtener Todos los Álbumes (GET /albums)
 */
export const getAlbumsController = (context: ElysiaContext) => 
  handleRequest(getAlbums, context, 200);

/**
 * 3. Obtener Álbum por ID (GET /albums/:id)
 */
export const getAlbumByIdController = (context: ElysiaContext) => 
  handleRequest(getAlbumById, context, 200);

/**
 * 4. Actualizar Álbum (PUT /albums/:id)
 */
export const updateAlbumController = (context: ElysiaContext) => 
  handleRequest(updateAlbum, context, 200);

/**
 * 5. Eliminar Álbum (DELETE /albums/:id)
 * Se usa un manejador de éxito personalizado para devolver un mensaje claro.
 */
export const deleteAlbumController = (context: ElysiaContext) => {
    // Manejador de éxito personalizado
    const handleDeleteSuccess = (result: any, ctx: ElysiaContext) => {
        ctx.set.status = 200;
        // La URL usa 'id', que es lo que está en ctx.params
        return { message: `Album with ID ${ctx.params.id} deleted successfully` }; 
    };

    return handleRequest(deleteAlbum, context, 200, handleDeleteSuccess);
};