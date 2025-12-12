<script lang="ts">
    import type { Playlist } from "../../types/api";
    import PlaylistCard from "./PlaylistCard.svelte";
    import Grid from "../ui/Grid.svelte";

    export let playlists: Playlist[] = [];

    const handlePlaylistDeleted = (event: CustomEvent<{ id_playlist: number }>) => {
        playlists = playlists.filter(p => p.id !== event.detail.id_playlist);
    };
</script>

{#if playlists.length > 0}
    <Grid items={playlists} let:item>
        <PlaylistCard playlist={item} on:playlistDeleted={handlePlaylistDeleted} />
    </Grid>
{:else}
    <p class="text-center text-gray-500 dark:text-gray-400">No se encontraron playlists.</p>
{/if}
