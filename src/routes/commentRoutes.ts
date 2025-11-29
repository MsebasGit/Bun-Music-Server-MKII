import { 
    handleGetCommentsBySongId,
    handleGetCommentById,
    handleInsertComment,
    handleUpdateComment,
    handleDeleteComment 
} from "../controller/commentController";

export const commentRoutes = [

    //          API REST

    // Obtener comentarios de una canción
    {
        path: '/songs/:id/comments',
        method: 'GET',
        handler: handleGetCommentsBySongId,
        protected: true
    },

    // Obtener comentario por ID
    {
        path: '/comments/:id',
        method: 'GET',
        handler: handleGetCommentById,
        protected: true
    },

    // Crear comentario para una canción
    {
        path: '/songs/:id/comments',
        method: 'POST',
        handler: handleInsertComment,
        protected: true
    },

    // Actualizar comentario
    {
        path: '/comments/:id',
        method: 'PUT',
        handler: handleUpdateComment,
        protected: true
    },

    // Eliminar comentario
    {
        path: '/comments/:id',
        method: 'DELETE',
        handler: handleDeleteComment,
        protected: true
    }

];

