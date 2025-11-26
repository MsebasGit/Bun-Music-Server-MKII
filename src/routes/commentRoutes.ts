import { 
    handleGetCommentsBySongId,
    handleGetCommentById,
    handleInsertComment,
    handleUpdateComment,
    handleDeleteComment 
} from "../controller/commentController";

export const commentRoutes = [
    // API para obtener los comentarios de una canción
    {
        path: '/get/songs/:id/comments',
        method: 'GET',
        handler: handleGetCommentsBySongId,
        protected: true
    },
    // API para obtener un comentario por ID
    {
        path: '/get/comments/:id',
        method: 'GET',
        handler: handleGetCommentById,
        protected: true
    },
    // Ruta para insertar un comentario
    {
        path: '/comments/new/:id',
        method: 'POST',
        handler: handleInsertComment,
        protected: true
    },
    // Ruta para actualizar un comentario
    {
        path: '/comments/:id',
        method: 'PUT',
        handler: handleUpdateComment,
        protected: true
    },
    // Ruta para eliminar un comentario
    {
        path: '/comments/:id',
        method: 'DELETE',
        handler: handleDeleteComment,
        protected: true
    }
];
