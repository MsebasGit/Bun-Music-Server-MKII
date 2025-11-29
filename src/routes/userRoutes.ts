// routes/userRoutes.ts

// ⚠️ Cambia la importación: ahora solo importamos la RUTA como un string, NO el contenido.
const SIGNUP_PATH = './static/users/signup.html';
const LOGIN_PATH = './static/users/login.html';
const EDIT_USER_VIEW_PATH = './static/users/editUserView.html';
const ME_MENU_VIEW = './static/meMenu.html'

import { handleLogin, handleSignUp, getUserId, handleGetSongById, handleDeleteUser, handleUpdateUser } from './../controller/userController';
import { serveHtmlWithSidebar } from '../utilities/view';

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
  // Petición GET para obtener los datos del usuario por id
  {
    path: '/api/v1/me/id',
    method: 'GET',
    handler: getUserId,
    protected: false
  },
  // Petición GET para obtener los datos del usuario por id
  {
    path: '/api/v1/users/:id',
    method: 'GET',
    handler: handleGetSongById,
    protected: true
  },
  // Petición DELETE para eliminar un usuario por id
  {
    path: '/api/v1/users/:id',
    method: 'DELETE',
    handler: handleDeleteUser,
    protected: true
  },
  // Petición PUT para actualizar un usuario por id
  {
    path: '/api/v1/users/:id',
    method: 'PUT',
    handler: handleUpdateUser,
    protected: true
  },
  // Petición GET para ver formulario de edición
  {
    path: '/users/:id/edit',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(EDIT_USER_VIEW_PATH),
    protected: true
  },
  // Petición GET para ver formulario de edición
  {
    path: '/me',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ME_MENU_VIEW),
    protected: true
  }  
];
