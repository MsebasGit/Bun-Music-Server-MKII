
import * as userSongRatingsModel from '../model/userSongRatingModel';
import { handleGetAll, handleInsert, handleDeleteById } from '../utilities/controllerUtils';
import { getUserCookie } from '../utilities/getCookie';

export {
    handleLikeSong,
    handleUnlikeSong,
    handleGetLikedSongs,
    handleIsSongLiked,
    handleGetLikesInSong,
    handleSearchLikedSongs
}

async function handleSearchLikedSongs(req: Request): Promise<Response> {
    try {
        const id_user = await getUserCookie(req);
        const url = new URL(req.url);
        const searchTerm = url.searchParams.get('q');

        if (!id_user || !searchTerm) {
            throw new Error('Usuario no autenticado o parámetro de busqueda nulo.');
        }

        const songs = await userSongRatingsModel.searchLikedSongs(id_user, searchTerm);

        return new Response(JSON.stringify(songs), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`Error en handleSearchLikedSongs: ${error.message}`);
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

async function handleLikeSong(req: Request, id_song: number): Promise<Response> {
    const processor = async (req: Request): Promise<[number, number]> => {
        const id_user = await getUserCookie(req);
        if (!id_user) {
            throw new Error('Usuario no autenticado, no se puede dar like.');
        }
        return [id_user, id_song];
    };

    return handleInsert(
        req,
        processor,
        userSongRatingsModel.insertLike,
        `/songs/${id_song}`,
        'like'
    );
}

async function handleUnlikeSong(req: Request, id_song: number): Promise<Response> {
    const id_user = await getUserCookie(req);
    if (!id_user) {
        throw new Error('Usuario no autenticado, no se puede quitar el like.');
    }

    const deleteLikeForUser = (songId: number) => {
        return userSongRatingsModel.deleteLike(id_user, songId);
    };

    return handleDeleteById(
        deleteLikeForUser,
        id_song,
        'like'
    );
}

async function handleGetLikedSongs(req: Request): Promise<Response> {
    const id_user = await getUserCookie(req);
    if (!id_user) {
        throw new Error('Usuario no autenticado.');
    }
    return handleGetAll(() => userSongRatingsModel.getLikedSongsByUserId(id_user), 'canciones que le gustan al usuario');
}


async function handleIsSongLiked(req: Request, id_song: number): Promise<Response> {
    try {
        const id_user = await getUserCookie(req);
        if (!id_user) {
            throw new Error('Usuario no autenticado.');
        }

        const result = await userSongRatingsModel.isSongLikedByUser(id_user, id_song);
        return Response.json(result, { status: 200 });
    } catch (error: any) {
        console.error(`Error al verificar si la canción ${id_song} tiene like:`, error);
        return Response.json(
            { message: `Error interno del servidor al verificar el like.` },
            { status: 500 }
        );
    }
}

async function handleGetLikesInSong(req: Request, id_song: number): Promise<Response> {
    try {
        const result = await userSongRatingsModel.countLikesInSong(id_song);
        return Response.json(result, { status: 200 });
    } catch (error: any) {
        console.error(`Error al verificar la cantidad de likes de la canción ${id_song}:`, error);
        return Response.json(
            { message: `Error interno del servidor al verificar la cantidad de likes.` },
            { status: 500 }
        );
    }
}
