import { Context } from 'elysia';
import { handleRequest } from '../utilities/controllerUtils';
import * as ratingService from '../services/userSongRating.service';

export const handleGetLikedSongs = (context: Context) => {
    const userId = (context as any).user.userId;
    return handleRequest(() => ratingService.getLikedSongsByUser(userId), context);
};

export const handleSearchLikedSongs = (context: Context) => {
    const userId = (context as any).user.userId;
    const term = new URL(context.request.url).searchParams.get('term') || '';
    return handleRequest(() => ratingService.searchLikedSongs(userId, term), context);
};

export const handleIsSongLiked = (context: Context) => {
    const userId = (context as any).user.userId;
    const songId = Number(context.params.id);
    return handleRequest(() => ratingService.isSongLikedByUser(userId, songId), context);
};

export const handleGetLikesCount = (context: Context) => {
    const songId = Number(context.params.id);
    return handleRequest(() => ratingService.countLikesInSong(songId), context);
};

export const handleLikeSong = (context: Context) => {
    const userId = (context as any).user.userId;
    const songId = Number(context.params.id);
    return handleRequest(() => ratingService.likeSong(userId, songId), context, 201);
};

export const handleUnlikeSong = (context: Context) => {
    const userId = (context as any).user.userId;
    const songId = Number(context.params.id);
    return handleRequest(() => ratingService.unlikeSong(userId, songId), context);
};