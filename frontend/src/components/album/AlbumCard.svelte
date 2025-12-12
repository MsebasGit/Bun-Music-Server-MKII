<script lang="ts">
    import { Heading } from "flowbite-svelte";
    import type { Album } from "../../types/api";
    import ImageCard from "../ui/ImageCard.svelte";

    export let item: Album;
</script>

<ImageCard imageUrl={item.cover_path}>
    <a slot="image-link" href={`/albums/${item.id_album}`} class="before:absolute before:inset-0 z-10"></a>
    
    <div class="text-center">
        <Heading tag="h5" class="mb-1 text-md font-bold text-gray-900 dark:text-white truncate" title={item.name}>
            {item.name}
        </Heading>
        <p class="font-normal text-sm text-gray-700 dark:text-gray-400 truncate">
            {item.artist_name || "Desconocido"}
        </p>
    </div>
</ImageCard>
