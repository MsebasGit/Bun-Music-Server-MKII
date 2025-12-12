<script lang="ts">
    import type { Song, Playlist } from "../../types/api";
    import { Popover, Button, Heading, Dropdown, Checkbox } from "flowbite-svelte";
    import { PlayCircle, PauseCircle, Heart, Bookmark } from "svelte-heros-v2";
    import { playlistApi } from "../../services/apiClient";
    import ImageCard from "../ui/ImageCard.svelte";

    import { playerStore } from "../../stores/playerStore";
    import { likedSongsStore } from "../../stores/likesStore";
    import { onMount } from "svelte";

    export let song: Song;
    export let playlistContext: Song[] = [];

    // Extendemos el tipo Playlist para manejar el estado del checkbox
    type PlaylistWithSongStatus = Playlist & { hasSong: boolean };

    let playlistsWithStatus: PlaylistWithSongStatus[] = [];
    let isLiking: boolean = false;
    let error: string | null = null;
    let isLoadingPlaylists = true;

    // Usamos el prefijo $ para acceder al valor del store de forma reactiva
    $: isPlaying = $playerStore.currentSong?.id_song === song.id_song && $playerStore.isPlaying;
    $: hasLike = $likedSongsStore.has(song.id_song);

    onMount(async () => {
        // 1. Obtener todas las playlists del usuario
        const allPlaylistsResult = await playlistApi.getMe();
        // 2. Obtener las playlists donde la canción NO existe
        const notInPlaylistsResult = await playlistApi.getPlaylistsWhereSongNotExist(song.id_song);

        if (allPlaylistsResult.success && allPlaylistsResult.data && notInPlaylistsResult.success && notInPlaylistsResult.data) {
            const notInIds = new Set(notInPlaylistsResult.data.map(p => p.id));
            
            // 3. Cruzar la información
            playlistsWithStatus = allPlaylistsResult.data.map(p => ({
                ...p,
                hasSong: !notInIds.has(p.id)
            }));
        } else {
            error = allPlaylistsResult.error || notInPlaylistsResult.error || "Failed to fetch playlists";
        }
        isLoadingPlaylists = false;
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

    async function handleAddToPlaylist(playlistId: number) {
        const result = await playlistApi.addSong(playlistId, song.id_song);
        if (result.success) {
            // Actualizar estado localmente
            const playlist = playlistsWithStatus.find(p => p.id === playlistId);
            if (playlist) playlist.hasSong = true;
            playlistsWithStatus = [...playlistsWithStatus]; // Forzar reactividad
        } else {
            alert(`Error al añadir la canción: ${result.error}`);
        }
    }

    async function handleRemoveFromPlaylist(playlistId: number) {
        const result = await playlistApi.removeSong(playlistId, song.id_song);
        if (result.success) {
            // Actualizar estado localmente
            const playlist = playlistsWithStatus.find(p => p.id === playlistId);
            if (playlist) playlist.hasSong = false;
            playlistsWithStatus = [...playlistsWithStatus]; // Forzar reactividad
        } else {
            alert(`Error al quitar la canción: ${result.error}`);
        }
    }

    function handleCheckboxChange(e: Event, playlist: PlaylistWithSongStatus) {
        const isChecked = (e.currentTarget as HTMLInputElement).checked;
        if (isChecked) {
            handleAddToPlaylist(playlist.id);
        } else {
            handleRemoveFromPlaylist(playlist.id);
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
        
        <!-- Usamos Dropdown en lugar de Popover -->
        <Dropdown class="w-48 p-3 space-y-2 text-sm" placement="bottom-end">

            <Heading tag=h6 class="font-semibold mb-2">Guardar en...</Heading>
            {#if isLoadingPlaylists}
                <p class="text-xs text-gray-500 px-2">Cargando...</p>
            {:else if playlistsWithStatus && playlistsWithStatus.length > 0}
                <div class="max-h-40 overflow-y-auto">
                    {#each playlistsWithStatus as playlist}
                        <Checkbox
                            checked={playlist.hasSong}
                            onchange={(e) => handleCheckboxChange(e, playlist)}
                        >
                            {playlist.name}
                        </Checkbox>
                    {/each}
                </div>
            {:else if error}
                <p class="text-xs text-red-500 px-2">{error}</p>
            {:else}
                <p class="text-xs text-gray-500 px-2">No tienes playlists. ¡Crea una!</p>
            {/if}
        </Dropdown>

    </svelte:fragment>

    <div class="text-center">
        <Heading tag="h5" class="mb-1 text-md font-bold truncate">{song.title}</Heading>
        <p class="text-sm text-gray-500 truncate">{song.artist_names || "Desconocido"}</p>
    </div>
</ImageCard>
