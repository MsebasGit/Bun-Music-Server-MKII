import * as songModel from '../model/songModel';
import * as songArtistModel from '../model/songArtistModel';
import { isArtist } from '../utilities/authUtils';
import { toCorrectDate } from '../utilities/correctDate';
import {
    handleGetAll,
    handleGetById,
    handleInsert,
    handleUpdate,
    handleDeleteById,
    getAudioDuration,
    generateSafeFilename
} from '../utilities/controllerUtils';

export {
    handleGetAllSongs,
    handleGetSongById,
    handleInsertSong,
    handleUpdateSong,
    handleDeleteSong,
    handleSearchSongs
}

async function handleSearchSongs(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url);
        const searchTerm = url.searchParams.get('q');

        if (!searchTerm) {
            return new Response(JSON.stringify({ message: 'Falta el término de búsqueda (q)' }), { status: 400 });
        }

        const songs = await songModel.searchSongs(searchTerm);

        return new Response(JSON.stringify(songs), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

// GET /get/songs
async function handleGetAllSongs(): Promise<Response> {
    return handleGetAll(songModel.getAllSongs, 'canciones');
}

async function processSongForm(req: Request): Promise<[string, string, number, string, string, string, number | null]> {
    const body = await req.formData();
    const title = body.get("title") as string;
    const language = body.get("language") as string;
    let duration = Number(body.get("duration")); // Make optional
    const genre = body.get("genre") as string;
    const songFile = body.get("song_file") as File;
    const coverFile = body.get("cover_file") as File;
    const album_value = body.get("id_album");

    if (!title || !language || !genre || !songFile || !coverFile) { // Removed duration from required check
        throw new Error('Faltan campos obligatorios o son inválidos (título, lenguaje, género, archivo de canción, portada)');
    }

    // Handle file upload for song
    const songFileExtension = songFile.name.split('.').pop();
    if (!songFileExtension || !['mp3', 'wav'].includes(songFileExtension.toLowerCase())) {
        throw new Error('El archivo de canción debe ser MP3 o WAV.');
    }
    const songFilename = generateSafeFilename(songFile.name);
    const song_path = `/music/${songFilename}`;
    const songUploadPath = `static${song_path}`;
    await Bun.write(songUploadPath, await songFile.arrayBuffer());

    // Get duration using ffprobe
    duration = await getAudioDuration(songUploadPath); // Populate duration automatically

    // Handle file upload for cover
    const coverFileExtension = coverFile.name.split('.').pop();
    if (!coverFileExtension || !['jpg', 'png', 'jpeg'].includes(coverFileExtension.toLowerCase())) {
        throw new Error('El archivo de portada debe ser JPG o PNG.');
    }
    const coverFilename = generateSafeFilename(coverFile.name);
    const cover_path = `/img/covers/${coverFilename}`;
    const coverUploadPath = `static${cover_path}`;
    await Bun.write(coverUploadPath, await coverFile.arrayBuffer());


    let id_album: number | null = null;
    if (album_value) {
        const parsedId = Number(album_value);
        if (!isNaN(parsedId)) {
            id_album = parsedId;
        } else {
            throw new Error('El ID de álbum no es un número válido');
        }
    }

    return [title, language, duration, genre, song_path, cover_path, id_album];
}

/**
 * Procesa y valida los datos del formulario para una canción para actualización.
 * Permite la actualización opcional de la portada.
 * Lanza un error si la validación falla.
 */
async function processSongFormForUpdate(req: Request): Promise<[string, string, number, string, string, string, number | null]> {
    const body = await req.formData();
    const title = body.get("title") as string;
    const language = body.get("language") as string;
    let duration = Number(body.get("duration")); // Make optional
    const genre = body.get("genre") as string;
    const songFile = body.get("song_file") as File | null; // New: optional file input for song
    const existing_song_path = body.get("existing_song_path") as string; // Existing song path
    const coverFile = body.get("cover_file") as File | null; // Optional file
    const existing_cover_path = body.get("existing_cover_path") as string; // Existing path
    const album_value = body.get("id_album");

    if (!title || !language || !genre || isNaN(duration)) { // Removed duration from required check
        throw new Error('Faltan campos obligatorios o son inválidos (título, lenguaje, género)');
    }

    let song_path: string;
    if (songFile && songFile.size > 0) { // New song file uploaded
        const songFileExtension = songFile.name.split('.').pop();
        if (!songFileExtension || !['mp3', 'wav'].includes(songFileExtension.toLowerCase())) {
            throw new Error('El archivo de canción debe ser MP3 o WAV.');
        }
        const songFilename = generateSafeFilename(songFile.name);
        song_path = `/music/${songFilename}`;
        const songUploadPath = `static${song_path}`;
        await Bun.write(songUploadPath, await songFile.arrayBuffer());
        duration = await getAudioDuration(songUploadPath); // Populate duration automatically
    } else if (existing_song_path) { // No new song file, use existing path
        song_path = existing_song_path;
        // If no new song file, and duration was not provided, try to get it from the existing file
        if (isNaN(duration)) {
            duration = await getAudioDuration(`static${existing_song_path}`);
        }
    } else {
        throw new Error('Falta la ruta de la canción o un archivo de canción.');
    }

    let cover_path: string;
    if (coverFile && coverFile.size > 0) { // New cover file uploaded
        const fileExtension = coverFile.name.split('.').pop();
        if (!fileExtension || !['jpg', 'png', 'jpeg'].includes(fileExtension.toLowerCase())) {
            throw new Error('El archivo de portada debe ser JPG o PNG.');
        }
        const filename = generateSafeFilename(coverFile.name);
        cover_path = `/img/covers/${filename}`;
        const uploadPath = `static${cover_path}`;
        await Bun.write(uploadPath, await coverFile.arrayBuffer());
    } else if (existing_cover_path) { // No new cover file, use existing path
        cover_path = existing_cover_path;
    } else {
        throw new Error('Falta la ruta de la portada o un archivo de portada.');
    }

    let id_album: number | null = null;
    if (album_value) {
        const parsedId = Number(album_value);
        if (!isNaN(parsedId)) {
            id_album = parsedId;
        } else {
            throw new Error('El ID de álbum no es un número válido');
        }
    }

    return [title, language, duration, genre, song_path, cover_path, id_album];
}

// GET /get/songs/:id
async function handleGetSongById(req: Request, id: number): Promise<Response> {
    const response = await handleGetById(() => songModel.getSongByID(id), 'canción');
    return response;
}

// POST /songs/new
async function handleInsertSong(req: Request): Promise<Response> {
    try {
        // 1. Validar que el usuario es un artista y obtener su ID
        const artistResult = await isArtist(req);
        if (artistResult instanceof Response) {
            return artistResult; // No es un artista o no está autorizado
        }
        const id_artist = artistResult.id_artist;

        // 2. Procesar el formulario y insertar la canción
        const songData = await processSongForm(req);
        const id_song = await songModel.insertSong(...songData);

        // 3. Asociar la canción con el artista
        await songArtistModel.insertSongArtist(id_artist, id_song);

        // 4. Redirigir
        return new Response(null, {
            status: 302, // Found
            headers: {
                'Location': '/me/songs'
            }
        });

    } catch (error: any) {
        console.error("Error al insertar canción:", error);
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

// GET /songs/:id (o POST si se usa para actualizar desde formulario)
async function handleUpdateSong(req: Request, id: number): Promise<Response> {
    return handleUpdate(req, id, processSongFormForUpdate, songModel.updateSong, 'canción');
}

// DELETE /song/:id
async function handleDeleteSong(req: Request, id: number): Promise<Response> {
    return handleDeleteById(songModel.deleteSong, id, 'canción');
}