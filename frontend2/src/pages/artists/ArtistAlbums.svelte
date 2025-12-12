<script lang="ts">
    import { albumApi, artistApi } from "../../services/apiClient";
    import type { Artist, Album } from "../../types/api";
    import { onMount } from "svelte";
    import ArtistMenu from "../../components/artist/ArtistMenu.svelte";
    import AlbumGrid from "../../components/album/AlbumGrid.svelte";

    export let id: number; // Changed from 'artist' to 'id'
    let artist: Artist | null = null;
    let albums: Album[] = [];
    let error: string | null = null;
    let loading: boolean = true;


    onMount(async () => {
        // Fetch artist data first
        const artistResult = await artistApi.getById(id);
        if (artistResult.success && artistResult.data) {
            artist = artistResult.data;
            
            // Then fetch the albums for that artist
            const albumResult = await albumApi.getByArtistId(id);
            if (albumResult.success) {
                albums = albumResult.data || [];
            } else {
                error = albumResult.error || "Failed to fetch albums";
            }
        } else {
            error = artistResult.error || "Failed to fetch artist details";
        }
        
        loading = false;
    });
</script>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if artist}
    <ArtistMenu {artist} />
    <AlbumGrid {albums} />
{/if}