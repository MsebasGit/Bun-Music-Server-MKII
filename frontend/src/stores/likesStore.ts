import { writable } from 'svelte/store';
import { userSongRatingApi } from '../services/apiClient';

const { subscribe, update, set } = writable(new Set<number>());

/**
 * Carga los likes reales del usuario desde la base de datos.
 */
async function fetchInitialLikes() {
    try {
        const result = await userSongRatingApi.getLikedSongsByUser();
        if (result.success && Array.isArray(result.data)) {
            // Extraemos solo los IDs de las canciones que vienen de la API
            const ids = result.data.map(song => song.id_song);
            set(new Set(ids));
        }
    } catch (err) {
        console.error("Error inicializando likesStore:", err);
    }
}

/**
 * Lógica de Toggle: Decide si dar Like o quitarlo según el estado actual.
 */
async function toggleLike(songId: number) {
    let isCurrentlyLiked = false;
    
    // Leemos el estado actual del store
    update(currentSet => {
        isCurrentlyLiked = currentSet.has(songId);
        return currentSet;
    });

    let result;
    if (isCurrentlyLiked) {
        // El ID 0 es placeholder, tu interceptor ya envía el JWT para identificar al usuario
        result = await userSongRatingApi.unlikeSong(songId);
    } else {
        result = await userSongRatingApi.likeSong(songId);
    }

    if (result.success) {
        // Actualizamos el estado global solo si la API confirmó la operación
        update(currentSet => {
            const newSet = new Set(currentSet);
            if (newSet.has(songId)) {
                newSet.delete(songId);
            } else {
                newSet.add(songId);
            }
            return newSet;
        });
    } else {
        console.error("Error en la API al procesar Like:", result.error);
    }
}

export const likedSongsStore = {
    subscribe,
    toggleLike,
    fetchInitialLikes,
    // Helper útil para ver si una canción tiene like sin suscribirse manualmente
    reset: () => set(new Set())
};