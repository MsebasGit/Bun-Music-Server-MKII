<script lang="ts">
    import type { Artist } from "../types/api";
    import { Card } from "flowbite-svelte";

    export let artists: Artist[] = [];
</script>

{#if artists.length === 0}
    <div class="text-gray-500 dark:text-gray-400 text-center text-lg py-10">
        No se encontraron artistas.
    </div>
{:else}
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
    >
        {#each artists as artist (artist.id_artist)}
            <Card
                href={`/artists/${artist.id_artist}`}
                class="p-4 flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
                <div>
                    <h5
                        class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate"
                    >
                        {artist.name}
                    </h5>
                    <p
                        class="font-normal text-gray-700 dark:text-gray-400 text-sm"
                    >
                        Nacionalidad: {artist.nationality || "Desconocida"}
                    </p>
                </div>
            </Card>
        {/each}
    </div>
{/if}
