import { db } from './../utilities/connectionDB';
import { executeDbQuery } from '../utilities/modelUtils';

export {
  Artist,
  insertArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  getArtistByUserId,
  isUserAnArtist,
  searchArtists
}

// Define el tipo para un solo artista
type Artist = { 
  id_artist: number; 
  name: string; 
  nationality: string; 
  biography: string; 
  debut_date: string;
  id_user: number
};

async function searchArtists(searchTerm: string): Promise<Artist[]> {
    const searchPattern = `%${searchTerm}%`;
    const query = () => db.query(
        `SELECT *
         FROM artists
         WHERE name LIKE ?
         ORDER BY name ASC`
    ).all(
        searchPattern
    ) as Artist[];
    return executeDbQuery(query, 'Error al buscar artistas');
}

async function insertArtist(
  name: string,
  nationality: string,
  biography: string,
  debut_date: string,
  id_user: number,
): Promise<void> {
  const query = () => db.run(
    `INSERT INTO artists (name, nationality, biography, debut_date, id_user)
     VALUES (?, ?, ?, ?, ?)`, [name, nationality, biography, debut_date, id_user]
  );
  await executeDbQuery(query, 'Error al insertar artista');
}


// Modificamos la función para que no reciba parámetros y devuelva un array (Artist[])
async function getAllArtists(): Promise<Artist[]> {
  const query = () => db.query(
    `SELECT * 
     FROM artists 
     ORDER BY id_artist DESC`
  ).all() as Artist[];
  return executeDbQuery(query, 'Error al obtener todos los artistas');
}

async function getArtistById(id: number): Promise<Artist | null> {
  const query = () => db.query(
    `SELECT * 
     FROM artists 
     WHERE id_artist = ?`
  ).get(id) as Artist | null;
  return executeDbQuery(query, 'Error al obtener un artista');
}

// obtener id de artista si un usuario es un artista
// Esta es la forma moderna y limpia, usando tu patrón de async/await
async function isUserAnArtist(id_user: number): Promise<number | null> {
    
    // 1. (Opcional pero recomendado) Define el tipo que esperas de la DB
    type ArtistResult = {
        id_artist: number
    };

    // 2. Define la consulta
    const query = () => db.query(
        `SELECT id_artist FROM artists WHERE id_user = ?`,
    ).get(id_user) as ArtistResult | null;

    // 3. Usa 'await' (igual que hiciste en countLikesInSong)
    const result = await executeDbQuery(query, 'Error al verificar si un usuario es un artista');

    // 4. Retorna solo el ID o null
    //    Esto usa "optional chaining" (?.):
    //    - Si 'result' NO es null, accede a 'result.id_artist' (te da el número)
    //    - Si 'result' ES null, toda la expresión da 'undefined'
    //    - El '?? null' al final convierte ese 'undefined' en 'null'
    return result?.id_artist ?? null;
}

async function getArtistByUserId(userId: number): Promise<Artist | null> {
  const query = () => db.query(
    `SELECT * FROM artists WHERE id_user = ?`
  ).get(userId) as Artist | null;
  return executeDbQuery(query, 'Error al obtener artista por ID de usuario');
}

async function updateArtist(
  id: number,
  name: string,
  nationality: string,
  biography: string,
  debut_date: string
): Promise<void> {
  const query = () => db.run(
    `UPDATE artists 
     SET name = ?, nationality = ?, biography = ?, debut_date = ?
     WHERE id_artist = ?`,
    [name, nationality, biography, debut_date, id]
  );
  await executeDbQuery(query, 'Error al actualizar artista');
}

async function deleteArtist(id_artist: number): Promise<void> {
  const query = () => db.run(
    `DELETE FROM artists WHERE id_artist = ?`,
    [id_artist]
  );
  await executeDbQuery(query, 'Error al eliminar artista');}

