<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { albumApi } from "../../services/apiClient";
    import type { Album } from "../../types/api";
    import {
        Heading,
        Label,
        Input,
        Button,
        Alert,
        Spinner,
        Fileupload,
        Card
    } from "flowbite-svelte";

    export let album: Album;
    export let onClose: () => void;

    const dispatch = createEventDispatcher();

    // Form state
    let name = album.name;
    let coverImageFiles: FileList;
    
    let isUpdating = false;
    let errorMessage = "";

    async function handleUpdateAlbum() {
        isUpdating = true;
        errorMessage = "";

        try {
            const formData = new FormData();
            formData.append("name", name);

            if (coverImageFiles && coverImageFiles.length > 0) {
                formData.append("cover_image", coverImageFiles[0]);
            }

            const response = await albumApi.update(album.id_album, formData);

            if (response.success) {
                dispatch("albumUpdated");
                onClose();
            } else {
                errorMessage = response.error || "Error al actualizar el álbum.";
            }
        } catch (error: any) {
            errorMessage = error.message || "Error de red o desconocido.";
        } finally {
            isUpdating = false;
        }
    }
</script>

<div>
    <Heading tag="h2" class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
        Editar Álbum
    </Heading>

    <form on:submit|preventDefault={handleUpdateAlbum} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
                <Label class="space-y-2">
                    <span>Nombre del Álbum</span>
                    <Input type="text" bind:value={name} required />
                </Label>
                <Label class="space-y-2">
                    <span>Cambiar Portada (Opcional)</span>
                    <Fileupload bind:files={coverImageFiles} accept="image/*" />
                </Label>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
                <Label class="space-y-2">
                    <span>Portada Actual</span>
                    <img src={`/${album.cover_path}`} alt="Portada de {album.name}" class="rounded-lg shadow-md w-full h-auto object-cover max-h-48">
                </Label>
            </div>
        </div>

        {#if errorMessage}
            <Alert color="red" class="mt-4" dismissable onclose={() => errorMessage = ''}>
                <span class="font-medium">Error:</span> {errorMessage}
            </Alert>
        {/if}

        <Button type="submit" outline color="blue" disabled={isUpdating} class="w-full">
            {#if isUpdating}
                <Spinner class="mr-2" size="4" /> Guardando...
            {:else}
                Guardar Cambios
            {/if}
        </Button>
    </form>
</div>
