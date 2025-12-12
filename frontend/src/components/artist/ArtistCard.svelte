<script lang="ts">
    import type { Artist } from "../../types/api";
    import TextCard from "../ui/TextCard.svelte";

    export let item: Artist;
</script>

<TextCard 
    href={`/artists/${item.id}`}
    title={item.name}
    subtitle={item.biography}
/>
