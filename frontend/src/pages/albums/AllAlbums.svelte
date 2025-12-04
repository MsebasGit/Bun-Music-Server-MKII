<script lang="ts">
    import { onMount } from 'svelte';
    import { Spinner } from "flowbite-svelte";
    import { albumApi } from '../../services/apiClient';
    import type { Album } from '../../types/api';
    import AlbumGrid from '../../components/AlbumGrid.svelte';

    let albums: Album[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await albumApi.getAll();
        if (result.success) {
            albums = result.data || [];
        } else {
            error = result.error || 'Failed to fetch albums';
        }
        loading = false;
    });
</script>

<div class="container mx-auto p-4">
    <!-- Title is managed by SidebarLayout -->

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
    {:else}
        <AlbumGrid {albums} />
    {/if}
</div>
