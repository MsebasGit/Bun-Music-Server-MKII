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

  //            VISTAS HTML

  // Página de registro
  {
    path: '/signup',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(SIGNUP_VIEW_PATH),
    protected: false
  },

  // Página de login
  {
    path: '/login',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(LOGIN_VIEW_PATH),
    protected: false
  },

  // Formulario para editar usuario
  {
    path: '/users/:id/edit',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(EDIT_USER_VIEW_PATH),
    protected: true
  },

  // Vista de perfil propio
  {
    path: '/me',
    method: 'GET',
    handler: () => serveHtmlWithSidebar(ME_MENU_VIEW_PATH),
    protected: true
  },

  //            API REST

  // Registro de usuario
  {
    path: '/signup',
    method: 'POST',
    handler: handleSignUp,
    protected: false
  },

  // Login
  {
    path: '/login',
    method: 'POST',
    handler: handleLogin,
    protected: false
  },

  // Obtener datos de usuario propio
  {
    path: '/me',
    method: 'GET',
    handler: handleGetUserById,
    protected: true
  },

  // Obtener datos de un usuario por ID
  {
    path: '/users/:id',
    method: 'GET',
    handler: handleGetUserById,
    protected: true
  },

  // Actualizar usuario por ID
  {
    path: '/users/:id',
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
