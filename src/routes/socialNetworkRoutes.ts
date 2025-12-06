import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleGetAllSocialNetworks,
  handleGetSocialNetworkById,
  handleInsertSocialNetwork,
  handleUpdateSocialNetwork,
  handleDeleteSocialNetwork,
  handleGetSocialNetworksByArtistId
} from './../controller/socialNetworkController';
import { withAuthCheck, isArtist } from '../utilities/authUtils';

const NEW_SOCIAL_NETWORK_VIEW_PATH = './static/socialNetworks/newSocialNetworkView.html';
const SOCIAL_NETWORKS_ARTISTS_VIEW_PATH = './static/socialNetworks/socialNetworkArtistView.html';

export const socialNetworkRoutes = [
  // API: obtener todas las redes sociales
  {
    path: '/api/v1/social-networks',
    method: 'GET',
    handler: handleGetAllSocialNetworks,
    protected: true
  },

  // API: redes sociales de un artista por ID
  {
    path: '/api/v1/artists/:id/social-networks',
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
    path: '/api/v1/social-networks',
    method: 'POST',
    handler: withAuthCheck(isArtist, true)(handleInsertSocialNetwork),
    protected: true
  },

  // Obtener red social por ID (JSON)
  {
    path: '/api/v1/social-networks/:id',
    method: 'GET',
    handler: handleGetSocialNetworkById,
    protected: true
  },

  // Editar red social
  {
    path: '/api/v1/social-networks/:id',
    method: 'PUT',
    handler: withAuthCheck(isArtist, true)(handleUpdateSocialNetwork),
    protected: true
  },

  // Eliminar red social
  {
    path: '/api/v1/social-networks/:id',
    method: 'DELETE',
    handler: handleDeleteSocialNetwork,
    protected: true
  }
];
