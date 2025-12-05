<script lang="ts">
    import { Heart } from "flowbite-svelte";
    import { onMount } from "svelte";

    import { playlistApi, userSongRatingApi } from "../services/apiClient";
    import type { Playlist } from "../types/api";
    import type { LikeCount } from "../types/api";
    import { Popover, Button } from "flowbite-svelte";
    import { BookmarkSolid, ThumbsUpSolid } from "flowbite-svelte-icons";

    export let id: number;

    // --- ESTADO LOCAL ---
    let playlists: Playlist[] = [];
    let favoriteCounts: LikeCount = { cuantity_of_likes: 0 };
    let isLiked: boolean = false; // true si el usuario actual ya le dio "me gusta"
    let isLiking: boolean = false; // true mientras se hace la llamada a la API, para deshabilitar el botón

    let loading: boolean = true;
    let error: string | null = null;

    // --- CARGA DE DATOS ---
    onMount(async () => {
        // Usamos Promise.all para hacer ambas llamadas a la API en paralelo
        const [playlistResult, countResult] = await Promise.all([
            playlistApi.getAll(),
            userSongRatingApi.countLikesInSong(id),
            // En una app real, aquí también llamarías a una API para saber si el usuario actual ya dio "like"
            // e.g., userSongRatingApi.getIsLikedByUser(id);
            // isLiked = likeStatusResult.data.isLiked;
        ]);

        if (playlistResult.success) {
            playlists = playlistResult.data || [];
        } else {
            error = playlistResult.error || "Failed to fetch playlists";
        }

        if (countResult.success) {
            favoriteCounts = countResult.data || { cuantity_of_likes: 0 };
        } else {
            error = countResult.error || "Failed to fetch like count";
        }

        loading = false;
    });

    // --- MANEJADOR DEL "ME GUSTA" ---
    async function handleLike() {
        if (isLiking) return; // Evita múltiples clicks si la petición está en curso
        isLiking = true;

        // --- LLAMADA SIMBÓLICA A LA API ---
        // Esto simula que estamos contactando al servidor.
        // En una app real, reemplazarías esto con tu llamada de `userSongRatingApi`.
        await new Promise((resolve) => setTimeout(resolve, 400)); // Simula 400ms de espera

        // Actualizamos el estado local de forma "optimista" (asumiendo que la API tuvo éxito)
        isLiked = !isLiked;
        if (isLiked) {
            favoriteCounts.cuantity_of_likes++;
        } else {
            favoriteCounts.cuantity_of_likes--;
        }

        isLiking = false;
    }
</script>

<div class="interaction-section">
    {#if loading}
        <p>Cargando...</p>
    {:else if error}
        <p class="text-red-600 dark:text-red-400">Error: {error}</p>
    {:else}
        <div class="flex items-center space-x-4">
            <Button pill={true} outline color="blue" onclick={handleLike}>
                <ThumbsUpSolid class="w-6 h-6" />
                {favoriteCounts.cuantity_of_likes}
            </Button>

            <!-- El resto de tu componente no ha cambiado -->
            <Button pill={true} outline color="blue">
                <BookmarkSolid class="w-6 h-6" />
            </Button>
            <Popover title="Playlists" trigger="click">
                <div class="p-4">
                    {#if playlists.length === 0}
                        <p class="text-gray-700 dark:text-gray-300">
                            No hay playlists disponibles.
                        </p>
                    {:else}
                        <ul class="space-y-2">
                            {#each playlists as playlist}
                                <li>
                                    <button
                                        class="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        {playlist.name}
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                </div>
            </Popover>
        </div>
    {/if}
</div>
