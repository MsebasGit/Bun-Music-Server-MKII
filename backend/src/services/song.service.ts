// src/services/song.service.ts
import { db } from "../db";
import { songs, albums, artists, songsToArtists, NewSong } from "../db/schema";
import { eq, like, or, desc, sql } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";

// 1. CREAR CANCIÓN
export const createSong = async (data: NewSong) => {
    const result = await db.insert(songs).values(data).returning();
    return handleDrizzleResult(result, "Canción", "crear");
};

// 2. OBTENER TODAS LAS CANCIONES (con artistas)
export const getAllSongs = async () => {
    // Esta consulta es más compleja y puede que necesites ajustarla
    // Agrupa los artistas por cada canción
    const result = await db.select({
        song: songs,
        albumName: albums.name,
        artists: sql`GROUP_CONCAT(${artists.name})`.as('artists')
    })
    .from(songs)
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
    .groupBy(songs.id)
    .orderBy(desc(songs.id));
    
    return result;
};

// 3. OBTENER CANCIÓN POR ID (con detalles)
export const getSongById = async (id: number) => {
    const result = await db.select({
        song: songs,
        albumName: albums.name,
        artists: sql`GROUP_CONCAT(${artists.name})`.as('artists')
    })
    .from(songs)
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
    .where(eq(songs.id, id))
    .groupBy(songs.id);

    return handleDrizzleResult(result, "Canción", "obtener");
};

// 4. ACTUALIZAR CANCIÓN
export const updateSong = async (id: number, data: Partial<NewSong>) => {
    const result = await db.update(songs).set(data).where(eq(songs.id, id)).returning();
    return handleDrizzleResult(result, "Canción", "actualizar");
};

// 5. ELIMINAR CANCIÓN
export const deleteSong = async (id: number) => {
    const result = await db.delete(songs).where(eq(songs.id, id)).returning();
    return handleDeleteResult(result, "Canción");
};

// 6. BUSCAR CANCIONES
export const searchSongs = async (searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;
    // La búsqueda con GROUP_CONCAT y HAVING es compleja en Drizzle.
    // Una alternativa es hacer el filtro en la aplicación o con una vista/raw query.
    // Esta es una aproximación:
    const allSongs = await getAllSongs(); // Reutilizamos la función anterior
    return allSongs.filter(s => 
        s.song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.albumName && s.albumName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.artists && s.artists.toLowerCase().includes(searchTerm.toLowerCase()))
    );
};

// 7. OBTENER CANCIONES POR ÁLBUM
export const getSongsByAlbumId = async (albumId: number) => {
    return await db.select().from(songs).where(eq(songs.albumId, albumId));
};
