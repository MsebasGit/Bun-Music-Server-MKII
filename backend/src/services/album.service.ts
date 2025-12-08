import { db } from "../db"; 
import { albums, artists, type NewAlbum } from "../db/schema"; 
import { handleFileUpload } from '../utilities/fileUtils';
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
export const createAlbum = async (body: ElysiaContext) => {
    const { name, release_date, id_artist, cover_image } = body;
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    const DESTINATION_DIR = '/img/album_covers'; 

    try {
        const coverPath = await handleFileUpload(cover_image, ALLOWED_EXTENSIONS, DESTINATION_DIR);
        const albumData: NewAlbum = { 
            name,
            releaseDate: release_date,
            artistId: Number(id_artist),
            coverPath: coverPath,
        };
        
        const result = await db.insert(albums).values(albumData).returning();
        return handleDrizzleResult(result, "Álbum", "crear");

    } catch (error: any) {
        console.error("Error al crear álbum o subir archivo:", error.message);
        throw new Error(`Fallo en la operación: ${error.message}`);
    }
};

// 2. OBTENER TODOS LOS ÁLBUMES
export const getAlbums = async () => {
    return await db.select({
        id: albums.id,
        name: albums.name,
        releaseDate: albums.releaseDate,
        coverPath: albums.coverPath,
        artistId: albums.artistId,
        artistName: artists.name
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .orderBy(desc(albums.id));
};

// 3. OBTENER UN ÁLBUM POR ID
export const getAlbumById = async (id: number) => {
    const result = await db.select({
        id: albums.id,
        name: albums.name,
        releaseDate: albums.releaseDate,
        coverPath: albums.coverPath,
        artistId: albums.artistId,
        artistName: artists.name
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .where(eq(albums.id, id));
    
    return handleDrizzleResult(result, "Álbum", "obtener");
};

// 4. ACTUALIZAR UN ÁLBUM
export const updateAlbum = async (id: number, body: Partial<NewAlbum>) => {
    const result = await db.update(albums)
        .set(body)
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
        id: albums.id,
        name: albums.name,
        releaseDate: albums.releaseDate,
        coverPath: albums.coverPath,
        artistId: albums.artistId,
        artistName: artists.name
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
        id: albums.id,
        name: albums.name,
        releaseDate: albums.releaseDate,
        coverPath: albums.coverPath,
        artistName: artists.name
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .where(eq(albums.artistId, artistId));
};