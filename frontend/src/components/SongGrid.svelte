<script lang="ts">
    import type { Song } from "../types/api";
    import { Card } from "flowbite-svelte";
    import { PlayCircle, PauseCircle } from "svelte-heros-v2";
    import { playerStore } from "../stores/playerStore";

    export let songs: Song[] = [];

    let currentSongId: number | null = null;
    let isPlaying: boolean = false;

    playerStore.subscribe((store) => {
        currentSongId = store.currentSong?.id_song ?? null;
        isPlaying = store.isPlaying;
    });

    function handlePlay(e: MouseEvent, song: Song) {
        e.stopPropagation(); // Prevent card's link navigation
        playerStore.playSong(song);
    }
</script>

{#if songs.length === 0}
    <div class="text-gray-500 dark:text-gray-400 text-center text-lg py-10">
        No se encontraron canciones.
    </div>
{:else}
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6"
    >
        {#each songs as song (song.id_song)}
            <Card class="p-0 group relative">
                <a href={`/songs/${song.id_song}`} class="block">
                    <img
                        src={song.cover_path || "/default-cover.png"}
                        alt="Cover de {song.title}"
                        class="w-full h-48 object-cover rounded-t-lg"
                    />
                </a>
                <div class="p-4">
                    <h5
                        class="mb-1 text-md font-bold tracking-tight text-gray-900 dark:text-white truncate"
                    >
                        <a
                            href={`/songs/${song.id_song}`}
                            class="hover:underline">{song.title}</a
                        >
                    </h5>
                    <p
                        class="font-normal text-sm text-gray-700 dark:text-gray-400 truncate"
                    >
                        {song.artist_names || "Desconocido"}
                    </p>
                </div>
                <button
                    on:click={(e) => handlePlay(e, song)}
                    class="absolute top-36 right-3 text-white bg-black bg-opacity-50 rounded-full p-1 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none"
                    aria-label="Reproducir"
                >
                    {#if currentSongId === song.id_song && isPlaying}
                        <PauseCircle class="w-10 h-10 text-blue-500" />
                    {:else}
                        <PlayCircle class="w-10 h-10" />
                    {/if}
                </button>
            </Card>
        {/each}
    </div>
{/if}
