<script lang="ts">
    import type { Song, Playlist } from "../../types/api";
    import { Popover, Button, Heading} from "flowbite-svelte";
    import { PlayCircle, PauseCircle, Heart, Bookmark } from "svelte-heros-v2";
    import { playlistApi } from "../../services/apiClient";
    import ImageCard from "../ui/ImageCard.svelte";

    import { playerStore } from "../../stores/playerStore";
    import { likedSongsStore } from "../../stores/likesStore";
    import { onMount } from "svelte";

    export let song: Song;
    export let playlistContext: Song[] = [];

    let playlists: Playlist[] = [];
    let isLiking: boolean = false;
    let error: string | null = null;

    // Usamos el prefijo $ para acceder al valor del store de forma reactiva
    $: isPlaying = $playerStore.currentSong?.id_song === song.id_song && $playerStore.isPlaying;
    $: hasLike = $likedSongsStore.has(song.id_song);

    onMount(async () => {
        const result = await playlistApi.getPlaylistsWhereSongNotExist(song.id_song);
        if (result.success && result.data) {
            playlists = result.data;
        } else {
            error = result.error || "Failed to fetch playlists";
        }
    });

    // --- MANEJADORES DE ACCIONES ---
    function handlePlay(e: MouseEvent) {
        e.stopPropagation();
        if (isPlaying) {
            playerStore.togglePlay();
        } else {
            playerStore.playContext(song, playlistContext);
        }
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
        const result = await playlistApi.addSong(playlistId, song.id_song);
        if (result.success) {
            alert(`Canción añadida!`);
            playlists = playlists.filter(p => p.id !== playlistId);
        }
    }
</script>

<ImageCard imageUrl={song.cover_path || "/default-cover.png"}>
    <svelte:fragment slot="actions">
        <Button
            pill
            class="!p-2 bg-black/50 text-white hover:bg-opacity-75 transition-all active:scale-90"
            onclick={handleLike}
            disabled={isLiking}
        >
            <Heart
                class="w-6 h-6 transition-colors {hasLike ? 'text-red-500 fill-red-500' : ''}"
            />
        </Button>

        <Button
            pill
            class="!p-2 bg-black/50 text-white hover:bg-opacity-75 transition-all active:scale-90"
            onclick={handlePlay}
        >
            {#if isPlaying}
                <PauseCircle class="w-8 h-8 text-blue-500" />
            {:else}
                <PlayCircle class="w-8 h-8" />
            {/if}
        </Button>

        <Button
            pill
            slot="trigger"
            class="!p-2 bg-black/50 text-white hover:bg-opacity-75 transition-all active:scale-90"
        >
            <Bookmark class="w-6 h-6" />
        </Button>

        <Popover trigger="click" class="w-48 text-sm" placement="bottom-end">
            <div class="p-2">
                <h6 class="font-semibold mb-2">Añadir a...</h6>
                {#if playlists && playlists.length > 0}
                    <ul class="space-y-1 max-h-40 overflow-y-auto">
                        {#each playlists as playlist}
                            <li>
                                <button
                                    onclick={(e) => handleAddToPlaylist(e, playlist.id)}
                                    class="w-full text-left p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    {playlist.name}
                                </button>
                            </li>
                        {/each}
                    </ul>
                {:else if error}
                    <p class="text-xs text-gray-500">{error}</p>
                {:else}
                    <p class="text-xs text-gray-500">Cargando...</p>
                {/if}
            </div>
        </Popover>
    </svelte:fragment>

    <div class="text-center">
        <Heading tag="h5" class="mb-1 text-md font-bold truncate">{song.title}</Heading>
        <p class="text-sm text-gray-500 truncate">{song.artist_names || "Desconocido"}</p>
    </div>
</ImageCard>