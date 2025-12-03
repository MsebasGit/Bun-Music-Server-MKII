<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Spinner } from "flowbite-svelte";
    import { userSongRatingApi } from '../../services/apiClient';
    import type { Song } from '../../types/api';

    let songs: Song[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await userSongRatingApi.getLikedSongsByUser();
        if (result.success) {
            songs = result.data || [];
        } else {
            error = result.error || 'Failed to fetch artists';
        }
        loading = false;
    });
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Todas las Canciones</h1>

    {#if loading}
        <div class="flex justify-center items-center h-40">
            <Spinner color="blue" size="8" />
            <p class="ml-2 text-gray-700 dark:text-gray-300">Cargando canciones...</p>
        </div>
    {:else if error}
        <div class="text-red-600 dark:text-red-400 text-center text-lg">
            <p>Error: {error}</p>
            <p>No se pudieron cargar las canciones.</p>
        </div>
    {:else if songs.length === 0}
        <div class="text-gray-500 dark:text-gray-400 text-center text-lg">
            No se encontraron canciones.
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each songs as song (song.id_song)}
                <Card href={`/songs/${song.id_song}`} class="p-4 flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div>
                        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                            {song.title}
                        </h5>
                        <img
                            src={song.cover_path || '/default-cover.png'}
                            alt="Cover de {song.title}"
                            class="w-full h-48 object-cover mb-4 rounded-md"
                        />
                        <p class="font-normal text-gray-700 dark:text-gray-400 text-sm">
                            Artista: {song.artist_names || 'Desconocido'}
                        </p>
                        {#if song.album_name}
                            <p class="font-normal text-gray-700 dark:text-gray-400 text-sm">
                                Álbum: {song.album_name}
                            </p>
                        {/if}
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</div>

