// src/services/playlist.service.ts
import { db } from "../db";
import { playlists } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Obtiene todas las playlists de un usuario específico.
 * @param userId - El ID del usuario.
 * @returns Una lista de las playlists del usuario.
 */
export const getPlaylistsByUserId = async (userId: number) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.userId, userId),
  });

  if (!userPlaylists) {
    // Devuelve un array vacío si no se encuentran playlists, lo cual es un caso válido.
    return [];
  }

  return userPlaylists;
};

/**
 * Crea una nueva playlist para un usuario específico.
 * @param data - Los datos de la nueva playlist (name, description).
 * @param userId - El ID del usuario que crea la playlist.
 * @returns La playlist recién creada.
 */
export const createPlaylist = async (data: { name: string; description?: string }, userId: number) => {
  if (!userId) {
    throw new Error("User ID is required to create a playlist");
  }
  if (!data.name) {
    throw new Error("Playlist name is required");
  }

  const result = await db
    .insert(playlists)
    .values({
      name: data.name,
      description: data.description,
      userId: userId,
      // Drizzle manejará las fechas de creación/modificación si tienen defaults en el schema
    })
    .returning();

  return result[0];
};
