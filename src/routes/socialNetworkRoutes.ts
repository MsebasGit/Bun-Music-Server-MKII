import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllSocialNetworks,
  handleGetSocialNetworkById,
  handleInsertSocialNetwork,
  handleUpdateSocialNetwork,
  handleDeleteSocialNetwork,
  handleGetSocialNetworksByArtistId
} from './../controller/socialNetworkController';

const NEW_SOCIAL_NETWORK_VIEW_PATH = './static/socialNetworks/newSocialNetworkView.html';
const SOCIAL_NETWORKS_ARTISTS_VIEW_PATH = './static/socialNetworks/socialNetworkArtistView.html';

export const socialNetworkRoutes = [
  // API: obtener todas las redes sociales
  {
    path: '/get/social-networks',
    method: 'GET',
    handler: handleGetAllSocialNetworks,
    protected: true
  },

  // API: redes sociales de un artista por ID
  {
    path: '/get/artists/:id/social-networks',
    method: 'GET',
    handler: handleGetSocialNetworksByArtistId,
    protected: true
  },

  // Vista: redes sociales del artista por ID
  {
    path: '/artists/:id/social-networks',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(SOCIAL_NETWORKS_ARTISTS_VIEW_PATH),
    protected: true
  },

  // Vista: formulario para nueva red social
  {
    path: '/social-networks/new',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(NEW_SOCIAL_NETWORK_VIEW_PATH),
    protected: true
  },

  // Crear red social
  {
    path: '/social-networks/new',
    method: 'POST',
    handler: handleInsertSocialNetwork,
    protected: true
  },

  // Obtener red social por ID (JSON)
  {
    path: '/social-networks/:id',
    method: 'GET',
    handler: handleGetSocialNetworkById,
    protected: true
  },

  // Editar red social
  {
    path: '/social-networks/:id',
    method: 'PUT',
    handler: handleUpdateSocialNetwork,
    protected: true
  },

  // Eliminar red social
  {
    path: '/social-networks/:id',
    method: 'DELETE',
    handler: handleDeleteSocialNetwork,
    protected: true
  }
];
