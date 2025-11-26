import { db } from './../utilities/connectionDB';
import { executeDbQuery } from '../utilities/modelUtils';

export {
  insertPlaylist,
  getAllPlaylists,
  updatePlaylist,
  deletePlaylist,
  getPlaylistById
};
export type {
  // Tipos de datos
  Playlist
};

export type Playlist = {
  id_playlist: number;
  name: string;
  description: string;
  modification_date: string;
  creation_date: string;
  id_user: number;
};

async function insertPlaylist(
  name: string, 
  description: string, 
  id_user: number
): Promise<void> {
  const query = () => db.run(
    `INSERT INTO playlists (name, description, creation_date, modification_date, id_user)
     VALUES (?, ?, strftime('%Y-%m-%d %H:%M:%S', 'now'), strftime('%Y-%m-%d %H:%M:%S', 'now'), ?)`,
    [name, description, id_user]
  );
  await executeDbQuery(query, 'Error al insertar playlist');
}

async function getAllPlaylists(id_user: number): Promise<Playlist[]> {
  const query = () => db.query(
    `SELECT * 
     FROM playlists 
     WHERE id_user = ?
     ORDER BY modification_date DESC`
  ).all(id_user) as Playlist[];
  return executeDbQuery(query, 'Error al obtener todas las playlists');
}

async function getPlaylistById(id_playlist: number): Promise<Playlist | null> {
  const query = () => db.query(
    `SELECT * 
     FROM playlists 
     WHERE id_playlist = ?`
  ).get(id_playlist) as Playlist | null;
  return executeDbQuery(query, 'Error al obtener una playlist');
}

async function updatePlaylist(
  id_playlist: number,
  name: string, 
  description: string, 
  // El id_user podría no ser necesario para la actualización, pero lo mantenemos por consistencia con el procesador
): Promise<void> {
  const query = () => db.run(
    `UPDATE playlists 
     SET name = ?, description = ?, modification_date = strftime('%Y-%m-%d %H:%M:%S', 'now')
     WHERE id_playlist = ?`,
    [name, description, id_playlist]
  );
  await executeDbQuery(query, 'Error al actualizar la playlist');
}

async function deletePlaylist(id_playlist: number): Promise<void> {
  const query = () => db.run(
    `DELETE FROM playlists WHERE id_playlist = ?`,
    [id_playlist]
  );
  await executeDbQuery(query, 'Error al eliminar la playlist');
}


