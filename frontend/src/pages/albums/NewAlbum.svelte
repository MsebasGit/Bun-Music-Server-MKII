<script lang="ts">
    import { albumApi } from "../../services/apiClient";
    import type { User, Album } from "../../types/api";
    import { createEventDispatcher } from "svelte";

    // Import Flowbite components
    import { Heading, Label, Input, Button, Alert, Spinner, Fileupload } from "flowbite-svelte";

    export let user: User;
    export let onCreated: (newAlbum: Album) => void;
    export let onClose: () => void;

    // Form state
    let name = "";
    let coverImageFiles: FileList;

    let isLoading = false;
    let errorMessage = "";

    async function handleCreateAlbum() {
        if (!coverImageFiles || coverImageFiles.length === 0) {
            errorMessage = "Debes seleccionar una imagen de portada.";
            return;
        }

        isLoading = true;
        errorMessage = "";

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("artistId", user.id_artist.toString());
            
            // Append file
            formData.append("cover_image", coverImageFiles[0]);

            const response = await albumApi.create(formData);

            if (response.success && response.data) {
                onCreated(response.data);
                onClose();
            } else {
                errorMessage = response.error || "Error al crear el álbum.";
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
        Crear un nuevo álbum
    </Heading>

    <form on:submit|preventDefault={handleCreateAlbum} class="space-y-6">
        <Label class="space-y-2">
            <span>Nombre del álbum</span>
            <Input type="text" bind:value={name} placeholder="Nombre del álbum" required />
        </Label>

        <Label class="space-y-2">
            <span>Imagen de Portada</span>
            <Fileupload bind:files={coverImageFiles} required accept="image/*" />
        </Label>

        {#if errorMessage}
            <Alert color="red" class="mt-4">
                <span class="font-medium">Error:</span> {errorMessage}
            </Alert>
        {/if}

        <Button type="submit" outline color="blue" disabled={isLoading} class="w-full">
            {#if isLoading}
                <Spinner class="mr-2" size="4" />
                Creando...
            {:else}
                Crear Álbum
            {/if}
        </Button>
    </form>
</div>
