import { handleRequest } from '../utilities/controllerUtils';

// Importamos directamente las funciones de DB (que ahora esperan los argumentos extraídos)
// ASUNCIÓN: Esta es la ruta a tu archivo de servicios Drizzle
import {
    getSongsByPlaylistId as getSongsByPlaylistIdDb,
    getPlaylistsWhereSongNotExist as getPlaylistsWhereSongNotExistDb,
    insertPlaylistSong as insertPlaylistSongDb,
    deleteSongInPlaylist as deleteSongInPlaylistDb
} from '../services/playlistSong.service'; 

type ElysiaContext = any; 

// --- CONTROLADORES SIN WRAPPER INTERMEDIO ---

/**
 * 1. GET /api/v1/playlists/:id/songs
 */
export const handleGetSongsByPlaylistIdController = (context: ElysiaContext) => {
    
    const serviceFunction = () => {
        // Extrae el ID de la playlist del parámetro de ruta
        const id_playlist = context.params.id as number;
        return getSongsByPlaylistIdDb(id_playlist);
    };

    return handleRequest(serviceFunction, context, 200);
};


/**
 * 2. GET /api/v1/songs/:id/not-in-playlists
 */
export const handleGetPlaylistsWhereSongNotExistController = (context: ElysiaContext) => {
    
    const serviceFunction = async () => {
        // Extrae el ID de la canción del parámetro de ruta
        const id_song = context.params.id as number;
        // Obtiene el ID del usuario
        const id_user = await context.user.userId; 

        if (id_user === null) {
            throw new Error('Usuario no autenticado para esta operación.');
        }

        // Llama al servicio de DB con los dos argumentos explícitos
        return getPlaylistsWhereSongNotExistDb(id_song, id_user);
    };

    return handleRequest(serviceFunction, context, 200);
};


/**
 * 3. POST /api/v1/playlists/:playlistId/songs: Agregar una canción a una playlist
 */
export const handleInsertPlaylistSongController = (context: ElysiaContext) => {
    
    const serviceFunction = async () => {
        // Extrae IDs del parámetro de ruta y el cuerpo de la petición
        const id_playlist = context.params.playlistId as number;
        const id_song = context.body.songId as number; // Asumido desde la validación de la ruta
        
        await insertPlaylistSongDb(id_playlist, id_song);
        return { message: 'Canción añadida a la playlist con éxito.' };
    };

    return handleRequest(serviceFunction, context, 201);
};


/**
 * 4. DELETE /api/v1/playlists/:playlistId/songs/:songId: Eliminar una canción de una playlist
 */
export const handleDeletePlaylistSongController = (context: ElysiaContext) => {
    
    const serviceFunction = async () => {
        // Extrae IDs de los parámetros de ruta
        const id_playlist = context.params.playlistId as number;
        const id_song = context.params.songId as number;
        
        await deleteSongInPlaylistDb(id_playlist, id_song);
        return null; 
    };
    
    // Manejador de éxito personalizado para devolver 204 No Content
    const handleDeleteSuccess = (result: any, ctx: ElysiaContext) => {
        ctx.set.status = 204;
        return null; 
    };
    
    return handleRequest(serviceFunction, context, 204, handleDeleteSuccess);
};