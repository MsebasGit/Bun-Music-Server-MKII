// src/controllers/artistSong.controller.ts
import { Context } from 'elysia';
import { 
    getSongsByArtistId,
    getArtistsBySongId,
    getArtistsNotOnSong
} from '../services/songArtist.service';
import { handleRequest } from '../utilities/controllerUtils';

// 1. GET /api/v1/artists/:id/songs
export const handleGetSongsByArtistId = (context: Context) => {
    const artistId = Number(context.params.id);
    return handleRequest(() => getSongsByArtistId(artistId), context);
};

//  GET /api/v1/songs/me
export const handleGetMySongsByArtist = (context: Context) => {
        const artistId = (context as any).artist?.id;

    if (!artistId) {
        context.set.status = 403; // Forbidden
        return { message: "Operation failed", error: "Only artists can have songs." };
    }
    return handleRequest(() => getSongsByArtistId(artistId), context);
};


// 2. GET /api/v1/songs/:id/artists
export const handleGetArtistsBySongId = (context: Context) => {
    const songId = Number(context.params.id);
    return handleRequest(() => getArtistsBySongId(songId), context);
};

// 3. GET /api/v1/songs/:id/not-artists
export const handleGetArtistsWhereSongNotExist = (context: Context) => {
    const songId = Number(context.params.id);
    return handleRequest(() => getArtistsNotOnSong(songId), context);
};
