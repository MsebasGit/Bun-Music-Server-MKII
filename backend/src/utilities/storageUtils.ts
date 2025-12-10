// services/storage.service.ts
import { handleFileUpload } from './fileUtils'; // Importa tu función base actual



/**
 * Sube una imagen aplicando las reglas de negocio de la aplicación.
 * @param file El archivo a subir.
 * @param subfolder La subcarpeta donde guardar (ej: 'album_covers', 'songs').
 * @returns La ruta relativa donde se guardó.
 */
export const uploadAppImage = async (file: any, subfolder: string): Promise<string | null> => {
    // Definimos las constantes globales aquí
    const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    const BASE_IMG_DIR = '/img';
    if (!file) return null; // O lanzar error si es obligatorio

    const destination = `${BASE_IMG_DIR}/${subfolder}`;

    // Reutilizamos tu handleFileUpload existente pero con la config inyectada
    return await handleFileUpload(file, IMAGE_EXTENSIONS, destination);
};

export const uploadSongFile = async (file: any, subfolder: string): Promise<string | null> => {
    // Definimos las constantes globales aquí
    const AUDIO_EXTENSIONS = ['mp3', 'wav', 'flac', 'aac'];
    const BASE_AUDIO_DIR = '/music';
    if (!file) return null; // O lanzar error si es obligatorio

    const destination = `${BASE_AUDIO_DIR}/${subfolder}`;

    // Reutilizamos tu handleFileUpload existente pero con la config inyectada
    return await handleFileUpload(file, AUDIO_EXTENSIONS, destination);
}