<script lang="ts">
    import type { Playlist } from "../types/api";
    import { Listgroup, ListgroupItem, Card, Popover, Button, Modal } from "flowbite-svelte";
    import { TrashBinSolid, EditSolid, DotsVerticalOutline } from "flowbite-svelte-icons";
    import { playlistApi } from "../services/apiClient"; // Import apiClient directly
    import EditPlaylist from "./EditPlaylist.svelte"; // Import the new component

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let playlist: Playlist;

    // State for controlling the modals
    let showDeleteModal = false;
    let showEditModal = false;

    // --- MANEJADORES DE EVENTOS ---
    async function handleDeletePlaylist() {
        if (!playlist) return;
        const result = await playlistApi.delete(playlist.id);

        if (result.success) {
            dispatch('playlistActionCompleted'); // Notify parent to refresh
            showDeleteModal = false; // Close modal after action
        } else {
            // Handle error, e.g., show a toast notification
            console.error("Failed to delete playlist:", result.error);
            showDeleteModal = false; // Close modal anyway for now
        }
    };
</script>

<Card class="p-0 group relative">
    <div class ="absolute top-2 right-2 z-10">
        <!-- Botón de menú -->
        <Button outline color="dark" pill={true} class="!p-2 bg-white/50 backdrop-blur-sm">
            <DotsVerticalOutline class="w-6 h-6" />
        </Button>
        <Popover class="p-0">
            <Listgroup class="border-0 text-sm">
                <ListgroupItem  class="border-b">
                    <button onclick={() => showEditModal = true} class="flex items-center w-full text-left">
                    <EditSolid class="w-5 h-5 mr-2" />
                    Editar
                    </button>   
                </ListgroupItem>
                <ListgroupItem class="text-red-600 dark:text-red-500">
                    <button onclick={() => showDeleteModal = true} class="flex items-center w-full text-left">
                    <TrashBinSolid class="w-5 h-5 mr-2" />
                    Borrar 
                    </button>   
                </ListgroupItem>
            </Listgroup>
        </Popover>
    </div>
    <!-- Información de la playlist -->
    <div class="p-6">
        <h5
            class="mb-1 text-md font-bold tracking-tight text-gray-900 dark:text-white truncate"
        >
            <a
                href={`/playlists/${playlist.id}`}
                class="hover:underline">{playlist.name}</a
            >
        </h5>
        <p
            class="font-normal text-sm text-gray-700 dark:text-gray-400 truncate"
        >
            {playlist.description || "Sin descripción"}
        </p>
    </div>
</Card>

<!-- Modal de Confirmación de Borrado -->
<Modal bind:open={showDeleteModal} size="xs" autoclose>
    <div class="text-center">
        <TrashBinSolid class="mx-auto mb-4 h-10 w-10 text-gray-400 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            ¿Estás seguro de que quieres borrar la playlist "{playlist.name}"?
        </h3>
        <div class="flex justify-center gap-4">
            <Button color="red" onclick={handleDeletePlaylist}>
                Sí, estoy seguro
            </Button>
            <Button color="alternative" onclick={() => showDeleteModal = false}>
                No, cancelar
            </Button>
        </div>
    </div>
</Modal>

<!-- Modal de Edición -->
<Modal bind:open={showEditModal} size="md">
    <div class="p-4">
        <EditPlaylist {playlist} onClose={() => showEditModal = false} on:playlistActionCompleted={() => dispatch('playlistActionCompleted')} />
    </div>
</Modal>
