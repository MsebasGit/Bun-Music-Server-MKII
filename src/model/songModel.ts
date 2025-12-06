import { db } from './../utilities/connectionDB';
import { executeDbQuery } from '../utilities/modelUtils';

export {
  insertSong,
  getAllSongs,
  getSongByID,
  updateSong,
  deleteSong,
  getSongsByAlbumId,
  searchSongs
};

export type { Song };

type Song = {
  id_song: number;
  title: string;
  language: string;
  release_date: string;
  duration: number;
  genre: string;
  song_path: string;
  cover_path: string;
  id_album: number;
  album_name?: string; // Added for album name
  artist_ids?: string;
  artist_names?: string;
};

async function searchSongs(searchTerm: string): Promise<Song[]> {
  const searchPattern = `%${searchTerm}%`;
  const query = () => db.query(
    `SELECT s.*, a.name AS album_name,
            GROUP_CONCAT(DISTINCT ar.id_artist) AS artist_ids,
            GROUP_CONCAT(DISTINCT ar.name) AS artist_names
     FROM songs s
     LEFT JOIN albums a ON s.id_album = a.id_album
     LEFT JOIN songs_artists sa ON s.id_song = sa.id_song
     LEFT JOIN artists ar ON sa.id_artist = ar.id_artist
     GROUP BY s.id_song
     HAVING s.title LIKE ?
        OR s.language LIKE ?
        OR s.genre LIKE ?
        OR a.name LIKE ?
        OR GROUP_CONCAT(DISTINCT ar.name) LIKE ?
     ORDER BY s.title ASC`
  ).all(
    searchPattern,
    searchPattern,
    searchPattern,
    searchPattern,
    searchPattern
  ) as Song[];
  return executeDbQuery(query, 'Error al buscar canciones');
}

async function insertSong(
  title: string,
  language: string,
  duration: number,
  genre: string,
  song_path: string,
  cover_path: string,
  id_album: number | null
): Promise<number> {
  const query = () => {
    // Inserta la canción y obtiene el ID con lastInsertRowid
    const stmt = db.prepare(
      `INSERT INTO songs (title, language, release_date, duration, genre, song_path, cover_path, id_album)
       VALUES (?, ?, strftime('%Y-%m-%d %H:%M:%S', 'now'), ?, ?, ?, ?, ?)`
    );
    const result = stmt.run(title, language, duration, genre, song_path, cover_path, id_album);
    return result.lastInsertRowid as number;
  };
  return executeDbQuery(query, 'Error al insertar canción');
}

async function getAllSongs(): Promise<Song[]> {
  const query = () => db.query(
    `SELECT s.*, 
            GROUP_CONCAT(ar.id_artist) AS artist_ids,
            GROUP_CONCAT(ar.name) AS artist_names
     FROM songs s
     LEFT JOIN songs_artists sa ON s.id_song = sa.id_song
     LEFT JOIN artists ar ON sa.id_artist = ar.id_artist
     GROUP BY s.id_song
     ORDER BY id_song DESC`
  ).all() as Song[];
  return executeDbQuery(query, 'Error al obtener todas las canciones');
}

async function getSongsByAlbumId(id: number): Promise<Song[]> {
  const query = () => db.query(
    `SELECT s.*,
            GROUP_CONCAT(ar.id_artist) AS artist_ids,
            GROUP_CONCAT(ar.name) AS artist_names
     FROM songs s
     LEFT JOIN songs_artists sa ON s.id_song = sa.id_song
     LEFT JOIN artists ar ON sa.id_artist = ar.id_artist
     WHERE s.id_album = ?
     GROUP BY s.id_song
     ORDER BY id_song DESC`
  ).all(id) as Song[];
  return executeDbQuery(query, 'Error al obtener todas las canciones de un album');
}

async function getSongByID(id: number): Promise<Song | null> {
  const query = () => db.query(
    `SELECT s.*, a.name AS album_name,
            GROUP_CONCAT(ar.id_artist) AS artist_ids,
            GROUP_CONCAT(ar.name) AS artist_names
     FROM songs s
     LEFT JOIN albums a ON s.id_album = a.id_album
     LEFT JOIN songs_artists sa ON s.id_song = sa.id_song
     LEFT JOIN artists ar ON sa.id_artist = ar.id_artist
     WHERE s.id_song = ?
     GROUP BY s.id_song`
  ).get(id) as Song | null;
  return executeDbQuery(query, 'Error al obtener una canción');
}
/*
async function updateSong(
  id: number,
  title: string,
  language: string,
  duration: number,
  genre: string,
  song_path: string,
  cover_path: string,
  id_album: number | null
): Promise<void> {
  const query = () => db.run(
    `UPDATE songs 
     SET title = ?, language = ?, duration = ?, genre = ?, song_path = ?, cover_path = ?, id_album = ?
     WHERE id_song = ?`,
    [
      title,
      language,
      duration,
      genre,
      song_path,
      cover_path,
      id_album,
      id
    ]
  );
  await executeDbQuery(query, 'Error al actualizar canción');
}
*/

async function updateSong(
  id: number,
  title: string,
  language: string,
  duration: number,
  genre: string,
  song_path: string,
  cover_path: string,
  id_album: number | null
): Promise<void> {
  const query = () => db.run(
    `UPDATE songs 
     SET title = ?, language = ?, duration = ?, genre = ?, song_path = ?, cover_path = ?, id_album = ?
     WHERE id_song = ?`,
    [
      title,
      language,
      duration,
      genre,
      song_path,
      cover_path,
      id_album,
      id
    ]
  );
  await executeDbQuery(query, 'Error al actualizar canción');
}

async function deleteSong(id: number): Promise<void> {
  const query = () => db.run(
    `DELETE FROM songs WHERE id_song = ?`,
    [id]
  );
  await executeDbQuery(query, 'Error al eliminar canción');
}

