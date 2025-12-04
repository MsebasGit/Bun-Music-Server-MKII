<script lang="ts">
    import { Heart } from "flowbite-svelte";
    import { onMount } from "svelte";

    import { playlistApi } from "../services/apiClient";
    import { userSongRatingApi } from "../services/apiClient";
    import type { Playlist } from "../types/api";
    import type { LikeCount } from "../types/api";
    import { Popover, Button } from "flowbite-svelte";

    let playlists: Playlist[] = [];
    let favoriteCounts: LikeCount = { cuantity_of_likes: 0 };
    let error: string | null = null;
    let loading: boolean = true;
    export let id: number;

    onMount(async () => {
        const result = await playlistApi.getAll();
        if (result.success) {
            playlists = result.data || [];
        } else {
            error = result.error || "Failed to fetch songs";
        }
        loading = false;
    });

    onMount(async () => {
        const result = await userSongRatingApi.countLikesInSong(id);
        if (result.success) {
            favoriteCounts = result.data || { cuantity_of_likes: 0 };
        } else {
            error = result.error || "Failed to fetch songs";
        }
        loading = false;
    });
</script>

<div class="interaction-section">
    {#if loading}
        <p>Cargando...</p>
    {:else if error}
        <p class="text-red-600 dark:text-red-400">Error: {error}</p>
    {:else}
        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-1">
                <Button outline color="red"
                    >Me gusta</Button
                >   
                <Heart class="text-red-500 w-6 h-6" />
                <span class="text-gray-700 dark:text-gray-300"
                    >{favoriteCounts.cuantity_of_likes}</span
                >
            </div>
            <Button outline color="blue">Agregar a Playlist</Button>
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
