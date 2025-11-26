import { db } from './../utilities/connectionDB';
import { executeDbQuery } from '../utilities/modelUtils';

export {
    getCommentsBySongId,
    getCommentById,
    insertComment,
    updateComment,
    deleteComment
}

export type Comment = {
    id_comment: number,
    comment_text: string,
    creation_date: string,
    modification_date: string,
    id_song: number,
    id_user: number,
    username: string
}

async function getCommentsBySongId(id_song: number): Promise<Comment[]> {
    const query = () => db.query(
        `SELECT c.*, u.name as username
         FROM comments c
         JOIN users u ON c.id_user = u.id_user
         WHERE c.id_song = ?
         ORDER BY c.creation_date DESC`
    ).all(id_song) as Comment[];
    return executeDbQuery(query, 'Error al obtener los comentarios de la canción');
}

async function getCommentById(id_comment: number): Promise<Comment> {
    const query = () => db.query(
        `SELECT c.*, u.name as username
         FROM comments c
         JOIN users u ON c.id_user = u.id_user
         WHERE c.id_comment = ?`
    ).get(id_comment) as Comment;
    return executeDbQuery(query, 'Error al obtener el comentario');
}

async function insertComment(
  comment_text: string,
  id_song: number,
  id_user: number
): Promise<Comment> {
  const query = () => {
    db.run(
      `INSERT INTO comments (comment_text, id_song, id_user)
       VALUES (?, ?, ?)`,
      [comment_text, id_song, id_user]
    );
    // Retornar el comentario recién insertado con el nombre de usuario
    return db.query(`
        SELECT c.*, u.name as username
        FROM comments c
        JOIN users u ON c.id_user = u.id_user
        WHERE c.id_comment = last_insert_rowid()`
    ).get() as Comment;
  };
  return executeDbQuery(query, 'Error al insertar en comments');
}

async function updateComment(
    id_comment: number,
    comment_text: string
): Promise<void> {
    const query = () => db.run(
        `UPDATE comments
         SET comment_text = ?, modification_date = CURRENT_TIMESTAMP
         WHERE id_comment = ?`,
        [comment_text, id_comment]
    );
    await executeDbQuery(query, 'Error al actualizar el comentario');
}

async function deleteComment(id_comment: number): Promise<void> {
    const query = () => db.run(
        `DELETE FROM comments WHERE id_comment = ?`,
        [id_comment]
    );
    await executeDbQuery(query, 'Error al eliminar el comentario');
}


