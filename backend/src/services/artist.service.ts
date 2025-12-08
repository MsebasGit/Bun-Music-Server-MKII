// src/services/artist.service.ts
import { db } from "../db";
import { artists } from "../db/schema";
import { eq, like, desc } from "drizzle-orm";
import type { NewArtist } from "../db/schema";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";

// 1. CREAR ARTISTA
export const createArtist = async (data: NewArtist) => {
    const result = await db.insert(artists).values(data).returning();
    return handleDrizzleResult(result, "Artista", "crear");
};

// 2. OBTENER TODOS LOS ARTISTAS
export const getAllArtists = async () => {
    const result = await db.select().from(artists).orderBy(desc(artists.id));
    return handleDrizzleResult(result, "Artista", "obtener");
};

// 3. OBTENER UN ARTISTA POR ID
export const getArtistById = async (id: number) => {
    const result = await db.select().from(artists).where(eq(artists.id, id));
    return handleDrizzleResult(result, "Artista", "obtener");
};

// 4. ACTUALIZAR UN ARTISTA
export const updateArtist = async (id: number, data: Partial<NewArtist>) => {
    const result = await db.update(artists)
        .set(data)
        .where(eq(artists.id, id))
        .returning();
    return handleDrizzleResult(result, "Artista", "actualizar");
};

// 5. ELIMINAR UN ARTISTA
export const deleteArtist = async (id: number) => {
    const result = await db.delete(artists).where(eq(artists.id, id)).returning();
    return handleDeleteResult(result, "Artista");
};

// 6. BUSCAR ARTISTAS
export const searchArtists = async (searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;
    return await db.select()
        .from(artists)
        .where(like(artists.name, searchPattern))
        .orderBy(desc(artists.name));
};

// 7. OBTENER ARTISTA POR USER ID
export const getArtistByUserId = async (userId: number) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const result = await db.select().from(artists).where(eq(artists.userId, userId));
    return result.length > 0 ? result[0] : null;
};

// 8. VERIFICAR SI UN USUARIO ES ARTISTA
export const isUserAnArtist = async (userId: number) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const result = await db.select({ id: artists.id }).from(artists).where(eq(artists.userId, userId)).limit(1);
    return result[0]?.id ?? null;
};

// ----------------------------------------------------
// 9. GESTIÓN DE REDES SOCIALES (CAMPO JSON)
// ----------------------------------------------------

type SocialLink = { name: string; url: string };

// OBTENER REDES SOCIALES DE UN ARTISTA
export const getSocialLinks = async (artistId: number) => {
    const result = await db.select({ socialLinks: artists.socialLinks }).from(artists).where(eq(artists.id, artistId));
    const artist = handleDrizzleResult(result, "Artista", "obtener");
    return (artist.socialLinks || []) as SocialLink[];
};

// AÑADIR UNA RED SOCIAL
export const addSocialLink = async (artistId: number, newLink: SocialLink) => {
    const currentLinks = await getSocialLinks(artistId);
    
    if (currentLinks.find(link => link.name.toLowerCase() === newLink.name.toLowerCase())) {
        throw new Error(`La red social '${newLink.name}' ya existe para este artista.`);
    }

    const updatedLinks = [...currentLinks, newLink];
    
    const result = await db.update(artists)
        .set({ socialLinks: updatedLinks })
        .where(eq(artists.id, artistId))
        .returning({ socialLinks: artists.socialLinks });

    return handleDrizzleResult(result, "Red social", "crear");
};

// ACTUALIZAR TODAS LAS REDES SOCIALES
export const updateSocialLinks = async (artistId: number, links: SocialLink[]) => {
    const result = await db.update(artists)
        .set({ socialLinks: links })
        .where(eq(artists.id, artistId))
        .returning({ socialLinks: artists.socialLinks });
    
    return handleDrizzleResult(result, "Redes sociales", "actualizar");
};

// ELIMINAR UNA RED SOCIAL
export const deleteSocialLink = async (artistId: number, linkName: string) => {
    const currentLinks = await getSocialLinks(artistId);
    
    const updatedLinks = currentLinks.filter(link => link.name.toLowerCase() !== linkName.toLowerCase());

    if (updatedLinks.length === currentLinks.length) {
        throw new Error(`La red social '${linkName}' no fue encontrada.`);
    }

    const result = await db.update(artists)
        .set({ socialLinks: updatedLinks })
        .where(eq(artists.id, artistId))
        .returning({ socialLinks: artists.socialLinks });
        
    return handleDeleteResult(result, "Red social");
};
