// src/services/songArtist.service.ts
import { db } from "../db";
import { songsToArtists, songs, artists } from "../db/schema";
import { eq, and, notInArray } from "drizzle-orm";

/**
 * Asigna un artista a una canción.
 */
export const addArtistToSong = async (songId: number, artistId: number) => {
    const result = await db.insert(songsToArtists)
        .values({ songId, artistId })
        .returning();
    if (result.length === 0) {
        throw new Error("No se pudo asignar el artista a la canción.");
    }
    return { message: "Artista asignado correctamente." };
};

/**
 * Obtiene todas las canciones de un artista específico.
 */
export const getSongsByArtistId = async (artistId: number) => {
    return await db.select({
        id: songs.id,
        title: songs.title,
        // ... otros campos de 'songs'
    })
    .from(songs)
    .innerJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .where(eq(songsToArtists.artistId, artistId));
};

/**
 * Obtiene todos los artistas de una canción, con exclusión opcional.
 */
export const getArtistsBySongId = async (songId: number, excludeArtistId?: number) => {
    let query = db.select({
        id: artists.id,
        name: artists.name,
        // ... otros campos de 'artists'
    })
    .from(artists)
    .innerJoin(songsToArtists, eq(artists.id, songsToArtists.artistId))
    .where(eq(songsToArtists.songId, songId))
    .$dynamic(); // Permite añadir condiciones dinámicamente

    if (excludeArtistId) {
        query = query.where(eq(artists.id, excludeArtistId));
    }
    
    return await query;
};

/**
 * Obtiene artistas que NO están asignados a una canción específica.
 */
export const getArtistsNotOnSong = async (songId: number) => {
    // Subquery para obtener los IDs de los artistas que SÍ están en la canción
    const subquery = db.select({ artistId: songsToArtists.artistId })
        .from(songsToArtists)
        .where(eq(songsToArtists.songId, songId));

    // Query principal para obtener los artistas cuyo ID no está en la subquery
    return await db.select()
        .from(artists)
        .where(notInArray(artists.id, subquery));
};


/**
 * Elimina la asignación de un artista a una canción.
 */
export const removeArtistFromSong = async (songId: number, artistId: number) => {
    const result = await db.delete(songsToArtists)
        .where(and(
            eq(songsToArtists.songId, songId),
            eq(songsToArtists.artistId, artistId)
        ))
        .returning();

    if (result.length === 0) {
        throw new Error("El artista no estaba asignado a esta canción o no se pudo eliminar.");
    }
    return { message: "Artista desasignado correctamente." };
};
