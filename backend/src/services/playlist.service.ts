// src/services/playlist.service.ts
import { db } from "../db";
import { playlists, NewPlaylist } from "../db/schema";
import { eq } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";

// OBTENER PLAYLISTS POR USUARIO
export const getPlaylistsByUserId = async (userId: number) => {
  if (!userId) throw new Error("User ID is required");
  return await db.query.playlists.findMany({ where: eq(playlists.userId, userId) });
};

// CREAR PLAYLIST
export const createPlaylist = async (data: { name: string; description?: string }, userId: number) => {
  if (!userId) throw new Error("User ID is required");
  if (!data.name) throw new Error("Playlist name is required");

  const result = await db.insert(playlists).values({ ...data, userId }).returning();
  return handleDrizzleResult(result, "Playlist", "crear");
};

// OBTENER PLAYLIST POR ID
export const getPlaylistById = async (playlistId: number) => {
    const result = await db.query.playlists.findFirst({ where: eq(playlists.id, playlistId) });
    if (!result) throw new Error("Playlist no encontrada");
    return result;
};

// ACTUALIZAR PLAYLIST
export const updatePlaylist = async (playlistId: number, data: Partial<Pick<NewPlaylist, 'name' | 'description'>>) => {
    const result = await db.update(playlists)
        .set({ ...data, modificationDate: new Date().toISOString().slice(0, 19).replace('T', ' ') })
        .where(eq(playlists.id, playlistId))
        .returning();
    return handleDrizzleResult(result, "Playlist", "actualizar");
};

// ELIMINAR PLAYLIST
export const deletePlaylist = async (playlistId: number) => {
    const result = await db.delete(playlists).where(eq(playlists.id, playlistId)).returning();
    return handleDeleteResult(result, "Playlist");
};
