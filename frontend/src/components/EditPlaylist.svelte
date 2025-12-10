<script lang="ts">
    import { playlistApi } from "../services/apiClient";
    import type { Playlist } from "../types/api";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    // Importamos los componentes necesarios de flowbite-svelte
    import {
        Heading,
        Label,
        Input,
        Button,
        Alert,
        Spinner,
    } from "flowbite-svelte";

    export let playlist: Playlist; // Correctly type the playlist prop
    export let onClose: () => void;

    // Initialize form fields reactively
    $: name = playlist.name;
    $: description = playlist.description || "";

    let isLoading = false;
    let errorMessage = "";

    async function handleUpdatePlaylist() {
        isLoading = true;
        errorMessage = "";

        try {
            const updatedPlaylistPayload = { name, description };

            const response = await playlistApi.update(
                playlist.id,
                updatedPlaylistPayload,
            );

            if (response.success) {
                dispatch("playlistActionCompleted"); // Notify parent that an action was completed
                onClose(); // Close the modal on success
            } else {
                errorMessage =
                    response.error || "Error al actualizar la playlist";
            }
        } catch (error: any) {
            errorMessage = "Error de red o desconocido";
        } finally {
            isLoading = false;
        }
    }
</script>

<div>
    <Heading
        tag="h2"
        class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6"
    >
        Editar Playlist
    </Heading>

    <form on:submit|preventDefault={handleUpdatePlaylist} class="space-y-6">
        <Label class="space-y-2">
            <span>Nombre</span>
            <Input
                type="text"
                bind:value={name}
                placeholder="Nombre para la playlist"
                required
            />
        </Label>

        <Label class="space-y-2">
            <span>Descripción</span>
            <Input
                type="text"
                bind:value={description}
                placeholder="Super descripción"
            />
        </Label>

        {#if errorMessage}
            <Alert color="red" class="mt-4">
                <span class="font-medium">Error:</span>
                {errorMessage}
            </Alert>
        {/if}

        <Button
            type="submit"
            outline
            color="blue"
            disabled={isLoading}
            class="w-full"
        >
            {#if isLoading}
                <Spinner class="mr-2" size="4" />
                Guardando...
            {:else}
                Guardar Cambios
            {/if}
        </Button>
    </form>
</div>
