// src/services/song.service.ts
import { db } from "../db";
import { songs, albums, artists, songsToArtists, NewSong } from "../db/schema";
import { eq, like, or, desc, sql } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";
import { uploadAppImage, uploadSongFile } from '../utilities/storageUtils';
import { parseBuffer } from 'music-metadata';

export const createSong = async (body: any) => {
    // Ya no extraemos 'duration' del body, lo calcularemos nosotros.
    // 'release_date' es opcional ahora.
    const { title, cover_image, albumId, audio_file, language, genres } = body;

    try {
        if (!audio_file) throw new Error("El archivo de audio es obligatorio");

        // --- PASO 1: EXTRACTOR DE METADATOS ---
        // Convertimos el archivo de Bun (Blob) a Buffer para que music-metadata lo lea
        const arrayBuffer = await audio_file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Leemos los tags (ID3, etc.)
        const metadata = await parseBuffer(buffer);

        // 1.1 Calculamos Duración (Redondeamos a segundos enteros)
        const calculatedDuration = Math.round(metadata.format.duration || 0);


        // --- PASO 2: SUBIDA DE ARCHIVOS ---
        // Subimos los archivos al disco
        const coverPath = await uploadAppImage(cover_image, 'songs_covers');
        const audioPath = await uploadSongFile(audio_file, 'audio_files');

        // --- PASO 3: GUARDADO EN DB ---
        const songData: NewSong = {
            title: title,
            duration: calculatedDuration, // ¡Automático!
            songPath: audioPath!, 
            coverPath: coverPath,
            albumId: albumId ? Number(albumId) : null,
            language: language || 'es', 
            genres: genres ? JSON.stringify(genres) : null,
        };

        const result = await db.insert(songs).values(songData).returning();
        
        return handleDrizzleResult(result, "Canción", "crear");

    } catch (error: any) {
        console.error("Error en createSong:", error.message);
        throw error;
    }
};

// 2. OBTENER TODAS LAS CANCIONES (con artistas)
export const getAllSongs = async () => {
    // Esta consulta es más compleja y puede que necesites ajustarla
    // Agrupa los artistas por cada canción
    const result = await db.select({
        song: songs,
        albumName: albums.name,
        artists: sql`GROUP_CONCAT(${artists.name})`.as('artists')
    })
        .from(songs)
        .leftJoin(albums, eq(songs.albumId, albums.id))
        .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
        .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
        .groupBy(songs.id)
        .orderBy(desc(songs.id));

    return result;
};

// 3. OBTENER CANCIÓN POR ID (con detalles)
export const getSongById = async (id: number) => {
    const result = await db.select({
        song: songs,
        albumName: albums.name,
        artists: sql`GROUP_CONCAT(${artists.name})`.as('artists')
    })
        .from(songs)
        .leftJoin(albums, eq(songs.albumId, albums.id))
        .leftJoin(songsToArtists, eq(songs.id, songsToArtists.songId))
        .leftJoin(artists, eq(songsToArtists.artistId, artists.id))
        .where(eq(songs.id, id))
        .groupBy(songs.id);

    return handleDrizzleResult(result, "Canción", "obtener");
};

// 4. ACTUALIZAR CANCIÓN
export const updateSong = async (id: number, data: Partial<NewSong>) => {
    const result = await db.update(songs).set(data).where(eq(songs.id, id)).returning();
    return handleDrizzleResult(result, "Canción", "actualizar");
};

// 5. ELIMINAR CANCIÓN
export const deleteSong = async (id: number) => {
    const result = await db.delete(songs).where(eq(songs.id, id)).returning();
    return handleDeleteResult(result, "Canción");
};

// 6. BUSCAR CANCIONES
export const searchSongs = async (searchTerm: string) => {
    const searchPattern = `%${searchTerm}%`;
    // La búsqueda con GROUP_CONCAT y HAVING es compleja en Drizzle.
    // Una alternativa es hacer el filtro en la aplicación o con una vista/raw query.
    // Esta es una aproximación:
    const allSongs = await getAllSongs(); // Reutilizamos la función anterior
    return allSongs.filter(s =>
        s.song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.albumName && s.albumName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // CORRECCIÓN: Forzamos a que lo trate como un array
        (s.artists && (s.artists as any[]).some((a: any) =>
            a.name && a.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );
};

// 7. OBTENER CANCIONES POR ÁLBUM
export const getSongsByAlbumId = async (albumId: number) => {
    return await db.select().from(songs).where(eq(songs.albumId, albumId));
};
