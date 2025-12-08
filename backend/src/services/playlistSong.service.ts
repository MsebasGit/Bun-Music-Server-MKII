// src/services/playlistSong.service.ts
import { db } from "../db";
import { playlistsToSongs, songs, playlists } from "../db/schema";
import { eq, and, notExists } from "drizzle-orm";

/**
 * Añade una canción a una playlist.
 */
export const addSongToPlaylist = async (playlistId: number, songId: number) => {
    const result = await db.insert(playlistsToSongs)
        .values({ playlistId, songId })
        .returning();
    if (result.length === 0) {
        throw new Error("No se pudo añadir la canción a la playlist.");
    }
    return { message: "Canción añadida correctamente." };
};

/**
 * Obtiene todas las canciones de una playlist específica.
 */
export const getSongsByPlaylistId = async (playlistId: number) => {
    const result = await db.select({
        id: songs.id,
        title: songs.title,
        language: songs.language,
        duration: songs.duration,
        releaseDate: songs.releaseDate,
        //... y otros campos de 'songs' que necesites
    })
    .from(songs)
    .innerJoin(playlistsToSongs, eq(songs.id, playlistsToSongs.songId))
    .where(eq(playlistsToSongs.playlistId, playlistId));
    
    return result;
};

/**
 * Obtiene las playlists de un usuario donde una canción específica NO existe.
 */
export const getPlaylistsWhereSongNotExists = async (songId: number, userId: number) => {
    return await db.select()
        .from(playlists)
        .where(and(
            eq(playlists.userId, userId),
            notExists(
                db.select()
                .from(playlistsToSongs)
                .where(and(
                    eq(playlistsToSongs.playlistId, playlists.id),
                    eq(playlistsToSongs.songId, songId)
                ))
            )
        ));
};

/**
 * Elimina una canción de una playlist.
 */
export const removeSongFromPlaylist = async (playlistId: number, songId: number) => {
    const result = await db.delete(playlistsToSongs)
        .where(and(
            eq(playlistsToSongs.playlistId, playlistId),
            eq(playlistsToSongs.songId, songId)
        ))
        .returning();

    if (result.length === 0) {
        throw new Error("La canción no existe en la playlist o no se pudo eliminar.");
    }
    return { message: "Canción eliminada de la playlist correctamente." };
};
