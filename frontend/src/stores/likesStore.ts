import { writable } from 'svelte/store';
import { userSongRatingApi } from '../services/apiClient';

// --- Store ---
// Un Set es eficiente para guardar y buscar IDs únicos.
const { subscribe, update } = writable(new Set<number>());

// --- Lógica y Helpers ---

/**
 * Carga los likes iniciales del usuario desde la API.
 * Debería llamarse una vez cuando la aplicación se inicia (e.g., en App.svelte o un layout principal).
 */
async function fetchInitialLikes() {
    // En una app real, esto obtendría los likes del usuario logueado
    // const result = await userSongRatingApi.getAllUserLikes(); 
    // if (result.success) {
    //     update(() => new Set(result.data.map(like => like.songId)));
    // }
    
    // Para la demo, empezamos con un Set vacío.
    console.log("Store de Likes inicializado.");
}

/**
 * Alterna el estado de "like" para una canción.
 * @param songId El ID de la canción.
 */
async function toggleLike(songId: number) {
    // Simulación de API
    await new Promise(resolve => setTimeout(resolve, 300));
    // En una app real: await userSongRatingApi.toggleLike(songId);

    // Actualiza el store.
    update(set => {
        if (set.has(songId)) {
            set.delete(songId);
        } else {
            set.add(songId);
        }
        return set;
    });
}

// --- Exportación ---
export const likedSongsStore = {
    subscribe,
    toggleLike,
    fetchInitialLikes,
};
