<script lang="ts">
    import { onMount } from "svelte";
    import { userApi, albumApi } from "../../services/apiClient";
    import type { User, Album } from "../../types/api";
    import { Button, Spinner, Heading, Alert, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Modal, P } from "flowbite-svelte";
    import { ExclamationCircleOutline } from "flowbite-svelte-icons";
    import EditAlbum from "./EditAlbum.svelte";

    let albums: Album[] = [];
    let user: User | null = null;
    let isLoading = true;
    let errorMessage = "";

    let showEditModal = false;
    let selectedAlbum: Album | null = null;

    let showDeleteModal = false;
    let albumToDelete: Album | null = null;

    async function fetchAlbums() {
        if (user?.isArtist && user.id_artist) {
            isLoading = true;
            const albumsResult = await albumApi.getByArtistId(user.id_artist);
            if (albumsResult.success && albumsResult.data) {
                albums = albumsResult.data;
            } else {
                errorMessage = albumsResult.error || "No se pudieron cargar tus álbumes.";
            }
            isLoading = false;
        }
    }

    onMount(async () => {
        const userResult = await userApi.getMe();
        if (userResult.success && userResult.data) {
            user = userResult.data;
            if (user.isArtist) {
                await fetchAlbums();
            } else {
                errorMessage = "Este perfil no es de un artista.";
                isLoading = false;
            }
        } else {
            errorMessage = userResult.error || "No se pudo obtener la información del usuario.";
            isLoading = false;
        }
    });

    function openEditModal(album: Album) {
        selectedAlbum = album;
        showEditModal = true;
    }

    function handleAlbumUpdated() {
        fetchAlbums();
    }

    function openDeleteModal(album: Album) {
        albumToDelete = album;
        showDeleteModal = true;
    }

    async function confirmDelete() {
        if (!albumToDelete) return;

        const result = await albumApi.delete(albumToDelete.id_album);
        if (result.success) {
            await fetchAlbums();
        } else {
            errorMessage = result.error || "Error al eliminar el álbum.";
        }
        showDeleteModal = false;
        albumToDelete = null;
    }

</script>

<div class="container mx-auto p-4">
    <Heading tag="h1" class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Administrar Mis Álbumes
    </Heading>

    {#if isLoading}
        <div class="flex justify-center items-center h-64">
            <Spinner size="8" />
        </div>
    {:else if errorMessage}
        <Alert color="red" onclose={() => errorMessage = ''} dismissable>
            <span class="font-medium">Error:</span> {errorMessage}
        </Alert>
    {:else if albums.length === 0}
        <Alert color="blue">
            No has creado ningún álbum todavía. <a href="/studio" class="font-semibold underline hover:text-blue-800">Crea tu primer álbum</a>.
        </Alert>
    {:else}
        <Table hoverable={true}>
            <TableHead>
                <TableHeadCell>Nombre</TableHeadCell>
                <TableHeadCell>Lanzamiento</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each albums as album}
                    <TableBodyRow>
                        <TableBodyCell class="font-medium text-gray-900 dark:text-white">
                            {album.name}
                        </TableBodyCell>
                        <TableBodyCell>{new Date(album.release_date).toLocaleDateString()}</TableBodyCell>
                        <TableBodyCell class="space-x-2 whitespace-nowrap">
                            <Button size="sm" outline color="blue" onclick={() => openEditModal(album)}>Editar</Button>
                            <Button size="sm" outline color="red" onclick={() => openDeleteModal(album)}>Eliminar</Button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {/if}
</div>

{#if selectedAlbum}
    <Modal bind:open={showEditModal} size="xl" outsideclose>
        <div class="p-4">
            <EditAlbum album={selectedAlbum} on:albumUpdated={handleAlbumUpdated} onClose={() => showEditModal = false} />
        </div>
    </Modal>
{/if}

<Modal bind:open={showDeleteModal} size="md" outsideclose>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <P class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            ¿Estás seguro de que quieres eliminar el álbum "{albumToDelete?.name}"? Todas las canciones dentro de él serán desvinculadas, pero no eliminadas.
        </P>
        <Button color="red" class="mr-2" onclick={confirmDelete}>Sí, estoy seguro</Button>
        <Button color="alternative" onclick={() => showDeleteModal = false}>No, cancelar</Button>
    </div>
</Modal>
