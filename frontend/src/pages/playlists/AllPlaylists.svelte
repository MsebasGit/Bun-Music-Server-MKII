<script lang="ts">
    import { onMount } from "svelte";
    import { Card, Spinner, Heading, Button, Popover } from "flowbite-svelte";
    import { playlistApi } from "../../services/apiClient";
    import type { Playlist } from "../../types/api";
    import NewPlaylist from "./newPlaylist.svelte";

    let playlists: Playlist[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await playlistApi.getMe();
        if (result.success) {
            playlists = result.data || [];
        } else {
            error = result.error || "Failed to fetch playlists";
        }
        loading = false;
    });
</script>

<div class="container mx-auto p-4">
    <Heading tag="h1" class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Tus Playlists
    </Heading>

    
    <Button slot="trigger" class="mb-4" outline color="blue">
        Crear Nueva Playlist
    </Button>
    <Popover trigger="click" class="w-56 text-sm">
        <NewPlaylist />
    </Popover>

    {#if loading}
        <div class="flex justify-center items-center h-40">
            <Spinner color="blue" size="8" />
            <p class="ml-2 text-gray-700 dark:text-gray-300">
                Cargando playlists...
            </p>
        </div>
    {:else if error}
        <div class="text-red-600 dark:text-red-400 text-center text-lg">
            <p>Error: {error}</p>
            <p>No se pudieron cargar los playlists.</p>
        </div>
    {:else if playlists.length === 0}
        <div class="text-gray-500 dark:text-gray-400 text-center text-lg">
            No se encontraron playlists.
        </div>
    {:else}
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            {#each playlists as playlist (playlist.id_playlist)}
                <Card
                    href={`/playlists/${playlist.id_playlist}`}
                    class="p-4 flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <div>
                        <h5
                            class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate"
                        >
                            {playlist.name}
                        </h5>
                        <p
                            class="font-normal text-gray-700 dark:text-gray-400 text-sm"
                        >
                            Descripción: {playlist.description}
                        </p>
                    </div>
                </Card>
            {/each}
        </div>
    {/if}
</div>
