<script lang="ts">
    import type { Song, Playlist } from "../types/api";
    import { Card, Popover, Button } from "flowbite-svelte";
    import { PlayCircle, PauseCircle, Heart, Bookmark } from "svelte-heros-v2";

    import { playerStore } from "../stores/playerStore";
    import { likedSongsStore } from "../stores/likesStore";

    export let song: Song;
    export let playlists: Playlist[];
    export let playlistContext: Song[] = [];

    // --- ESTADO LOCAL Y STORES ---
    let currentPlayingId: number | null = null;
    let isPlaying: boolean = false;
    let isLiking: boolean = false;

    // Suscripciones a los stores para reactividad
    playerStore.subscribe((store) => {
        currentPlayingId = store.currentSong?.id_song ?? null;
        isPlaying = store.isPlaying;
    });

    // --- MANEJADORES DE ACCIONES ---
    function handlePlay(e: MouseEvent) {
        e.stopPropagation();
        playerStore.playSong(song, playlistContext);
    }

    async function handleLike(e: MouseEvent) {
        e.stopPropagation();
        if (isLiking) return;
        isLiking = true;

        await likedSongsStore.toggleLike(song.id_song);

        isLiking = false;
    }

    async function handleAddToPlaylist(e: MouseEvent, playlistId: number) {
        e.stopPropagation();
        console.log(
            `SIMULACIÓN: Añadiendo canción ${song.id_song} a playlist ${playlistId}`,
        );
        alert(`Canción añadida a la playlist (simulación)`);
        // Aquí iría tu llamada a la API real:
        // await playlistApi.addSongToPlaylist(playlistId, song.id_song);
    }
</script>

<Card class="p-0 group relative">
    <!-- Imagen de la tarjeta -->
    <img
        src={song.cover_path || "/default-cover.png"}
        alt="Cover de {song.title}"
        class="w-full h-48 object-cover rounded-t-lg"
    />
    <!-- Contenedor de botones que aparece en hover -->
    <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <!-- Botón de Like -->
        <Button
            pill
            class="!p-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all active:scale-90"
            onclick={handleLike}
            disabled={isLiking}
        >
            <Heart
                class="w-6 h-6 transition-colors {$likedSongsStore.has(
                    song.id_song,
                )
                    ? 'text-red-500 fill-red-500'
                    : ''}"
            />
        </Button>

        <!-- Botón de Reproducir/Pausa -->
        <Button
            pill
            class="!p-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all active:scale-90"
            onclick={handlePlay}
        >
            {#if currentPlayingId === song.id_song && isPlaying}
                <PauseCircle class="w-8 h-8 text-blue-500" />
            {:else}
                <PlayCircle class="w-8 h-8" />
            {/if}
        </Button>

        <!-- Botón de Añadir a Playlist con Popover -->
        <Button
            pill
            slot="trigger"
            class="!p-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all active:scale-90"
        >
            <Bookmark class="w-6 h-6" />
        </Button>
        <Popover trigger="click" class="w-48 text-sm">
            <div class="p-2">
                <h6 class="font-semibold mb-2">Añadir a...</h6>
                {#if playlists && playlists.length > 0}
                    <ul class="space-y-1 max-h-40 overflow-y-auto">
                        {#each playlists as playlist}
                            <li>
                                <button
                                    on:click={(e) =>
                                        handleAddToPlaylist(
                                            e,
                                            playlist.id_playlist,
                                        )}
                                    class="w-full text-left p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    {playlist.name}
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="text-xs text-gray-500">No tienes playlists.</p>
                {/if}
            </div>
        </Popover>
    </div>

    <!-- Información de la canción -->
    <div class="p-4">
        <h5
            class="mb-1 text-md font-bold tracking-tight text-gray-900 dark:text-white truncate"
        >
            <a href={`/songs/${song.id_song}`} class="hover:underline"
                >{song.title}</a
            >
        </h5>
        <p
            class="font-normal text-sm text-gray-700 dark:text-gray-400 truncate"
        >
            {song.artist_names || "Desconocido"}
        </p>
    </div>
</Card>
