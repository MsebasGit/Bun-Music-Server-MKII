// src/services/song.service.ts
import { db } from "../db";
import { songs, albums, artists, songsToArtists, NewSong } from "../db/schema";
import { eq, like, or, desc, sql, and } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";
import { uploadAppImage, uploadSongFile } from '../utilities/storageUtils';
import { deleteFile, extractAudioDuration } from "../utilities/fileUtils";

// Helper para no repetir la query base
const getSongsWithDetailsQuery = () => {
    return db.select({
        id_song: songs.id,
        title: songs.title,
        language: songs.language,
        release_date: songs.releaseDate,
        duration: songs.duration,
        song_path: songs.songPath,
        cover_path: songs.coverPath,
        id_album: songs.albumId,
        genres: songs.genres,
        album_name: albums.name,
        artist_names: sql<string>`GROUP_CONCAT(${artists.name})`.as('artist_names')
    })
    .from(songs)
    .leftJoin(albums, eq(songs.albumId, albums.id))
    .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
    .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
    .groupBy(songs.id)

}

// --- Helpers para createSong ---
const uploadSongAssets = async (cover_image: File, audio_file: File) => {
    const coverPath = await uploadAppImage(cover_image, 'songs_covers');
    const audioPath = await uploadSongFile(audio_file, 'audio_files');
    return { coverPath, audioPath };
};

// --- Helper de autorización ---
const verifyArtistOwnership = async (songId: number, artistId: number) => {
    const songOwnership = await db.select()
        .from(songsToArtists)
        .where(and(eq(songsToArtists.songId, songId), eq(songsToArtists.artistId, artistId)));

    if (songOwnership.length === 0) {
        throw new Error("Unauthorized: You are not the artist of this song.");
    }
};

export const createSong = async (body: any, artistId: number) => {
    const { title, cover_image, albumId, audio_file, language, genres } = body;

    try {
        if (!audio_file) throw new Error("El archivo de audio es obligatorio");
        if (!artistId) throw new Error("El ID del artista es obligatorio y no se encontró en el token.");

        // Pasos 1 y 2: Extracción de metadatos y subida de archivos
        const calculatedDuration = await extractAudioDuration(audio_file);
        const { coverPath, audioPath } = await uploadSongAssets(cover_image, audio_file);

        // Paso 3: Transacción en DB
        const result = await db.transaction(async (tx) => {
            const songData: NewSong = {
                title,
                duration: calculatedDuration,
                songPath: audioPath!,
                coverPath,
                albumId: albumId ? Number(albumId) : null,
                language: language || 'es',
                genres: genres ? JSON.stringify(genres) : null,
            };

            const [newSong] = await tx.insert(songs).values(songData).returning();

            if (!newSong) {
                tx.rollback();
                throw new Error("No se pudo crear la canción.");
            }

            await tx.insert(songsToArtists).values({
                songId: newSong.id,
                artistId: artistId,
            });
            
            return [newSong]; // Devolvemos la canción creada en un array para consistencia
        });

        return handleDrizzleResult(result, "Canción", "crear");

    } catch (error: any) {
        console.error("Error en createSong:", error.message);
        throw error;
    }
};

// 2. OBTENER TODAS LAS CANCIONES (con artistas)
export const getAllSongs = async () => {
    const query = getSongsWithDetailsQuery();
    return await query.orderBy(desc(songs.id));
};

// 3. OBTENER CANCIÓN POR ID (con detalles)
export const getSongById = async (id: number) => {
    const query = getSongsWithDetailsQuery();
    const result = await query.where(eq(songs.id, id));
    return handleDrizzleResult(result, "Canción", "obtener");
};

// 4. ACTUALIZAR CANCIÓN
// 4. ACTUALIZAR CANCIÓN
export const updateSong = async (id: number, data: Partial<NewSong> & { cover_image?: any, audio_file?: any }, artistId: number) => {
    // 1. Verificar la propiedad del artista
    await verifyArtistOwnership(id, artistId);

    const { cover_image, audio_file, ...songDataToUpdate } = data;
    let newCoverPath: string | undefined = undefined;

    const [existingSong] = await db
        .select({ 
            songPath: songs.songPath, 
            coverPath: songs.coverPath 
        })
        .from(songs)
        .where(eq(songs.id, id))
        .limit(1);

    if (!existingSong) {
        throw new Error("Canción no encontrada.");
    }

    if (cover_image) {
        const uploadedPath = await uploadAppImage(cover_image, 'songs_covers');

        if (uploadedPath) {
            newCoverPath = uploadedPath;
            if (existingSong.coverPath) {
                await deleteFile(existingSong.coverPath); 
            }
        }
    }
    const finalUpdateData: Partial<NewSong> = {
        ...songDataToUpdate,
        ...(newCoverPath && { coverPath: newCoverPath }),
    };

    console.log("Datos de actualización final:", finalUpdateData);

    const result = await db.update(songs)
        .set(finalUpdateData)
        .where(eq(songs.id, id))
        .returning();

    return handleDrizzleResult(result, "Canción", "actualizar");
};

// 5. ELIMINAR CANCIÓN
export const deleteSong = async (songId: number, artistId: number) => {
    
    return await db.transaction(async (tx) => {
        // 1. Verificar propiedad
        await verifyArtistOwnership(songId, artistId);

        // 2. Obtener las rutas de los archivos antes de borrar la canción
        const [songToDelete] = await tx.select({
                songPath: songs.songPath,
                coverPath: songs.coverPath
            })
            .from(songs)
            .where(eq(songs.id, songId));

        if (!songToDelete) {
            throw new Error("Song not found.");
        }

        // 3. Eliminar los archivos físicos
        await deleteFile(songToDelete.songPath);
        await deleteFile(songToDelete.coverPath);

        // 4. Eliminar el registro de la DB
        // La DB se encargará de los borrados en cascada (songsToArtists, etc.)
        const result = await tx.delete(songs).where(eq(songs.id, songId)).returning();
        
        return handleDeleteResult(result, "Canción");
    });
};

// 6. BUSCAR CANCIONES
export const searchSongs = async (searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;

    // Usamos la query base como una subquery para poder filtrar por los campos agregados
    const subquery = getSongsWithDetailsQuery().as('subquery');

    return await db.select()
        .from(subquery)
        .where(
            or(
                like(subquery.title, searchPattern),
                like(subquery.album_name, searchPattern),
                like(subquery.artist_names, searchPattern)
            )
        );
};

// ... (existing functions)

// 7. OBTENER CANCIONES POR ÁLBUM
export const getSongsByAlbumId = async (albumId: number) => {
    const query = getSongsWithDetailsQuery();
    return await query.where(eq(songs.albumId, albumId));
};