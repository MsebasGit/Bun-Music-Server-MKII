import * as playlistSongModel from '../model/playlistSongModel';
import { handleGetAll, handleInsert, handleDeleteById } from '../utilities/controllerUtils';
import { getUserCookie } from '../utilities/getCookie';

export {
    handleGetSongsByPlaylistId,
    handleInsertPlaylistSong,
    handleDeletePlaylistSong,
    handleGetPlaylistsWhereSongNotExist
}

/**
 * Procesa y valida los datos del formulario para una relación playlist-canción.
 * Lanza un error si la validación falla.
 */
async function processPlaylistSongForm(req: Request): Promise<[number, number]> {
    const body = await req.formData();
    const id_playlist = Number(body.get("id_playlist"));
    const id_song = Number(body.get("id_song"));

    if (!id_playlist || !id_song || isNaN(id_playlist) || isNaN(id_song)) {
        throw new Error('IDs de playlist y canción son obligatorios y deben ser números.');
    }

    return [id_playlist, id_song];
}

// GET /playlists/:id/song
async function handleGetSongsByPlaylistId(req: Request, id_playlist: number): Promise<Response> {
    return handleGetAll(() => playlistSongModel.getSongsByPlaylistId(id_playlist), 'canciones de la playlist');
}

// GET /songs/:id/not/playlists
async function handleGetPlaylistsWhereSongNotExist(req: Request, id_song: number): Promise<Response> {
    const id_user = await getUserCookie(req);
    if (id_user === null) {
        throw new Error('IDs de playlist y canción son obligatorios y deben ser números.');
    }
    return handleGetAll(() => playlistSongModel.getPlaylistsWhereSongNotExist(id_song, id_user), 'canciones de la playlist');
}


// POST /playlists/songs
async function handleInsertPlaylistSong(req: Request, id_song: number): Promise<Response> {
    try {
        const [id_playlist, id_song_from_form] = await processPlaylistSongForm(req);
        
        // El id_song de la URL debe coincidir con el del formulario
        if (id_song !== id_song_from_form) {
            throw new Error("El ID de la canción en la URL no coincide con el del formulario.");
        }

        await playlistSongModel.insertPlaylistSong(id_playlist, id_song);

        return new Response(JSON.stringify({ message: 'Canción añadida a la playlist con éxito.' }), {
            status: 201, // Created
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error(`Error al insertar en playlist-canción: ${error.message}`);
        return new Response(JSON.stringify({ message: `Error interno del servidor al insertar en playlist-canción: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// DELETE /playlist/:id_playlist/song/:id_song
async function handleDeletePlaylistSong(req: Request, id_playlist: number, id_song: number): Promise<Response> {
    try {
        await playlistSongModel.deleteSongInPlaylist(id_playlist, id_song);
        return new Response(null, { status: 204 }); // Éxito, sin contenido
    } catch (error) {
        console.error(`Error al eliminar la canción ${id_song} de la playlist ${id_playlist}:`, error);
        return Response.json(
            { message: `Error interno del servidor al eliminar la relación.` },
            { status: 500 }
        );
    }
}

