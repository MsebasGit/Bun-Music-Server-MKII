// src/controllers/artist.controller.ts
import { Context } from 'elysia';
import {
    createArtist,
    getAllArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
    searchArtists
} from '../services/artist.service';
import { getSongsByArtistId } from '../services/songArtist.service';
import { handleRequest } from '../utilities/controllerUtils';

// 1. OBTENER TODOS LOS ARTISTAS
export const handleGetAllArtists = (context: Context) =>
    handleRequest(getAllArtists, context);

// 2. OBTENER ARTISTA POR ID
export const handleGetArtistById = (context: Context) =>
    handleRequest(() => getArtistById(Number(context.params.id)), context);

// 3. CREAR UN ARTISTA
// Un usuario autenticado puede crear un perfil de artista para sí mismo.
export const handleCreateArtist = (context: Context) => {
    const userId = (context as any).user?.userId;
    if (!userId) {
        context.set.status = 401;
        return { message: "Operation failed", error: "Authentication required to create an artist profile." };
    }
    
    // Añadimos el userId del token al body que se pasará al servicio
    return handleRequest((body) => createArtist({ ...body, userId }), context, 201);
}

// 4. ACTUALIZAR UN ARTISTA
// Solo el usuario asociado al artista puede actualizarlo.
export const handleUpdateArtist = (context: Context) => {
    const userId = (context as any).user?.userId;
    const artistIdToUpdate = Number(context.params.id);

    if (!userId) {
        context.set.status = 401;
        return { message: "Operation failed", error: "Authentication required." };
    }
    
    // La lógica de autorización (verificar que userId corresponde a artistIdToUpdate)
    // se delegará al servicio `updateArtist` para mantener el controlador limpio.
    return handleRequest((body) => updateArtist(artistIdToUpdate, body, userId), context);
}

// 5. ELIMINAR UN ARTISTA
// Solo el usuario asociado puede eliminarlo.
export const handleDeleteArtist = (context: Context) => {
    const userId = (context as any).user?.userId;
    const artistIdToDelete = Number(context.params.id);

    if (!userId) {
        context.set.status = 401;
        return { message: "Operation failed", error: "Authentication required." };
    }

    // La lógica de autorización también se delega al servicio.
    return handleRequest(() => deleteArtist(artistIdToDelete, userId), context);
}

// 6. BUSCAR ARTISTAS
export const handleSearchArtists = (context: Context) => {
    const term = new URL(context.request.url).searchParams.get('q') || '';
    return handleRequest(() => searchArtists(term), context);
}

// 7. OBTENER CANCIONES DE UN ARTISTA
export const handleGetArtistSongs = (context: Context) => {
    const artistId = Number(context.params.id);
    return handleRequest(() => getSongsByArtistId(artistId), context);
}
