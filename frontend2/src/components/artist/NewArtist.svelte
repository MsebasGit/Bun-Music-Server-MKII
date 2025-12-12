<script lang="ts">
    import { artistApi } from "../../services/apiClient";
    import type { User, Artist } from "../../types/api";
    import { createEventDispatcher } from "svelte";

    // Import Flowbite Svelte components
    import { Heading, Label, Input, Button, Alert, Spinner, Textarea } from "flowbite-svelte";

    export let user: User;
    export let onCreated: (newArtist: Artist) => void;
    export let onClose: () => void;

    // Initialize form fields
    // The artist name defaults to the user's name but can be changed.
    let name = user.name;
    let nationality = "";
    let biography = "";

    let isLoading = false;
    let errorMessage = "";

    async function handleNewArtist() {
        isLoading = true;
        errorMessage = "";

        try {
            const newArtistPayload = {
                name,
                nationality,
                biography,
                userId: user.id_user,
                socialLinks: null // As established previously, this is handled separately
            };

            const response = await artistApi.create(newArtistPayload);

            if (response.success && response.data) {
                onCreated(response.data);
                onClose();
            } else {
                errorMessage = response.error || "Error al crear el perfil de artista.";
            }
        } catch (error: any) {
            errorMessage = error.message || "Error de red o desconocido.";
        } finally {
            isLoading = false;
        }
    }
</script>

<div>
    <Heading tag="h2" class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
        Conviértete en Artista
    </Heading>

    <form on:submit|preventDefault={handleNewArtist} class="space-y-6">
        <Label class="space-y-2">
            <span>Nombre de Artista</span>
            <Input type="text" bind:value={name} placeholder="Tu nombre artístico" required />
        </Label>
        
        <Label class="space-y-2">
            <span>Nacionalidad</span>
            <Input type="text" bind:value={nationality} placeholder="Ej: Mexicano" />
        </Label>

        <Label class="space-y-2">
            <span>Biografía</span>
            <Textarea bind:value={biography} placeholder="Cuéntanos un poco sobre ti y tu música..." />
        </Label>

        {#if errorMessage}
            <Alert color="red" class="mt-4">
                <span class="font-medium">Error:</span> {errorMessage}
            </Alert>
        {/if}

        <Button type="submit" outline color="blue" disabled={isLoading} class="w-full">
            {#if isLoading}
                <Spinner class="mr-2" size="4" />
                Finalizando...
            {:else}
                Completar Perfil de Artista
            {/if}
        </Button>
    </form>
</div>

