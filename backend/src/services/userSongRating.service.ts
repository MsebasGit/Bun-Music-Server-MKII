import { db } from "../db";
import { userSongRatings, songs, albums, artists, songsToArtists } from "../db/schema";
import { eq, and, sql, or, like } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";

export const getLikedSongsByUser = async (userId: number) => {
    const result = await db.select({
        id_song: songs.id,
        title: songs.title,
        cover_path: songs.coverPath,
        album_name: albums.name,
        artist_names: sql<string>`GROUP_CONCAT(${artists.name})`.as('artist_names')
    })
    .from(songs)
    .innerJoin(userSongRatings, eq(songs.id, userSongRatings.songId))
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
    .where(eq(userSongRatings.userId, userId))
    .groupBy(songs.id);

    return result;
};

export const searchLikedSongs = async (userId: number, searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;
    
    // Reutilizamos la lógica de unión pero con filtros
    const result = await db.select({
        id_song: songs.id,
        title: songs.title,
        cover_path: songs.coverPath,
        album_name: albums.name,
        artist_names: sql<string>`GROUP_CONCAT(${artists.name})`.as('artist_names')
    })
    .from(songs)
    .innerJoin(userSongRatings, eq(songs.id, userSongRatings.songId))
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
    .where(
        and(
            eq(userSongRatings.userId, userId),
            or(
                like(songs.title, searchPattern),
                like(albums.name, searchPattern),
                like(artists.name, searchPattern)
            )
        )
    )
    .groupBy(songs.id);

    return result;
};

export const isSongLikedByUser = async (userId: number, songId: number) => {
    const result = await db.select()
        .from(userSongRatings)
        .where(
            and(
                eq(userSongRatings.userId, userId),
                eq(userSongRatings.songId, songId)
            )
        );
    
    return { is_liked: result.length > 0 };
};

export const countLikesInSong = async (songId: number) => {
    const result = await db.select({
        count: sql<number>`count(*)`
    })
    .from(userSongRatings)
    .where(eq(userSongRatings.songId, songId));

    return { cuantity_of_likes: Number(result[0]?.count || 0) };
};

export const likeSong = async (userId: number, songId: number) => {
    // Usamos insert...onConflictDoNothing para evitar errores si ya existe
    const result = await db.insert(userSongRatings)
        .values({ userId, songId })
        .returning();
    
    return handleDrizzleResult(result, "Like", "crear");
};

export const unlikeSong = async (userId: number, songId: number) => {
    const result = await db.delete(userSongRatings)
        .where(
            and(
                eq(userSongRatings.userId, userId),
                eq(userSongRatings.songId, songId)
            )
        )
        .returning();

    return handleDeleteResult(result, "Like");
};