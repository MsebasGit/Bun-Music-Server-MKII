// src/services/userSongRating.service.ts
import { db } from "../db";
import { userSongRatings, songs, artists, songsToArtists, albums } from "../db/schema";
import { eq, and, sql, count, desc, like, or } from "drizzle-orm";

// 1. DAR LIKE A UNA CANCIÓN (INSERT/UPDATE)
export const likeSong = async (userId: number, songId: number) => {
    // Intenta insertar. Si ya existe, actualiza 'isLiked' a true.
    // Esto requiere una lógica de "upsert" que puede variar según la DB.
    // Para SQLite, una forma es intentar una actualización y si no, insertar.
    const existing = await db.select().from(userSongRatings)
        .where(and(eq(userSongRatings.userId, userId), eq(userSongRatings.songId, songId)));

    if (existing.length > 0) {
        await db.update(userSongRatings)
            .set({ isLiked: true })
            .where(and(eq(userSongRatings.userId, userId), eq(userSongRatings.songId, songId)));
    } else {
        await db.insert(userSongRatings).values({ userId, songId, isLiked: true });
    }
    return { message: "Like añadido correctamente." };
};

// 2. QUITAR LIKE A UNA CANCIÓN (UPDATE)
export const unlikeSong = async (userId: number, songId: number) => {
    // Simplemente actualiza 'isLiked' a false
    const result = await db.update(userSongRatings)
        .set({ isLiked: false })
        .where(and(eq(userSongRatings.userId, userId), eq(userSongRatings.songId, songId)))
        .returning();
    
    if (result.length === 0) {
        throw new Error("La canción no tenía like o no se pudo quitar.");
    }
    return { message: "Like quitado correctamente." };
};

// 3. OBTENER CANCIONES CON LIKE DE UN USUARIO
export const getLikedSongsByUser = async (userId: number) => {
    return await db.select({
        song: songs,
        artists: sql`GROUP_CONCAT(${artists.name})`.as('artists')
    })
    .from(songs)
    .innerJoin(userSongRatings, eq(songs.id, userSongRatings.songId))
    .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
    .where(and(
        eq(userSongRatings.userId, userId),
        eq(userSongRatings.isLiked, true)
    ))
    .groupBy(songs.id)
    .orderBy(desc(userSongRatings.interactionDate));
};

// 4. VERIFICAR SI UN USUARIO HA DADO LIKE A UNA CANCIÓN
export const isSongLikedByUser = async (userId: number, songId: number) => {
    const result = await db.select().from(userSongRatings)
        .where(and(
            eq(userSongRatings.userId, userId),
            eq(userSongRatings.songId, songId),
            eq(userSongRatings.isLiked, true)
        ));
    return result.length > 0;
};

// 5. CONTAR LIKES DE UNA CANCIÓN
export const countLikesInSong = async (songId: number) => {
    const result = await db.select({
        likes: count(userSongRatings.userId)
    })
    .from(userSongRatings)
    .where(and(
        eq(userSongRatings.songId, songId),
        eq(userSongRatings.isLiked, true)
    ));
    
    return result[0]?.likes ?? 0;
};

// 6. BUSCAR EN CANCIONES CON LIKE
export const searchLikedSongs = async (userId: number, searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;

    // Similar al otro search, es complejo. Filtramos en la app.
    const likedSongs = await getLikedSongsByUser(userId);
    return likedSongs.filter(s => 
        s.song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.artists && s.artists.toLowerCase().includes(searchTerm.toLowerCase()))
    );
}
