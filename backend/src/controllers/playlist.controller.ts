// src/controllers/playlist.controller.ts
import { getPlaylistsByUserId, createPlaylist } from '../services/playlist.service';
import { handleRequest } from '../utilities/controllerUtils';

// Dejamos que Elysia infiera el tipo del 'context'.
// Sabe que 'user' existe porque esta función se llama desde una ruta protegida.
export const getMyPlaylistsController = async (context: any) => {
  const serviceAdapter = () => {
    const userId = context.user.userId;
    return getPlaylistsByUserId(userId);
  };
  return handleRequest(serviceAdapter, { set: context.set, body: null });
}

export const createPlaylistController = async (context: any) => {
  const serviceAdapter = (body: any) => {
    const userId = context.user.userId;
    return createPlaylist(body, userId);
  };
  return handleRequest(serviceAdapter, context, 201);
}