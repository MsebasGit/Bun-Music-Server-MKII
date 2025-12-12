// src/utilities/fileUtils.ts
import fs from 'fs';

/**
 * Genera un nombre de archivo seguro y único (evitando conflictos y caracteres especiales).
 * @param originalName El nombre original del archivo.
 * @returns Un nombre de archivo seguro con marca de tiempo.
 */
function generateSafeFilename(originalName: string): string {
    const parts = originalName.split('.');
    const ext = parts.pop()?.toLowerCase();
    const name = parts.join('.');
    
    // Limpia el nombre para solo permitir alfanuméricos y reemplaza con guiones bajos
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    return `${safeName}_${Date.now()}.${ext}`;
}


/**
 * Maneja la subida de un archivo, incluyendo validación y guardado.
 * @param file El archivo a subir (Objeto File de Bun/Elysia).
 * @param allowedExtensions Un array de extensiones permitidas (ej. ['jpg', 'png']).
 * @param destinationDir El directorio de destino relativo a `static` (ej. '/img/covers').
 * @returns La ruta relativa del archivo guardado, que se almacenará en la DB (ej: /img/covers/archivo.jpg).
 * @throws Error si el tipo de archivo es inválido.
 */
export async function handleFileUpload(
    file: File,
    allowedExtensions: string[],
    destinationDir: string
): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    
    // 1. Validación de extensión
    if (!fileExtension || !allowedExtensions.includes(fileExtension.toLowerCase())) {
        throw new Error(`Tipo de archivo inválido. Las extensiones permitidas son: ${allowedExtensions.join(', ')}.`);
    }

    // 2. Generación de rutas
    const filename = generateSafeFilename(file.name);
    
    // Aseguramos que destinationDir no tenga una barra inicial y lo limpiamos
    const cleanDir = destinationDir.replace(/^\/+/, ''); 
    const relativePath = `${cleanDir}/${filename}`;
    
    // La ruta física completa en el servidor (ej: public/img/covers/archivo.jpg)
    const uploadPath = `public/${relativePath}`; 

    // Opcional: Asegurar que el directorio existe (recomendado)
    // await fs.promises.mkdir(`public/${cleanDir}`, { recursive: true });

    // 3. Guardado del archivo usando Bun.write
    // Bun.write puede aceptar arrayBuffer() o el objeto File directamente en algunas versiones
    await Bun.write(uploadPath, file); 

    // Retorna la ruta web que se usará para acceder a la imagen
    return `/${relativePath}`; 
}


/**
 * Elimina un archivo del sistema de archivos.
 * @param relativePath La ruta relativa del archivo desde la carpeta `public` (ej: /img/covers/archivo.jpg).
 */
export async function deleteFile(relativePath: string | null): Promise<void> {
    if (!relativePath) {
        console.log("No se proporcionó ruta de archivo para eliminar, omitiendo.");
        return;
    }
    
    // Construye la ruta física completa
    const fullPath = `public${relativePath}`;

    try {
        await fs.promises.unlink(fullPath);
        console.log(`Archivo eliminado: ${fullPath}`);
    } catch (error: any) {
        // Si el archivo no existe, no es un error crítico en este contexto.
        if (error.code === 'ENOENT') {
            console.warn(`Intento de eliminar un archivo que no existe: ${fullPath}`);
        } else {
            // Para otros errores, sí queremos saber qué pasó.
            console.error(`Error al eliminar el archivo ${fullPath}:`, error);
            throw error; // Opcional: relanzar si el llamador debe manejarlo
        }
    }
}