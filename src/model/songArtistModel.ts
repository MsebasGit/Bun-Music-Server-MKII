import { db } from './../utilities/connectionDB';
import { type Song } from './songModel';
import { executeDbQuery } from '../utilities/modelUtils';
import type { Artist } from './artistModel';

export {
    insertSongArtist,
    getSongsByArtistId,
    getArtistsBySongId,
    deleteSongArtist,
    getArtistsWhereSongNotExist
}

async function insertSongArtist(
  id_artist: number, 
  id_song: number
): Promise<void> {
  const query = () => db.run(
    `INSERT INTO songs_artists (id_artist, id_song)
     VALUES (?, ?)`,
    [id_artist, id_song]
  );
  await executeDbQuery(query, 'Error al insertar en songs_artists');
}

async function getSongsByArtistId(id_artist: number): Promise<Song[]> {
    const query = () => db.query(
        `SELECT s.* 
         FROM songs s
         JOIN songs_artists sa ON s.id_song = sa.id_song
         WHERE sa.id_artist = ?`
    ).all(id_artist) as Song[];
    return executeDbQuery(query, 'Error al obtener las canciones del artista');
}

async function getArtistsBySongId(id_song: number, id_artist_to_exclude?: number): Promise<Artist[]> {
    let sql = `
        SELECT a.*
        FROM artists a
        JOIN songs_artists sa ON a.id_artist = sa.id_artist
        WHERE sa.id_song = ?
    `;
    const params: (number)[] = [id_song];

    if (id_artist_to_exclude !== undefined && id_artist_to_exclude !== null) {
        sql += ` AND a.id_artist != ?`;
        params.push(id_artist_to_exclude);
    }

    const query = () => db.query(sql).all(...params) as Artist[];
    return executeDbQuery(query, 'Error al obtener los artistas de la canción');
}

async function getArtistsWhereSongNotExist(id_song: number): Promise<Artist[]> {
    const query = () => db.query(
        `SELECT
          a.*
        FROM
          artists AS a
        WHERE
          a.id_artist NOT IN (
            SELECT
              id_artist
            FROM
              songs_artists
            WHERE
             id_song = ?);`
    ).all(id_song) as Artist[];
    return executeDbQuery(query, 'Error al obtener los artistas donde la cancion no existe');
}

async function deleteSongArtist(id_artist: number, id_song: number): Promise<void> {
    const query = () => db.run(
        `DELETE FROM songs_artists WHERE id_artist = ? AND id_song = ?`,
        [id_artist, id_song]
    );
    await executeDbQuery(query, 'Error al eliminar la canción del artista');
}