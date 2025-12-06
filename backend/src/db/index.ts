// src/db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Obtenemos la URL de la base de datos de las variables de entorno
const dbUrl = process.env.DRIZZLE_DATABASE_URL;
if (!dbUrl) {
  throw new Error("DRIZZLE_DATABASE_URL is not set");
}

// Creamos el cliente de libsql
const client = createClient({ url: dbUrl });

// Exportamos el cliente de Drizzle con el esquema completo
export const db = drizzle(client, { schema });
