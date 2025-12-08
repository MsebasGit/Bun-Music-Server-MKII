// src/services/users.service.ts
import { db } from "../db";
import { users, type User } from "../db/schema";
import { eq } from "drizzle-orm";
import { handleDrizzleResult, handleDeleteResult } from "../utilities/validationUtils";

// OBTENER USUARIO POR ID
export const getUserById = async (id: number) => {
    const result = await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: { id: true, name: true, email: true, creationDate: true }
    });
    // handleDrizzleResult no funciona bien aquí porque findFirst no devuelve un array
    if (!result) {
        throw new Error("Usuario no encontrado");
    }
    return result;
};

// ACTUALIZAR USUARIO
export const updateUser = async (id: number, data: Partial<Pick<User, 'name' | 'email'>>) => {
    if (!data.name && !data.email) {
        throw new Error("Se requiere al menos un campo (nombre o email) para actualizar.");
    }
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning({
        id: users.id,
        name: users.name,
        email: users.email,
    });
    return handleDrizzleResult(result, "Usuario", "actualizar");
};

// ELIMINAR USUARIO
export const deleteUser = async (id: number) => {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return handleDeleteResult(result, "Usuario");
};
