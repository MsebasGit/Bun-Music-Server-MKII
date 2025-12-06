import * as playlistModel from '../model/playlistModel';
import * as playlistSongModel from '../model/playlistSongModel';
import {
    handleGetAll,
    handleGetById,
    handleInsert,
    handleUpdate,
    handleDeleteById
} from '../utilities/controllerUtils';
import { getUserCookie } from '../utilities/getCookie';

export {
    handleGetAllPlaylists,
    handleGetPlaylistById,
    handleInsertPlaylist,
    handleUpdatePlaylist,
    handleDeletePlaylist
}


/**
 * Procesa y valida los datos del formulario y la cookie para una playlist.
 * Lanza un error si la validación falla.
 */
async function processPlaylistForm(req: Request): Promise<[string, string, number]> {
    const body = await req.formData();
    const name = body.get("name") as string;
    const description = body.get("description") as string;

    const id_user = await getUserCookie(req);
    if (!name || !description || id_user === null) {
        throw new Error('Faltan campos obligatorios o el ID de usuario es inválido.');
    }

    return [name, description, id_user];
}

// GET /get/playlists
async function handleGetAllPlaylists(req: Request): Promise<Response> {
    const id_user = await getUserCookie(req);
    if (id_user === null) {
        return new Response(JSON.stringify({ message: "Usuario no autenticado" }), { status: 401 });
    }
    return handleGetAll(() => playlistModel.getAllPlaylists(id_user), 'playlists');
}

// GET /playlist/:id
async function handleGetPlaylistById(req: Request, id: number): Promise<Response> {
    return handleGetById(() => playlistModel.getPlaylistById(id), 'playlist');
}

// POST /playlists
async function handleInsertPlaylist(req: Request): Promise<Response> {
    return handleInsert(req, processPlaylistForm, playlistModel.insertPlaylist, 'playlist');
}

// PUT /playlists/:id
async function handleUpdatePlaylist(req: Request, id: number): Promise<Response> {
    // El procesador de actualización podría ser diferente si no se necesita el id_user
    // pero por simplicidad reutilizamos el mismo.
    return handleUpdate(req, id, processPlaylistForm, playlistModel.updatePlaylist, 'playlist');
}

// DELETE /playlists/:id
async function handleDeletePlaylist(req: Request, id: number): Promise<Response> {
    return handleDeleteById(playlistModel.deletePlaylist, id, 'playlist');
}

