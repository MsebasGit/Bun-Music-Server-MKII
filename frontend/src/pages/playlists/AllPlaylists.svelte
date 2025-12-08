<script lang="ts">
    import { onMount } from "svelte";
    import { Spinner, Heading, Button, Popover } from "flowbite-svelte";
    import { playlistApi } from "../../services/apiClient";
    import type { Playlist } from "../../types/api";
    import PlaylistGrid from "../../components/PlaylistGrid.svelte";
    import NewPlaylist from "../../components/NewPlaylist.svelte";

    let playlists: Playlist[] = [];
    let loading: boolean = true;
    let error: string | null = null;
    let showCreatePopover = false;

    async function fetchPlaylists() {
        loading = true;
        error = null;
        const result = await playlistApi.getMe();
        if (result.success) {
            playlists = result.data || [];
        } else {
            error = result.error || "Failed to fetch playlists";
        }
        loading = false;
    }

    onMount(fetchPlaylists);

    // Handles optimistic update for creation
    function handlePlaylistCreated(newPlaylist: Playlist) {
        playlists = [...playlists, newPlaylist];
        showCreatePopover = false; // Close the popover
    }

    // Handles full refresh for edit/delete
    function refreshList() {
        fetchPlaylists();
    }
</script>

<div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
        <Heading
            tag="h1"
            class="text-3xl font-bold text-gray-900 dark:text-white"
        >
            Tus Playlists
        </Heading>

        <div>
            <Button outline color="blue">
                Crear Nueva Playlist
            </Button>
            <Popover trigger="click" class="w-64 text-sm p-4">
                <NewPlaylist 
                    onCreated={handlePlaylistCreated} 
                    onClose={() => showCreatePopover = false} 
                />
            </Popover>
        </div>
    </div>


    {#if loading && playlists.length === 0}
        <div class="flex justify-center items-center h-40">
            <Spinner color="blue" size="8" />
            <p class="ml-2 text-gray-700 dark:text-gray-300">
                Cargando playlists...
            </p>
        </div>
    {:else if error}
        <div class="text-red-600 dark:text-red-400 text-center text-lg">
            <p>Error: {error}</p>
            <p>No se pudieron cargar las playlists.</p>
        </div>
    {:else if playlists.length === 0}
        <div class="text-gray-500 dark:text-gray-400 text-center text-lg">
            No has creado ninguna playlist todavía.
        </div>
    {:else}
        <PlaylistGrid {playlists} on:playlistActionCompleted={refreshList} />
    {/if}
</div>

