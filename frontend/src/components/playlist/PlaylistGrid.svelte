<script lang="ts">
    import type { Playlist } from "../../types/api";
    import PlaylistCard from "./PlaylistCard.svelte";

    // This component now receives the playlists as a prop and forwards events up.
    export let playlists: Playlist[] = [];

</script>

    <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
        {#each playlists as playlist (playlist.id)}
            <PlaylistCard {playlist} on:playlistActionCompleted />
        {/each}
    </div>
