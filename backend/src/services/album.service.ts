import { db } from "../db";
import { albums, artists, type NewAlbum } from "../db/schema";
import { uploadAppImage } from '../utilities/storageUtils';
import { eq, like, or, desc } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";

// (El tipo ElysiaContext se mantiene igual)
type ElysiaContext = {
    params?: { id: string | number };
    body: {
        name: string;
        release_date: string;
        id_artist: string | number;
        cover_image: File; // Objeto File de Elysia/Bun
        [key: string]: any;
    };
    [key: string]: any
};

// 1. CREAR ÁLBUM
export const createAlbum = async (id_artist: number, body: any) => {
    const { name, releaseDate, cover_image } = body;

    try {
        // 1. Delegamos la lógica de archivos a una sola línea reutilizable
        // 'album_covers' es el nombre de la carpeta específica
        const coverPath = await uploadAppImage(cover_image, 'album_covers');

        // Validación opcional: ¿Es obligatorio tener portada?
        if (!coverPath) throw new Error("La imagen de portada es obligatoria");

        const albumData: NewAlbum = {
            name,
            releaseDate: releaseDate,
            artistId: id_artist,
            coverPath: coverPath,
        };

        const result = await db.insert(albums).values(albumData).returning();
        return handleDrizzleResult(result, "Álbum", "crear");

    } catch (error: any) {
        console.error("Error en createAlbum:", error.message);
        // Es buena práctica relanzar el error para que handleRequest (tu controller) lo capture
        throw error;
    }
};

// 2. OBTENER TODOS LOS ÁLBUMES
export const getAlbums = async () => {
    return await db.select({
        id_album: albums.id,
        name: albums.name,
        release_date: albums.releaseDate,
        cover_path: albums.coverPath,
        id_artist: albums.artistId,
        artist_name: artists.name
    })
        .from(albums)
        .leftJoin(artists, eq(albums.artistId, artists.id))
        .orderBy(desc(albums.id));
};

// 3. OBTENER UN ÁLBUM POR ID
export const getAlbumById = async (id: number) => {
    const result = await db.select({
        id_album: albums.id,
        name: albums.name,
        release_date: albums.releaseDate,
        cover_path: albums.coverPath,
        id_artist: albums.artistId,
        artist_name: artists.name
    })
        .from(albums)
        .leftJoin(artists, eq(albums.artistId, artists.id))
        .where(eq(albums.id, id));

    return handleDrizzleResult(result, "Álbum", "obtener");
};

// 4. ACTUALIZAR UN ÁLBUM
export const updateAlbum = async (id: number, body: any) => {
    const { name, cover_image } = body;
    var cover_path = await uploadAppImage(cover_image, 'album_covers');
    if (cover_path == null) {
        const existingAlbum = await db.select({ 
            coverPath: albums.coverPath 
        }).from(albums).where(eq(albums.id, id)).limit(1);
        if (existingAlbum && existingAlbum.length > 0) {
            cover_path = existingAlbum[0].coverPath; // <--- ASIGNAS EL VALOR STRING REAL
        } else {
            throw new Error(`Álbum con ID ${id} no encontrado.`);
        }
    }
    const albumData: Partial<NewAlbum> = {
        name,
        coverPath: cover_path, 
    };
    const result = await db.update(albums)
        .set(albumData)
        .where(eq(albums.id, id))
        .returning();

    return handleDrizzleResult(result, "Álbum", "actualizar");
};

// 5. ELIMINAR UN ÁLBUM
export const deleteAlbum = async (id: number) => {
    const result = await db.delete(albums).where(eq(albums.id, id)).returning();
    return handleDeleteResult(result, "Álbum");
};

// 6. BUSCAR ÁLBUMES
export const searchAlbums = async (searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;
    return await db.select({
        id_album: albums.id,
        name: albums.name,
        release_date: albums.releaseDate,
        cover_path: albums.coverPath,
        id_artist: albums.artistId,
        artist_name: artists.name
    })
        .from(albums)
        .leftJoin(artists, eq(albums.artistId, artists.id))
        .where(or(
            like(albums.name, searchPattern),
            like(artists.name, searchPattern)
        ))
        .orderBy(desc(albums.name));
};

// 7. OBTENER ÁLBUMES POR ARTISTA
export const getAlbumsByArtistId = async (artistId: number) => {
    return await db.select({
        id_album: albums.id,
        name: albums.name,
        release_date: albums.releaseDate,
        cover_path: albums.coverPath,
        artist_name: artists.name
    })
        .from(albums)
        .leftJoin(artists, eq(albums.artistId, artists.id))
        .where(eq(albums.artistId, artistId));
};