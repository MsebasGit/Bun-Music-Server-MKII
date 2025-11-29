import { db } from './../utilities/connectionDB'
import { executeDbQuery } from '../utilities/modelUtils';


export {
  insertUser,
  getUser,
  safeGetUserByID,
  deleteUser,
  safeUpdateUser
}

async function insertUser(user: string, password: string, email: string): Promise<void> {
  const query = () => db.run(
    `INSERT INTO users (name, password, email, creation_date) VALUES (?, ?, ?, strftime('%Y-%m-%d %H:%M:%S', 'now'))`,
    [user, password, email]
  );
  await executeDbQuery(query, 'Error al insertar usuario en la base de datos.');
}

// ⚠️ Get solo para el login
async function getUser(user: string): Promise<{ id_user: number; name: string; password: string; email: string } | null> {
  const query = () => db.query(
    'SELECT * FROM users WHERE name = ?'
  ).get(user) as { id_user: number; name: string; password: string; email: string } | null;
  return await executeDbQuery(query, 'Error al obtener usuario de la base de datos.');
}

// Get seguro para el flujo de trabajo normal
async function safeGetUserByID(id_user: number): Promise<{ id_user: number; name: string; creation_date: string, email: string } | null> {
  const query = () => db.query(
    'SELECT id_user, name, creation_date, email FROM users WHERE id_user = ?'
  ).get(id_user) as { id_user: number; name: string; creation_date: string, email: string } | null;
  return await executeDbQuery(query, 'Error al obtener usuario de la base de datos.');
}

async function deleteUser(id: number): Promise<void> {
  const query = () => db.run(
    `DELETE FROM users WHERE id_user = ?`,
    [id]
  );
  await executeDbQuery(query, 'Error al eliminar el usuario');
}

async function safeUpdateUser(
  id: number,
  name: string,
  email: string
): Promise<void> {
  const query = () => db.run(
    `UPDATE users 
     SET name = ?, email = ?
     WHERE id_user = ?`,
    [name, email, id]
  );
  await executeDbQuery(query, 'Error al actualizar el usuario');
}