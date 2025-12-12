<!-- src/components/ui/ImageCard.svelte -->
<script lang="ts">
    import { Card } from "flowbite-svelte";
    export let imageUrl: string;
</script>

<Card class="p-0 group relative overflow-hidden">
    <!-- Image Container with forced square aspect ratio -->
    <div class="relative w-full aspect-square">
        <!-- Image link slot -->
        <slot name="image-link" />
        
        <!-- Image -->
        <img src={imageUrl} alt="" class="w-full h-full object-cover" />

        <!-- Actions Overlay -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10">
            <slot name="actions" />
        </div>
    </div>

    <!-- Text Content -->
    <div class="p-4">
        <slot />
    </div>
</Card>
