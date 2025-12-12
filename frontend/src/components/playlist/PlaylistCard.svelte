<script lang="ts">
    import type { Playlist } from "../../types/api";
    import { Listgroup, ListgroupItem, Popover, Button, Modal } from "flowbite-svelte";
    import { TrashBinSolid, EditSolid, DotsVerticalOutline } from "flowbite-svelte-icons";
    import { playlistApi } from "../../services/apiClient";
    import EditPlaylist from "./EditPlaylist.svelte";
    import TextCard from "../ui/TextCard.svelte";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let playlist: Playlist;

    let showDeleteModal = false;
    let showEditModal = false;

    async function handleDeletePlaylist() {
        if (!playlist) return;
        const result = await playlistApi.delete(playlist.id);

        if (result.success) {
            dispatch("playlistActionCompleted");
            showDeleteModal = false;
        } else {
            console.error("Failed to delete playlist:", result.error);
            showDeleteModal = false;
        }
    }
</script>

<TextCard 
    href={`/playlists/${playlist.id}`}
    title={playlist.name}
    subtitle={playlist.description || "Sin descripción"}
>
    <div slot="actions">
        <Button outline color="dark" pill={true} class="!p-1 bg-white/50 backdrop-blur-sm">
            <DotsVerticalOutline class="w-6 h-6" />
        </Button>
        <Popover class="p-0" trigger="click" placement="bottom-end"> 
            <Listgroup class="border-0 text-sm">
                <ListgroupItem class="border-b">
                    <button on:click={() => showEditModal = true} class="flex items-center w-full text-left">
                        <EditSolid class="w-5 h-5 mr-2" />
                        Editar
                    </button>
                </ListgroupItem>
                <ListgroupItem class="text-red-600 dark:text-red-500">
                    <button on:click={() => showDeleteModal = true} class="flex items-center w-full text-left">
                        <TrashBinSolid class="w-5 h-5 mr-2" />
                        Borrar
                    </button>
                </ListgroupItem>
            </Listgroup>
        </Popover>
    </div>
</TextCard>

<!-- Modals remain unchanged -->
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

<Modal bind:open={showEditModal} size="md">
    <div class="p-4">
        <EditPlaylist {playlist} onClose={() => showEditModal = false} on:playlistActionCompleted={() => dispatch('playlistActionCompleted')} />
    </div>
</Modal>