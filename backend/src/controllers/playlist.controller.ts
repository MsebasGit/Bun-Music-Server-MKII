import { Context } from 'elysia';
import { 
  getPlaylistsByUserId, 
  createPlaylist,
  deletePlaylist,
  updatePlaylist
} from '../services/playlist.service';
import { handleRequest } from '../utilities/controllerUtils';

// Nota sobre TypeScript: Usamos (context as any) para acceder a .user 
// porque esa propiedad la inyecta tu plugin de autenticación (Derive).

// --- 1. GET MY PLAYLISTS ---
// Extraemos userId del contexto y llamamos al servicio.
export const handleGetMyPlaylists = (context: Context) => 
  handleRequest(() => {
    // Si tienes tipos personalizados para user, quita el 'as any'
    const userId = (context as any).user.userId; 
    return getPlaylistsByUserId(userId);
  }, context);


// --- 2. CREATE PLAYLIST ---
// Aquí necesitamos mezclar el 'body' que viene de la petición
// con el 'userId' que viene del token de seguridad.
export const handleCreatePlaylist = (context: Context) => 
  handleRequest((body) => 
    createPlaylist(body, (context as any).user.userId), 
    context, 
    201
  );


// --- 3. DELETE PLAYLIST ---
// Igual que antes: extraemos ID de la URL y ejecutamos.
export const handleDeletePlaylist = (context: Context) => 
  handleRequest(() => deletePlaylist(Number(context.params.id)), context);


// --- 4. UPDATE PLAYLIST ---
// Combinamos ID de la URL + Body.
export const handleUpdatePlaylist = (context: Context) => 
  handleRequest((body) => updatePlaylist(Number(context.params.id), body), context);