<script lang="ts">
    import type { Album } from "../types/api";
    import { Card } from "flowbite-svelte";

    export let albums: Album[] = [];
</script>

{#if albums.length === 0}
    <div class="text-gray-500 dark:text-gray-400 text-center text-lg py-10">
        No se encontraron álbumes.
    </div>
{:else}
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
    >
        {#each albums as album (album.id_album)}
            <Card
                href={`/albums/${album.id_album}`}
                class="p-4 flex flex-col justify-between h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
                <div>
                    <h5
                        class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate"
                    >
                        {album.name}
                    </h5>
                    <img
                        src={album.cover_path || "/default-cover.png"}
                        alt="Cover de {album.name}"
                        class="w-full h-48 object-cover mb-4 rounded-md"
                    />
                    <p
                        class="font-normal text-gray-700 dark:text-gray-400 text-sm"
                    >
                        Artista: {album.artist_name || "Desconocido"}
                    </p>
                </div>
            </Card>
        {/each}
    </div>
{/if}
