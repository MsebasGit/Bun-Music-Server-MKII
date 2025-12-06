<script lang="ts">
    import { playlistApi } from "../../services/apiClient";
    import { router } from "tinro";
    // Importamos Checkbox, Card y Spinner además de los básicos
    import {
        Heading,
        Label,
        Input,
        Button,
        Card,
        Checkbox,
        Alert,
        Spinner,
        DarkMode,
    } from "flowbite-svelte";

    let name = "";
    let description = "";

    let isLoading = false;
    let errorMessage = "";

    async function handleNewPlaylist() {
        isLoading = true;
        errorMessage = "";

        try {
            const newPlaylistPayload = {
                name: name,
                description: description,
            };
            const response = await playlistApi.create(newPlaylistPayload);

            if (response.success) {
                router.goto("/playlists");
            } else {
                errorMessage = response.error || "Error al crear una playlist";
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
        class="text-2xl font-bold text-gray-900 dark:text-white text-center"
    >
        Crear Nueva Playlist
    </Heading>

    <form on:submit|preventDefault={handleNewPlaylist} class="mt-8 space-y-6">
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
            Crear playlist
        </Button>
    </form>
</div>
