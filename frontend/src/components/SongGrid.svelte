<script lang="ts">
    import type { Song, Playlist } from "../types/api";
    import { onMount } from "svelte";
    import { playlistApi } from "../services/apiClient";
    import SongCard from "./SongCard.svelte"; // Import the new component

    export let songs: Song[] = [];
    
    let playlists: Playlist[] = [];

    // On mount, we only need to fetch the list of playlists once for the whole grid.
    onMount(async () => {
        const result = await playlistApi.getAll();
        if (result.success) {
            playlists = result.data || [];
        } else {
            console.error("Failed to fetch playlists for SongGrid:", result.error);
        }
    });
</script>

{#if songs.length === 0}
    <div class="text-gray-500 dark:text-gray-400 text-center text-lg py-10">
        No se encontraron canciones.
    </div>
{:else}
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {#each songs as song (song.id_song)}
            <!-- Render a SongCard for each song, passing down the song data and the playlists list -->
            <SongCard {song} {playlists} />
        {/each}
    </div>
{/if}
