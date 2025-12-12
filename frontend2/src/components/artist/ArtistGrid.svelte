<script lang="ts">
    import type { Artist } from "../../types/api";
    import Grid from "../ui/Grid.svelte";
    import ArtistCard from "./ArtistCard.svelte";

    export let artists: Artist[] = [];
</script>

{#if artists.length > 0}
    <Grid items={artists} let:item>
        <ArtistCard item={item} />
    </Grid>
{:else}
    <p class="text-center text-gray-500 dark:text-gray-400">No se encontraron artistas.</p>
{/if}
