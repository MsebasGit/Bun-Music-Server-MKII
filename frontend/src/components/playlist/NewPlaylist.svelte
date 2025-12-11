<script lang="ts">
    import { playlistApi } from "../../services/apiClient";
    import { Heading, Label, Input, Button, Alert, Spinner } from "flowbite-svelte";
    import type { Playlist } from "../../types/api";

    export let onCreated: (newPlaylist: Playlist) => void;
    export let onClose: () => void;

    let name = "";
    let description = "";
    let isLoading = false;
    let errorMessage = "";

    async function handleNewPlaylist() {
        isLoading = true;
        errorMessage = "";

        try {
            const newPlaylistPayload = { name, description };
            const response = await playlistApi.create(newPlaylistPayload);

            if (response.success && response.data) {
                onCreated(response.data);
                onClose();
            } else {
                errorMessage = response.error || "Error al crear la playlist";
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
        class="text-xl font-bold text-gray-900 dark:text-white text-center mb-4"
    >
        Crear Nueva Playlist
    </Heading>

    <form on:submit|preventDefault={handleNewPlaylist} class="space-y-4">
        <Label class="space-y-2">
            <span>Nombre</span>
            <Input
                type="text"
                bind:value={name}
                placeholder="Mi nueva playlist"
                required
            />
        </Label>

        <Label class="space-y-2">
            <span>Descripción</span>
            <Input
                type="text"
                bind:value={description}
                placeholder="Una buena descripción..."
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
            color="blue"
            disabled={isLoading}
            class="w-full"
        >
            {#if isLoading}
                <Spinner class="mr-2" size="4" />
                Creando...
            {:else}
                Crear Playlist
            {/if}
        </Button>
    </form>
</div>
