// src/services/album.service.ts
import { db } from "../db"; 
import { albums, type NewAlbum } from "../db/schema"; 
import { handleFileUpload } from '../utilities/fileUtils'; // <--- NUEVO IMPORT
// import { eq } from "drizzle-orm"; // Descomentar si usas otras funciones de Drizzle

// ----------------------------------------------------
// TIPO: Adaptado para la estructura de la petición multipart
// ----------------------------------------------------
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


// ----------------------------------------------------
// 1. CREAR ÁLBUM (POST /albums) - Lógica de subida integrada
// ----------------------------------------------------
export const createAlbum = async (body: ElysiaContext) => {
    // 1. CORRECCIÓN PRINCIPAL: Desestructurar context.body para obtener los datos
    const { name, release_date, id_artist, cover_image } = body;

    // --- Lógica de Subida de Archivo ---
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    const DESTINATION_DIR = '/img/album_covers'; 

    try {
        const coverPath = await handleFileUpload(
            cover_image,
            ALLOWED_EXTENSIONS,
            DESTINATION_DIR
        );
        const albumData: NewAlbum = { 
            name,
            releaseDate: release_date,
            artistId: Number(id_artist),
            coverPath: coverPath,
        };
        
        // 3. Insertar en la DB
        // Drizzle ahora debe omitir id_album:
        const result = await db.insert(albums).values(albumData).returning();
        
        if (result.length === 0) {
            throw new Error("Error al guardar los metadatos del álbum en la base de datos.");
        }

        return result[0];
    } catch (error: any) {
        console.error("Error al crear álbum o subir archivo:", error.message);
        throw new Error(`Fallo en la operación: ${error.message}`);
    }
};
// ----------------------------------------------------
// Nota: Las siguientes funciones son placeholders, mantenidas para el contexto.
// ----------------------------------------------------

export const getAlbums = async () => { /* ... */ };

export const getAlbumById = async (context: ElysiaContext) => { /* ... */ };

export const updateAlbum = async (context: ElysiaContext) => { /* ... */ };

export const deleteAlbum = async (context: ElysiaContext) => { /* ... */ };