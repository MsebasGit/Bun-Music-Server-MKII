<script lang="ts">
    import { onMount } from 'svelte';
    import { Card, Spinner } from "flowbite-svelte";
    import { artistApi } from '../../services/apiClient';
    import type { Artist } from '../../types/api';

    let artists: Artist[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await artistApi.getAll();
        if (result.success) {
            artists = result.data || [];
        } else {
            error = result.error || 'Failed to fetch artists';
        }
        loading = false;
    });
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Todas los álbumes</h1>

    {#if loading}
        <div class="flex justify-center items-center h-40">
            <Spinner color="blue" size="8" />
            <p class="ml-2 text-gray-700 dark:text-gray-300">Cargando álbumes...</p>
        </div>
    {:else if error}
        <div class="text-red-600 dark:text-red-400 text-center text-lg">
            <p>Error: {error}</p>
            <p>No se pudieron cargar los álbumes.</p>
        </div>
    {:else if artists.length === 0}
        <div class="text-gray-500 dark:text-gray-400 text-center text-lg">
            No se encontraron álbumes.
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {#each artists as artist (artist.id_artist)}
                <Card href={`/artists/${artist.id_artist}`} class="p-4 flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div>
                        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                            {artist.name}
                        </h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400 text-sm">
                            Artista: {artist.nationality || 'Desconocido'}
                        </p>
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</div>
