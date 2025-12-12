<script lang="ts">
    import type { Album } from "../../types/api";
    import Grid from "../ui/Grid.svelte";
    import AlbumCard from "./AlbumCard.svelte";

    export let albums: Album[] = [];
</script>

{#if albums.length > 0}
    <Grid items={albums} let:item>
        <AlbumCard item={item} />
    </Grid>
{:else}
    <p class="text-center text-gray-500 dark:text-gray-400">No se encontraron álbumes.</p>
{/if}
