import * as songArtistModel from '../model/songArtistModel';
import { handleGetAll, handleInsert } from '../utilities/controllerUtils';
import { getUserCookie } from '../utilities/getCookie';
import { isUserAnArtist } from '../model/artistModel';

export {
    handleGetSongsByArtistId,
    handleGetArtistsBySongId,
    handleInsertSongArtist,
    handleDeleteSongArtist,
    handleGetArtistsWhereSongNotExist
}

async function processSongArtistForm(req: Request): Promise<[number, number]> {
    const body = await req.formData();
    const id_artist = Number(body.get("id_artist"));
    const id_song = Number(body.get("id_song"));

    if (!id_artist || !id_song || isNaN(id_artist) || isNaN(id_song)) {
        throw new Error('IDs de artista y canción son obligatorios y deben ser números.');
    }

    return [id_artist, id_song];
}

// GET /get/artists/:id/songs
async function handleGetSongsByArtistId(req: Request, id_artist: number): Promise<Response> {
    return handleGetAll(() => songArtistModel.getSongsByArtistId(id_artist), 'canciones del artista');
}

// GET /get/songs/:id/artists
async function handleGetArtistsBySongId(req: Request, id_song: number): Promise<Response> {
    const id_user = getUserCookie(req);
    let id_artist_to_exclude: number | null = null;
    if (id_user) {
        id_artist_to_exclude = await isUserAnArtist(id_user);
    }

    return handleGetAll(() => songArtistModel.getArtistsBySongId(id_song, id_artist_to_exclude ?? undefined), 'artistas de la canción');
}

// GET /songs/:id/not/artists
async function handleGetArtistsWhereSongNotExist(req: Request, id_song: number): Promise<Response> {
    return handleGetAll(() => songArtistModel.getArtistsWhereSongNotExist(id_song), 'artistas donde la cancion no existe');
}


// POST /songs/artists/new
async function handleInsertSongArtist(req: Request): Promise<Response> {
    return handleInsert(req, processSongArtistForm, songArtistModel.insertSongArtist, 'relación canción-artista');
}

// DELETE /artists/:id_artist/songs/:id_song
async function handleDeleteSongArtist(req: Request, id_artist: number, id_song: number): Promise<Response> {
    try {
        await songArtistModel.deleteSongArtist(id_artist, id_song);
        return Response.json(
            { message: `Colaborador con ID ${id_artist} eliminado de la canción ${id_song} correctamente.` },
            { status: 200 } 
        );
    } catch (error) {
        console.error(`Error al eliminar la canción ${id_song} del artista ${id_artist}:`, error);
        return Response.json(
            { message: `Error interno del servidor al eliminar la relación.` },
            { status: 500 }
        );
    }
}