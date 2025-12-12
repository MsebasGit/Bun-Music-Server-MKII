<script lang="ts">
    import { onMount } from "svelte";
    import { userApi, songApi } from "../../services/apiClient";
    import type { User, Song } from "../../types/api";
    import { Button, Spinner, Heading, Alert, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Modal, P } from "flowbite-svelte";
    import { ExclamationCircleOutline } from "flowbite-svelte-icons";
    import EditSong from "./EditSong.svelte";

    let songs: Song[] = [];
    let user: User | null = null;
    let isLoading = true;
    let errorMessage = "";

    let showEditModal = false;
    let selectedSong: Song | null = null;

    let showDeleteModal = false;
    let songToDelete: Song | null = null;

    async function fetchSongs() {
        if (user?.is_artist && user.id_artist) {
            isLoading = true;
            const songsResult = await songApi.getByArtistId(user.id_artist);
            if (songsResult.success && songsResult.data) {
                songs = songsResult.data;
            } else {
                errorMessage = songsResult.error || "No se pudieron cargar tus canciones.";
            }
            isLoading = false;
        }
    }

    onMount(async () => {
        const userResult = await userApi.getMe();
        if (userResult.success && userResult.data) {
            user = userResult.data;
            if (user.is_artist) {
                await fetchSongs();
            }
            else {
                errorMessage = "Este perfil no es de un artista.";
                isLoading = false;
            }
        } else {
            errorMessage = userResult.error || "No se pudo obtener la información del usuario.";
            isLoading = false;
        }
    });

    function openEditModal(song: Song) {
        selectedSong = song;
        showEditModal = true;
    }

    function handleSongUpdated() {
        fetchSongs();
    }

    function openDeleteModal(song: Song) {
        songToDelete = song;
        showDeleteModal = true;
    }

    async function confirmDelete() {
        if (!songToDelete) return;

        const result = await songApi.delete(songToDelete.id_song);
        if (result.success) {
            await fetchSongs();
        } else {
            // You might want to show an error message to the user
            console.error("Failed to delete song:", result.error);
            errorMessage = result.error || "Error al eliminar la canción.";
        }
        showDeleteModal = false;
        songToDelete = null;
    }

</script>

<div class="container mx-auto p-4">
    <Heading tag="h1" class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Administrar Mis Canciones
    </Heading>

    {#if isLoading}
        <div class="flex justify-center items-center h-64">
            <Spinner size="8" />
        </div>
    {:else if errorMessage}
        <Alert color="red" onclose={() => errorMessage = ''} dismissable>
            <span class="font-medium">Error:</span> {errorMessage}
        </Alert>
    {:else if songs.length === 0}
        <Alert color="blue">
            No has subido ninguna canción todavía. <a href="/studio" class="font-semibold underline hover:text-blue-800">Sube tu primera canción</a>.
        </Alert>
    {:else}
        <Table hoverable={true}>
            <TableHead>
                <TableHeadCell>Título</TableHeadCell>
                <TableHeadCell>Álbum</TableHeadCell>
                <TableHeadCell>Lanzamiento</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each songs as song}
                    <TableBodyRow>
                        <TableBodyCell class="font-medium text-gray-900 dark:text-white">
                            {song.title}
                        </TableBodyCell>
                        <TableBodyCell>{song.album_name || 'N/A'}</TableBodyCell>
                        <TableBodyCell>{new Date(song.release_date).toLocaleDateString()}</TableBodyCell>
                        <TableBodyCell class="space-x-2 whitespace-nowrap">
                            <Button size="sm" outline color="blue" onclick={() => openEditModal(song)}>Editar</Button>
                            <Button size="sm" outline color="red" onclick={() => openDeleteModal(song)}>Eliminar</Button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>

{#if selectedSong}
    <Modal bind:open={showEditModal} size="xl" outsideclose>
        <div class="p-4">
            <EditSong song={selectedSong} on:songUpdated={handleSongUpdated} onClose={() => showEditModal = false} />
        </div>
    </Modal>
{/if}

<Modal bind:open={showDeleteModal} size="md" outsideclose>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <P class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            ¿Estás seguro de que quieres eliminar la canción "{songToDelete?.title}"? Esta acción es irreversible.
        </P>
        <Button color="red" class="mr-2" onclick={confirmDelete}>Sí, estoy seguro</Button>
        <Button color="alternative" onclick={() => showDeleteModal = false}>No, cancelar</Button>
    </div>
</Modal>
