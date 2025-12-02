import { serveHtmlWithSidebar } from '../utilities/view';
import {
  handleLogin,
  handleSignUp,
  handleGetUserById,
  handleDeleteUser,
  handleUpdateUser
} from './../controller/userController';

// Vistas
const SIGNUP_VIEW_PATH = './static/users/signup.html';
const LOGIN_VIEW_PATH = './static/users/login.html';
const EDIT_USER_VIEW_PATH = './static/users/editUserView.html';
const ME_MENU_VIEW_PATH = './static/meMenu.html';

export const userRoutes = [
  // Petición POST para manejar el registro
  {
    path: '/api/v1/signup',
    method: 'POST',
    handler: handleSignUp,
    protected: false
  },
  // Petición POST para manejar el login
  {
    path: '/api/v1/login',
    method: 'POST',
    handler: handleLogin,
    protected: false
  },

  // Login
  {
    path: '/api/v1/me/id',
    method: 'GET',
    handler: handleGetUserById,
    protected: false
  },

  // Obtener datos de usuario propio
  {
    path: '/api/v1/users/:id',
    method: 'GET',
    handler: handleGetUserById,
    protected: true
  },

  // Obtener datos de un usuario por ID
  {
    path: '/api/v1/users/:id',
    method: 'DELETE',
    handler: handleDeleteUser,
    protected: true
  },

  // Actualizar usuario por ID
  {
    path: '/api/v1/users/:id',
    method: 'PUT',
    handler: handleUpdateUser,
    protected: true
  },

  // Eliminar usuario por ID
  {
    path: '/users/:id',
    method: 'DELETE',
    handler: handleDeleteUser,
    protected: true
  }

];
