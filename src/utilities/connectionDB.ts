import { Database } from 'bun:sqlite';

// 1. Crear la instancia de la base de datos
export const db = new Database('data/music-server.db');

// 2. Activar las llaves foráneas para esta conexión
try {
    db.exec("PRAGMA foreign_keys = ON;");
} catch (error) {
    console.error("Error al activar foreign keys:", error);
}

// Ahora 'db' está lista para ser usada en otros archivos
