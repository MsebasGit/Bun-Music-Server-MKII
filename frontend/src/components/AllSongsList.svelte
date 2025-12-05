<script lang="ts">
    import { onMount } from 'svelte';
    import { songApi } from '../services/apiClient';
    import type { Song } from '../types/api';
    import { Spinner, Alert, Card, Heading } from 'flowbite-svelte';

    export let currentSongId: number;

    let songs: Song[] = [];
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await songApi.getAll();
        if (result.success && result.data) {
            // Filtramos la canción actual para no mostrarla en la lista
            songs = result.data.filter(s => s.id_song !== currentSongId);
        } else {
            error = result.error || 'No se pudieron cargar las canciones.';
        }
        loading = false;
    });
</script>

<Card>
    <Heading tag="h5">Descubrir más</Heading>
    <div class="flex flex-col mt-4 divide-y divide-gray-200 dark:divide-gray-700 max-h-[70vh] overflow-y-auto">
        {#if loading}
            <div class="flex justify-center items-center py-4">
                <Spinner />
            </div>
        {:else if error}
            <Alert color="red">{error}</Alert>
        {:else if songs.length === 0}
            <p class="text-gray-500 dark:text-gray-400">No hay más canciones para mostrar.</p>
        {:else}
            {#each songs as song (song.id_song)}
                <a 
                    href={`/songs/${song.id_song}`} 
                    class="flex items-center p-3 -mx-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                >
                    <img class="w-12 h-12 object-cover rounded-md mr-4" src={song.cover_path || '/default-cover.png'} alt="Cover de {song.title}" />
                    <div class="flex-grow overflow-hidden">
                        <p class="font-semibold text-gray-900 dark:text-white truncate">{song.title}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{song.artist_names || 'Artista desconocido'}</p>
                    </div>
                </a>
            {/each}
        {/if}
    </div>
</Card>
