// Importar la instancia de la base de datos
import { db } from './../db'; 
// Importar funciones y tipos de Drizzle ORM
import { eq, and, notExists, getTableColumns } from 'drizzle-orm';
// Importar los schemas y TIPOS INFERIDOS
import { 
  playlists, 
  playlistsToSongs, // <-- ¡NOMBRE DE TABLA DE UNIÓN ACTUALIZADO!
  songs, 
  type Song, 
  type Playlist 
} from '../db/schema'; 

// --- SERVICIOS DE PLAYLIST SONGS CON DRIZZLE ORM ---

/**
 * Inserta una relación entre una playlist y una canción.
 */
export const insertPlaylistSong = async (
  id_playlist: number, 
  id_song: number
): Promise<void> => {
  // Uso de CamelCase para las columnas de la tabla de unión
  await db.insert(playlistsToSongs).values({
    playlistId: id_playlist, // <-- CamelCase
    songId: id_song,         // <-- CamelCase
  });
};

/**
 * Obtiene todas las canciones pertenecientes a una playlist específica.
 */
export const getSongsByPlaylistId = async (id_playlist: number): Promise<Song[]> => {
    
    const result = await db
      .select({ 
        // Solución robusta para seleccionar todas las columnas de la tabla 'songs'
        ...getTableColumns(songs) 
      })
      .from(songs)
      // Condiciones de JOIN actualizadas con nombres de columna CamelCase (id y songId)
      .innerJoin(playlistsToSongs, eq(songs.id, playlistsToSongs.songId)) 
      .where(eq(playlistsToSongs.playlistId, id_playlist)); 
      
    return result as Song[]; 
};

/**
 * Obtiene las playlists de un usuario donde una canción específica NO existe.
 */
export const getPlaylistsWhereSongNotExist = async (id_song: number, id_user: number): Promise<Playlist[]> => {
    
    // 1. Subconsulta para buscar si la canción existe en una playlist
    const songExistsInPlaylistSubquery = db
      .select({ id: playlistsToSongs.playlistId }) // <-- CamelCase
      .from(playlistsToSongs)
      .where(
        and(
          eq(playlistsToSongs.playlistId, playlists.id), // <-- CamelCase (playlistId y id)
          eq(playlistsToSongs.songId, id_song)           // <-- CamelCase
        )
      );

    // 2. Consulta principal: selecciona playlists del usuario donde la subconsulta NO existe
    const result = await db
      .select()
      .from(playlists)
      .where(
        and(
          eq(playlists.userId, id_user), // <-- ¡CLAVE FORÁNEA ACTUALIZADA A userId!
          notExists(songExistsInPlaylistSubquery)
        )
      );
      
    return result as Playlist[];
};

/**
 * Elimina una relación específica de playlist-canción.
 */
export const deleteSongInPlaylist = async (id_playlist: number, id_song: number): Promise<void> => {
    // Uso de CamelCase para las columnas de la tabla de unión
    await db.delete(playlistsToSongs).where(
        and(
            eq(playlistsToSongs.playlistId, id_playlist), // <-- CamelCase
            eq(playlistsToSongs.songId, id_song)         // <-- CamelCase
        )
    );
};