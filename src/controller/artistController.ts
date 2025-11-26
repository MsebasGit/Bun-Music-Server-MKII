import * as artistModel from '../model/artistModel';
import { toCorrectDate } from '../utilities/correctDate';
import {
    handleGetAll,
    handleGetById,
    handleInsert,
    handleUpdate,
    handleDeleteById
} from '../utilities/controllerUtils';
import { getUserCookie } from '../utilities/getCookie';

export {
    handleGetAllArtists,
    handleGetArtistById,
    handleInsertArtist,
    handleUpdateArtist,
    handleDeleteArtist,
    handleGetArtistByUserId,
    handleSearchArtists
}

async function handleSearchArtists(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url);
        const searchTerm = url.searchParams.get('q');

        if (!searchTerm) {
            return new Response(JSON.stringify({ message: 'Falta el término de búsqueda (q)' }), { status: 400 });
        }

        const artists = await artistModel.searchArtists(searchTerm);

        return new Response(JSON.stringify(artists), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`Error en handleSearchArtists: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

/**
 * Procesa y valida los datos del formulario para un artista.
 * Lanza un error si la validación falla.
 */
async function processArtistForm(req: Request): Promise<[string, string, string, string, number]> {
    const body = await req.formData();
    const name = body.get("name") as string;
    const nationality = body.get("nationality") as string;
    const biography = body.get("biography") as string;
    const debut_date = toCorrectDate(body.get("debut_date") as string);
    const id_user = await getUserCookie(req)

    if (!name || !nationality || !id_user || isNaN(id_user)) {
        throw new Error('Faltan campos obligatorios: nombre y nacionalidad.');
    }

    return [name, nationality, biography, debut_date, id_user];
}

// GET /artists
async function handleGetAllArtists(req: Request): Promise<Response> {
    return handleGetAll(artistModel.getAllArtists, 'artistas');
}

// GET /artists/:id
async function handleGetArtistById(req: Request, id: number): Promise<Response> {
    return handleGetById(() => artistModel.getArtistById(id), 'artista');
}

// GET /artists/user/:userId
async function handleGetArtistByUserId(req: Request, id_user: number): Promise<Response> {
    return handleGetById(() => artistModel.getArtistByUserId(id_user), 'artista');
}

// POST /artists/new
async function handleInsertArtist(req: Request): Promise<Response> {
    return handleInsert(req, processArtistForm, artistModel.insertArtist, "/artists", 'artista');
}

// PUT /artists/:id
async function handleUpdateArtist(req: Request, id: number): Promise<Response> {
    return handleUpdate(req, id, processArtistForm, artistModel.updateArtist, 'artista');
}

// DELETE /artists/:id
async function handleDeleteArtist(req: Request, id: number): Promise<Response> {
    return handleDeleteById(artistModel.deleteArtist, id, 'artista');
}

