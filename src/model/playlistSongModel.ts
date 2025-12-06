import { db } from './../utilities/connectionDB';
import { type Song } from './songModel'; // Importar el tipo Song
import { executeDbQuery } from '../utilities/modelUtils';
import type { Playlist } from './playlistModel';

export {
    insertPlaylistSong,
    getSongsByPlaylistId,
    getPlaylistsWhereSongNotExist,
    deleteSongInPlaylist
}

async function insertPlaylistSong(
  id_playlist: number, 
  id_song: number
): Promise<void> {
  const query = () => db.run(
    `INSERT INTO playlists_songs (id_playlist, id_song)
     VALUES (?, ?)`,
    [id_playlist, id_song]
  );
  await executeDbQuery(query, 'Error al insertar en playlists_songs');
}

async function getSongsByPlaylistId(id_playlist: number): Promise<Song[]> {
    const query = () => db.query(
        `SELECT s.* 
         FROM songs s
         JOIN playlists_songs ps ON s.id_song = ps.id_song
         WHERE ps.id_playlist = ?`
    ).all(id_playlist) as Song[];
    return executeDbQuery(query, 'Error al obtener las canciones de la playlist');
}

// Tu función de lógica de negocio
async function getPlaylistsWhereSongNotExist(id_song: number, id_user: number): Promise<Playlist[]> {
    
    const sql = `
        SELECT
            p.*
        FROM
            playlists AS p
        WHERE
            p.id_user = ?  -- Parámetro 1
        AND
            NOT EXISTS (
                SELECT 1
                FROM playlists_songs AS ps
                WHERE
                    ps.id_playlist = p.id_playlist
                AND
                    ps.id_song = ? -- Parámetro 2
            );
    `;

    // 1. Define la función síncrona que se pasará a executeDbQuery
    const query = () => db.query(sql).all(
        id_user,  // Parámetro 1
        id_song   // Parámetro 2
    ) as Playlist[];

    // 2. Llama al 'wrapper'
    // No necesitas 'await' aquí si solo quieres propagar la promesa
    return executeDbQuery(query, 'Error al obtener las playlists donde la canción no existe');
}

async function deleteSongInPlaylist(id_playlist: number, id_song: number): Promise<void> {
    const query = () => db.run(
        `DELETE FROM playlists_songs WHERE id_playlist = ? AND id_song = ?`,
        [id_playlist, id_song]
    );
    await executeDbQuery(query, 'Error al eliminar la canción de la playlist');
}
