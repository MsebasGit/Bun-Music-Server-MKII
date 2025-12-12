<script lang="ts">
    import type { Song } from "../../types/api";
    import SongCard from "./SongCard.svelte";
    import Grid from "../ui/Grid.svelte";

    export let songs: Song[] = [];
</script>

{#if songs.length > 0}
    <Grid items={songs} let:item>
        <SongCard song={item} />
    </Grid>
{:else}
    <p class="text-center text-gray-500 dark:text-gray-400">No se encontraron canciones.</p>
{/if}
