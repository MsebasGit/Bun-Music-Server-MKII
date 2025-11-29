import * as albumModel from './../model/albumModel';
import * as songModel from './../model/songModel';
import {
    handleGetAll,
    handleGetById,
    handleInsert,
    handleUpdate,
    handleDeleteById,
    handleFileUpload
} from '../utilities/controllerUtils';

export {
    handleGetAllAlbums,
    handleGetAlbumById,
    handleInsertAlbum,
    handleUpdateAlbum,
    handleDeleteAlbum,
    handleGetAllAlbumSongs,
    handleGetAlbumsByArtistId,
    handleSearchAlbums
}

async function handleSearchAlbums(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url);
        const searchTerm = url.searchParams.get('q');

        if (!searchTerm) {
            return new Response(JSON.stringify({ message: 'Falta el término de búsqueda (q)' }), { status: 400 });
        }

        const albums = await albumModel.searchAlbums(searchTerm);

        return new Response(JSON.stringify(albums), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`Error en handleSearchAlbums: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

/**
 * Procesa y valida los datos del formulario para un álbum para inserción.
 * Lanza un error si la validación falla.
 */
async function processAlbumFormForInsert(req: Request, id_artist: number): Promise<[string, string, number]> {
    const body = await req.formData();
    const name = body.get("name") as string;
    const coverFile = body.get("cover_file") as File;

    if (!name || !coverFile)  {
        throw new Error('Faltan campos obligatorios: nombre y portada.');
    }

    const cover_path = await handleFileUpload(coverFile, ['jpg', 'png', 'jpeg'], '/img/covers');

    return [name, cover_path, id_artist];
}

/**
 * Procesa y valida los datos del formulario para un álbum para actualización.
 * Permite la actualización opcional de la portada.
 * Lanza un error si la validación falla.
 */
async function processAlbumFormForUpdate(req: Request): Promise<[string, string]> {
    const body = await req.formData();
    const name = body.get("name") as string;
    const coverFile = body.get("cover_file") as File | null; // Optional file
    const existing_cover_path = body.get("existing_cover_path") as string; // Existing path

    if (!name)  {
        throw new Error('Faltan campos obligatorios: nombre.');
    }

    let cover_path: string;
    if (coverFile && coverFile.size > 0) { // New file uploaded
        cover_path = await handleFileUpload(coverFile, ['jpg', 'png', 'jpeg'], '/img/covers');
    } else if (existing_cover_path) { // No new file, use existing path
        cover_path = existing_cover_path;
    } else {
        throw new Error('Falta la ruta de la portada o un archivo de portada.');
    }

    return [name, cover_path];
}

// GET /albums
async function handleGetAllAlbums(req: Request): Promise<Response> {
    return handleGetAll(albumModel.getAllAlbums, 'álbumes');
}

// GET /albums/:id
async function handleGetAlbumById(req: Request, id: number): Promise<Response> {
    return handleGetById(() => albumModel.getAlbumById(id), 'álbum');
}

// GET /get/artists/:id/albums
async function handleGetAlbumsByArtistId(req: Request, id_artist: number): Promise<Response> {
    return handleGetById(() => albumModel.getAlbumsByArtistId(id_artist), 'álbum');
}


// POST /albums/new
async function handleInsertAlbum(req: Request, artistResult: { id_artist: number }): Promise<Response> {
    try {
        const id_artist = artistResult.id_artist;

        const formData = await processAlbumFormForInsert(req, id_artist);
        await albumModel.insertAlbum(...formData);
        
        return Response.json({ message: "Álbum creado correctamente" }, { status: 201 });
    } catch (error: any) {
        console.error(`Error en handleInsert para álbum: ${error.message}`);
        return new Response(JSON.stringify({ message: `Error al insertar álbum` }), { status: 500 });
    }
}

// PUT /albums/:id
async function handleUpdateAlbum(req: Request, id: number): Promise<Response> {
    return handleUpdate(req, id, processAlbumFormForUpdate, albumModel.updateAlbum, 'álbum');
}

// DELETE /albums/:id
async function handleDeleteAlbum(req: Request, id: number): Promise<Response> {
    return handleDeleteById(albumModel.deleteAlbum, id, 'álbum');
}

// GET /get/albums/:id/songs
async function handleGetAllAlbumSongs(req: Request, id_album: number): Promise<Response> {
    return handleGetAll(() => songModel.getSongsByAlbumId(id_album), 'canciones');
}
