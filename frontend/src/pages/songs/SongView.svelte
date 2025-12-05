<script lang="ts">
    import { onMount } from "svelte";
    import { songApi } from "../../services/apiClient";
    import { playerStore } from "../../stores/playerStore";
    import type { Song } from "../../types/api";
    import {
        Spinner,
        Alert,
        Button,
        Card,
        Heading,
        P,
        Hr,
    } from "flowbite-svelte";
    import { Play, Pause } from "svelte-heros-v2";

    import InteractionSection from "../../components/InteractionSection.svelte";
    import CommentSection from "../../components/commentSection.svelte";
    import AllSongsList from "../../components/AllSongsList.svelte";

    export let id: string;

    let song: Song | null = null;
    let loading: boolean = true;
    let error: string | null = null;

    // Reactive variables to check if this song is the one in the player
    let isCurrentSong: boolean;
    let isPlaying: boolean;

    playerStore.subscribe((store) => {
        isCurrentSong = store.currentSong?.id_song === song?.id_song;
        isPlaying = store.isPlaying;
    });

    onMount(async () => {
        if (!id) {
            error = "No se ha proporcionado un ID de canción.";
            loading = false;
            return;
        }

        const result = await songApi.getById(Number(id));
        if (result.success && result.data) {
            song = result.data;
        } else {
            error =
                result.error || `No se pudo encontrar la canción con ID ${id}`;
        }
        loading = false;
    });

    function handlePlay() {
        if (song) {
            playerStore.playSong(song);
        }
    }
</script>

<div >
    <div class="flex flex-col lg:flex-row gap-8">
        <!-- Columna Izquierda: Contenido Principal de la Canción -->
        <div class="w-full lg:w-2/3">
            {#if loading}
                <div class="flex justify-center items-center h-64">
                    <Spinner color="blue" size="8" />
                    <p class="ml-4 text-gray-700 dark:text-gray-300">
                        Cargando canción...
                    </p>
                </div>
            {:else if error}
                <Alert color="red" class="text-lg">
                    <span class="font-medium">Error:</span>
                    {error}
                </Alert>
            {:else if song}
                <Card size="lg" class="lg:full p-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="md:col-span-1">
                            <img
                                src={song.cover_path || "/default-cover.png"}
                                alt="Cover de {song.title}"
                                class="w-full h-auto object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div class="md:col-span-2 flex flex-col justify-center">
                            <Heading
                                tag="h1"
                                class="mb-2 text-4xl font-extrabold"
                            >
                                {song.title}
                            </Heading>

                            <P class="mb-2" color="text-gray-700" size="lg">
                                <strong>Artista:</strong>
                                {song.artist_names || "Desconocido"}
                            </P>
                            {#if song.album_name}
                                <P class="mb-2" color="text-gray-700" size="lg">
                                    <strong>Álbum:</strong>
                                    {song.album_name}
                                </P>
                            {/if}
                            <P class="mb-6" color="text-gray-700" size="lg">
                                <strong>Duración:</strong>
                                {song.duration
                                    ? `${Math.floor(song.duration / 60)}:${String(
                                          song.duration % 60,
                                      ).padStart(2, "0")}`
                                    : "N/A"}
                            </P>

                            <div class="mt-4">
                                <button
                                    class="px-5 py-2.5 text-lg font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                                    on:click={handlePlay}
                                >
                                    {#if isCurrentSong && isPlaying}
                                        <Pause class="mr-2 w-5 h-5 inline" />
                                        Pausar
                                    {:else}
                                        <Play class="mr-2 w-5 h-5 inline" />
                                        Reproducir
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <InteractionSection id={song.id_song} />
                    </div>

                    <Hr class="my-8" />

                    <div>
                        <CommentSection songId={song.id_song} />
                    </div>
                </Card>
            {:else}
                <div
                    class="text-center text-gray-500 dark:text-gray-400 text-xl py-10"
                >
                    <p>No se encontró la canción.</p>
                </div>
            {/if}
        </div>

        <!-- Columna Derecha: Contenido Relacionado -->
        <div class="w-full lg:w-1/3">
            <AllSongsList currentSongId={Number(id)} />
        </div>
    </div>
</div>
