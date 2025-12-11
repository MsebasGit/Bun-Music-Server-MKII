import { Context } from 'elysia'; // Importamos el tipo para autocompletado
import {
    getAllSongs,
    getSongById,
    createSong,
    updateSong,
    deleteSong,
    searchSongs
} from '../services/song.service';
import { handleRequest } from '../utilities/controllerUtils';

// --- 1. GET ALL (Wrapper simple) ---
// Ignoramos el 'body' que envía handleRequest y llamamos a getAllSongs
export const handleGetSongs = (context: Context) =>
    handleRequest(() => getAllSongs(), context);


// --- 2. GET BY ID (Extracción de params) ---
// Usamos el closure para capturar el ID. 
// Nota: handleRequest pasa 'body', pero nosotros necesitamos 'params', por eso el wrapper.
export const handleGetSongById = (context: Context) =>
    handleRequest(() => getSongById(Number(context.params._id)), context);


// --- 3. CREATE (Paso Directo - El más limpio) ---
// createSong espera (body), handleRequest envía (body). ¡Match perfecto!
export const handleCreateSong = (context: Context) => {
    const artistId = (context as any).artist?.id;

    if (!artistId) {
        context.set.status = 403; // Forbidden
        return { message: "Operation failed", error: "Only artists can create songs." };
    }

    return handleRequest((body) =>
        createSong(body, artistId),
        context,
        201
    );
}


// --- 4. UPDATE (Combinación ID + Body) ---
export const handleUpdateSong = (context: Context) => {
    const artistId = (context as any).artist?.id;
    const songId = Number(context.params._id);

    if (!artistId) {
        context.set.status = 403; // Forbidden
        return { message: "Operation failed", error: "Only the artist of the song can update it." };
    }

    return handleRequest((body) => updateSong(songId, body, artistId), context);
}


// --- 5. DELETE (Solo ID) ---
export const handleDeleteSong = (context: Context) => {
    const artistId = (context as any).artist?.id;
    const songId = Number(context.params._id);

    if (!artistId) {
        context.set.status = 403; // Forbidden
        return { message: "Operation failed", error: "Only the artist of the song can delete it." };
    }

    return handleRequest(() => deleteSong(songId, artistId), context);
}


// --- 6. SEARCH (Query Params) ---
// Simplificamos la extracción del query param.
export const handleSearchSongs = (context: Context) =>
    handleRequest(() => {
        // En Elysia, puedes acceder a query params más fácil si usas el plugin, 
        // pero manteniendo tu lógica original de URL raw:
        const term = new URL(context.request.url).searchParams.get('q') || '';
        return searchSongs(term);
    }, context);