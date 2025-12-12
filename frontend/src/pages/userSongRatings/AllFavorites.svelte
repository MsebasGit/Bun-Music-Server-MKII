<script lang="ts">
    import { onMount } from "svelte";
    import { Heading,Spinner } from "flowbite-svelte";
    import { songApi } from "../../services/apiClient";
    import type { Song } from "../../types/api";
    import SongGrid from "../../components/song/SongGrid.svelte";

    let songs: Song[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await songApi.getFavorites();
        if (result.success) {
            songs = result.data || [];
        } else {
            error = result.error || "Failed to fetch songs";
        }
        loading = false;
    });
</script>

<div class="container mx-auto p-4">
    <Heading tag="h1" class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Todas las Canciones
    </Heading>

    {#if loading}
        <div class="flex justify-center items-center h-40">
            <Spinner color="blue" size="8" />
            <p class="ml-2 text-gray-700 dark:text-gray-300">
                Cargando canciones...
            </p>
        </div>
    {:else if error}
        <div class="text-red-600 dark:text-red-400 text-center text-lg">
            <p>Error: {error}</p>
            <p>No se pudieron cargar las canciones.</p>
        </div>
    {:else}
        <SongGrid {songs} />
    {/if}
</div>
