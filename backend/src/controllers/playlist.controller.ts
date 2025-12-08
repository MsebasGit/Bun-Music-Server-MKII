// src/controllers/playlist.controller.ts
import { 
  getPlaylistsByUserId, 
  createPlaylist,
  deletePlaylist,
  updatePlaylist
} from '../services/playlist.service';
import { handleRequest } from '../utilities/controllerUtils';

export {
  handleGetMyPlaylists,
  handleCreatePlaylist,
  handleDeletePlaylist,
  handleUpdatePlaylist
}

// Dejamos que Elysia infiera el tipo del 'context'.
// Sabe que 'user' existe porque esta función se llama desde una ruta protegida.
const handleGetMyPlaylists = async (context: any) => {
  const serviceAdapter = () => {
    const userId = context.user.userId;
    return getPlaylistsByUserId(userId);
  };
  return handleRequest(serviceAdapter, { set: context.set, body: null });
}

const handleCreatePlaylist = async (context: any) => {
  const serviceAdapter = (body: any) => {
    const userId = context.user.userId;
    return createPlaylist(body, userId);
  };
  return handleRequest(serviceAdapter, context, 201);
}

const handleDeletePlaylist = async (context: any) => {
  const serviceAdapter = () => {
    const playlistId = Number(context.params._id);
    return deletePlaylist(playlistId);
  };
  return handleRequest(serviceAdapter, { set: context.set, body: null });
}

const handleUpdatePlaylist = async (context: any) => {
  const serviceAdapter = (body: any) => {
    const playlistId = Number(context.params._id);
    return updatePlaylist(playlistId, body);
  };
  return handleRequest(serviceAdapter, context);
}