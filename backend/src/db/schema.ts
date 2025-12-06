// src/db/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Definimos la tabla 'users' (equivalente a tu modelo User anterior)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
});

// Tipos inferidos automáticamente (¡Magia!)
export type User = typeof users.$inferSelect; // Tipo para seleccionar
export type NewUser = typeof users.$inferInsert; // Tipo para insertar