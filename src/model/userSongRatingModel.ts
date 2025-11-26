import { db } from './../utilities/connectionDB';
import { type Song } from './songModel'; // Importar el tipo Song
import { executeDbQuery } from '../utilities/modelUtils';

// 1. Constante para el nombre de la tabla (DRY)
const TABLE_NAME = 'user_song_ratings';

// 2. Tipos de resultado reutilizables (DRY)
type LikeCountResult = {
    cuantity_of_likes: number;
};

type IsLikedResult = {
    is_liked: boolean;
};

// 4. Exportar funciones directamente
export {
    insertLike,
    deleteLike,
    getLikedSongsByUserId,
    isSongLikedByUser,
    countLikesInSong,
    searchLikedSongs
}

async function insertLike(
    id_user: number,
    id_song: number
): Promise<void> {
    const query = () => db.run(
        `INSERT INTO ${TABLE_NAME} (id_user, id_song)
      VALUES (?, ?)`,
        [id_user, id_song]
    )
    await executeDbQuery(query, 'Error al insertar el like');
}

async function deleteLike(id_user: number, id_song: number): Promise<void> {
    const query = () => db.run(
        `DELETE FROM ${TABLE_NAME} WHERE id_user = ? AND id_song = ?`,
        [id_user, id_song]
    )
    await executeDbQuery(query, 'Error al eliminar el like');
}

async function getLikedSongsByUserId(id_user: number): Promise<Song[]> {
    const query = () => db.query(
        `SELECT s.*,
                GROUP_CONCAT(ar.id_artist) AS artist_ids,
                GROUP_CONCAT(ar.name) AS artist_names
         FROM songs s
         JOIN ${TABLE_NAME} usr ON s.id_song = usr.id_song
         LEFT JOIN songs_artists sa ON s.id_song = sa.id_song
         LEFT JOIN artists ar ON sa.id_artist = ar.id_artist
         WHERE usr.id_user = ? AND usr.is_liked = TRUE
         GROUP BY s.id_song`
    ).all(id_user) as Song[];
    return executeDbQuery(query, 'Error al obtener las canciones que le gustan al usuario');
}

async function searchLikedSongs(userId: number, searchTerm: string): Promise<Song[]> {
    const searchPattern = `%${searchTerm}%`;
    const query = () => db.query(
        `SELECT s.*,
                GROUP_CONCAT(DISTINCT ar.id_artist) AS artist_ids,
                GROUP_CONCAT(DISTINCT ar.name) AS artist_names,
                a.name AS album_name
         FROM songs s
         JOIN ${TABLE_NAME} usr ON s.id_song = usr.id_song
         LEFT JOIN albums a ON s.id_album = a.id_album
         LEFT JOIN songs_artists sa ON s.id_song = sa.id_song
         LEFT JOIN artists ar ON sa.id_artist = ar.id_artist
         WHERE usr.id_user = ? AND usr.is_liked = TRUE
         GROUP BY s.id_song
         HAVING s.title LIKE ?
            OR s.language LIKE ?
            OR s.genre LIKE ?
            OR a.name LIKE ?
            OR GROUP_CONCAT(DISTINCT ar.name) LIKE ?
         ORDER BY s.title ASC`
    ).all(
        userId,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
    ) as Song[];
    return executeDbQuery(query, 'Error al buscar canciones que le gustan al usuario');
}

async function isSongLikedByUser(id_user: number, id_song: number): Promise<IsLikedResult> {
    const query = () => db.query(
        `SELECT is_liked FROM ${TABLE_NAME} WHERE id_user = ? AND id_song = ?`
        // Se usa el tipo y se añade | null para un cast más seguro
    ).get(id_user, id_song) as IsLikedResult | null;

    const result = await executeDbQuery(query, 'Error al verificar si la canción tiene like');

    // 3. Lógica corregida y limpia
    return { is_liked: result?.is_liked ?? false };
}

async function countLikesInSong(id_song: number): Promise<{ cuantityOfLikes: number }> {
    const query = () => db.query(
        `SELECT COUNT(*) as cuantity_of_likes FROM user_song_ratings WHERE id_song = ? AND is_liked = TRUE`
    ).get(id_song) as { cuantityOfLikes: number };
    const result = await executeDbQuery(query, 'Error al contar los likes de la canción');
    return result ?? { cuantityOfLikes: 0 };
}