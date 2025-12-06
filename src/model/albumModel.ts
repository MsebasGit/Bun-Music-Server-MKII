import { db } from './../utilities/connectionDB';
import { executeDbQuery } from '../utilities/modelUtils';

export {
  Album,
  insertAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  getAlbumsByArtistId,
  searchAlbums
}

type Album = {
  id_album: number;
  name: string;
  release_date: string;
  cover_path: string;
  id_artist: number;
  artist_name?: string;
};

async function searchAlbums(searchTerm: string): Promise<Album[]> {
    const searchPattern = `%${searchTerm}%`;
    const query = () => db.query(
        `SELECT a.*, ar.name as artist_name
         FROM albums a
         JOIN artists ar ON a.id_artist = ar.id_artist
         WHERE a.name LIKE ?
            OR ar.name LIKE ?
         ORDER BY a.name ASC`
    ).all(
        searchPattern,
        searchPattern
    ) as Album[];
    return executeDbQuery(query, 'Error al buscar álbumes');
}

async function insertAlbum(
  name: string, 
  cover_path: string,
  id_artist: number
): Promise<void> {
  const query = () => db.run(
    `INSERT INTO albums (name, release_date, cover_path, id_artist)
     VALUES (?, strftime('%Y-%m-%d %H:%M:%S', 'now'), ?, ?)`, [name, cover_path, id_artist]
  );
  await executeDbQuery(query, 'Error al insertar álbum');
}

async function getAllAlbums(): Promise<Album[]> {
  const query = () => db.query(
    `SELECT a.*, ar.name as artist_name
     FROM albums a
     JOIN artists ar ON a.id_artist = ar.id_artist
     ORDER BY a.id_album DESC`
  ).all() as Album[];
  return executeDbQuery(query, 'Error al obtener todos los álbumes');
}

async function getAlbumById(id: number): Promise<Album | null> {
  const query = () => db.query(
    `SELECT a.*, ar.name as artist_name
     FROM albums a
     JOIN artists ar ON a.id_artist = ar.id_artist
     WHERE a.id_album = ?`
  ).get(id) as Album | null;
  return executeDbQuery(query, 'Error al obtener un álbum');
}

async function getAlbumsByArtistId(id: number): Promise<Album[]> {
  const query = () => db.query(
    `SELECT a.*, ar.name as artist_name
     FROM albums a
     JOIN artists ar ON a.id_artist = ar.id_artist
     WHERE a.id_artist = ?`
  ).all(id) as Album[];
  return executeDbQuery(query, 'Error al obtener los álbumes de un artista');
}

async function updateAlbum(
  id: number,
  name: string, 
  cover_path: string
): Promise<void> {
  const query = () => db.run(
    `UPDATE albums 
     SET name = ?, cover_path = ?
     WHERE id_album = ?`,
    [name, cover_path, id]
  );
  await executeDbQuery(query, 'Error al actualizar álbum');
}

async function deleteAlbum(id: number): Promise<void> {
  const query = () => db.run(
    `DELETE FROM albums WHERE id_album = ?`,
    [id]
  );
  await executeDbQuery(query, 'Error al eliminar álbum');
}
