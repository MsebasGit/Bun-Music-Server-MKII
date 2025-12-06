// src/services/artist.service.ts
import { db } from "../db";
import { artists } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Obtiene todas las artists de un usuario específico.
 * @param userId - El ID del usuario.
 * @returns Una lista de las artists del usuario.
 */
export const getartistsByUserId = async (userId: number) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const isArtist = await db
        .select({ id_artist: artists.id }) // Solo traemos la columna que queremos
        .from(artists)
        .where(eq(artists.userId, userId)) // <--- AQUÍ ESTÁ LA MAGIA
        .limit(1); // Buena práctica si solo esperas uno

    // Drizzle devuelve un array, así que tomamos el primero
    return isArtist[0]?.id_artist ?? null;
};

