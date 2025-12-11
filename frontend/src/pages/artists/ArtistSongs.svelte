<script lang="ts">
    import { songApi, artistApi } from "../../services/apiClient"; // Import artistApi
    import type { Artist, Song } from "../../types/api";
    import { onMount } from "svelte";
    import SongGrid from "../../components/song/SongGrid.svelte";
    import ArtistMenu from "../../components/artist/ArtistMenu.svelte";

    export let id: string; // Accepts ID from route
    let artist: Artist | null = null; // Store fetched artist
    let songs: Song[] = [];
    let error: string | null = null;
    let loading: boolean = true;

    onMount(async () => {
        if (!id) {
            error = "Artist ID is missing.";
            loading = false;
            return;
        }

        // Fetch Artist details
        const artistResult = await artistApi.getById(Number(id));
        if (artistResult.success && artistResult.data) {
            artist = artistResult.data;
            
            // Fetch songs for the artist
            const songsResult = await songApi.getByArtistId(artist.id);
            if (songsResult.success) {
                songs = songsResult.data || [];
            } else {
                error = songsResult.error || "Failed to fetch songs";
            }
        } else {
            error = artistResult.error || "Failed to fetch artist details";
        }
        loading = false;
    });
</script>

{#if loading}
    <p>Cargando canciones del artista...</p>
{:else if error}
    <p class="text-red-600">Error: {error}</p>
{:else if artist}
    <ArtistMenu {artist}>
    </ArtistMenu>
    <SongGrid {songs} />
{:else}
    <p>Artista no encontrado.</p>
{/if}
