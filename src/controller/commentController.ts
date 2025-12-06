import * as commentModel from '../model/commentModel';
import { handleGetAll, handleGetById, handleInsert, handleUpdate, handleDeleteById } from '../utilities/controllerUtils';
import { getUserCookie } from '../utilities/getCookie';

export {
    handleGetCommentsBySongId,
    handleGetCommentById,
    handleInsertComment,
    handleUpdateComment,
    handleDeleteComment
}



async function processCommentUpdateForm(req: Request): Promise<string> {
    const body = await req.json();
    const comment_text = body.comment_text as string;
    if (!comment_text) {
        throw new Error('El texto del comentario es obligatorio.');
    }
    return comment_text;
}

// GET /songs/:id/comments
async function handleGetCommentsBySongId(req: Request, id_song: number): Promise<Response> {
    return handleGetAll(() => commentModel.getCommentsBySongId(id_song), 'comentarios de la canción');
}

// GET /comments/:id
async function handleGetCommentById(req: Request, id_comment: number): Promise<Response> {
    return handleGetById(() => commentModel.getCommentById(id_comment), 'comentario');
}

// POST /comments
async function handleInsertComment(req: Request, id_song: number): Promise<Response> {
    try {
        const body = await req.formData();
        const comment_text = body.get("comment_text") as string;
        const id_user = await getUserCookie(req);

        if (!comment_text || !id_user) {
            throw new Error('El texto del comentario y el usuario son obligatorios.');
        }

        const newComment = await commentModel.insertComment(comment_text, id_song, id_user);

        return new Response(JSON.stringify(newComment), {
            status: 201, // Created
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error(`Error al insertar comentario: ${error.message}`);
        return new Response(JSON.stringify({ message: "Error interno del servidor al insertar comentario." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// PUT /comments/:id
async function handleUpdateComment(req: Request, id_comment: number): Promise<Response> {
    try {
        const comment_text = await processCommentUpdateForm(req);
        await commentModel.updateComment(id_comment, comment_text);
        return new Response(JSON.stringify({ message: 'Comentario actualizado con éxito.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error(`Error al actualizar comentario: ${error.message}`);
        return new Response(JSON.stringify({ message: `Error interno del servidor al actualizar comentario.` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// DELETE /comments/:id
async function handleDeleteComment(req: Request, id_comment: number): Promise<Response> {
    return handleDeleteById( commentModel.deleteComment, id_comment, 'comentario');
}
