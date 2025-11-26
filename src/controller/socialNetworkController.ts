import * as socialNetworkModel from '../model/socialNetworkModel';
import { isArtist } from '../utilities/authUtils';
import { 
    handleGetAll, 
    handleGetById, 
    handleDeleteById 
} from '../utilities/controllerUtils';

export {
    handleGetAllSocialNetworks,
    handleGetSocialNetworkById,
    handleInsertSocialNetwork,
    handleUpdateSocialNetwork,
    handleDeleteSocialNetwork,
    handleGetSocialNetworksByArtistId
}

/**
 * Procesa y valida los datos del formulario para una red social.
 * Lanza un error si la validación falla.
 */
async function processSocialNetworkForm(req: Request): Promise<[string, string]> {
    const body = await req.formData();
    const name = body.get("name") as string;
    const url = body.get("url") as string;

    if (!name || !url) {
        throw new Error('Faltan campos obligatorios: nombre y URL.');
    }

    return [name, url];
}

// GET /social-network
async function handleGetAllSocialNetworks(req: Request): Promise<Response> {
    return handleGetAll(socialNetworkModel.getAllSocialNetworks, 'redes sociales');
}

// GET /social-network/:id
async function handleGetSocialNetworkById(req: Request, id: number): Promise<Response> {
    return handleGetById(() => socialNetworkModel.getSocialNetworkById(id), 'red social');
}

// GET /get/artists/:id/social-networks
async function handleGetSocialNetworksByArtistId(req: Request, id_artist: number): Promise<Response> {
    return handleGetById(() => socialNetworkModel.getSocialNetworksByArtistId(id_artist), 'red social ');
}

// POST /social-network
async function handleInsertSocialNetwork(req: Request): Promise<Response> {
    try {
        const artistResult = await isArtist(req);
        if (artistResult instanceof Response) {
            return artistResult;
        }
        const id_artist = artistResult.id_artist;

        const [name, url] = await processSocialNetworkForm(req);
        await socialNetworkModel.insertSocialNetwork(name, url, id_artist);
        
        return new Response(null, {
            status: 302,
            headers: { 'Location': "/social-networks/new" }
        });
    } catch (error: any) {
        console.error(`Error en handleInsertSocialNetwork: ${error.message}`);
        return new Response(JSON.stringify({ message: `Error al insertar red social` }), { status: 500 });
    }
}

// PUT /social-network/:id
async function handleUpdateSocialNetwork(req: Request, id: number): Promise<Response> {
    try {
        const artistResult = await isArtist(req);
        if (artistResult instanceof Response) {
            return artistResult;
        }
        const id_artist = artistResult.id_artist;

        const [name, url] = await processSocialNetworkForm(req);
        await socialNetworkModel.updateSocialNetwork(id, name, url, id_artist);
        
        return new Response(null, {
            status: 302,
            headers: { 'Location': "/social-networks/new" }
        });
    } catch (error: any) {
        console.error(`Error en handleUpdateSocialNetwork: ${error.message}`);
        return new Response(JSON.stringify({ message: `Error al actualizar red social` }), { status: 500 });
    }
}

// DELETE /social-network/:id
async function handleDeleteSocialNetwork(req: Request, id: number): Promise<Response> {
    return handleDeleteById(socialNetworkModel.deleteSocialNetwork, id, 'red social');
}
