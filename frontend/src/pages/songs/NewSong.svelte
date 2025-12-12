
<script lang="ts">
    import { songApi } from "../../services/apiClient";
    import type { User } from "../../types/api";

    // Import Flowbite components
    import { Heading, Label, Input, Button, Alert, Spinner, Fileupload, Badge } from "flowbite-svelte";

    export let user: User;
    export let onCreated: (newSongId: number) => void;
    export let onClose: () => void;

    // Form state
    let title = "";
    let language = "";
    let genres = ""; // Still a comma-separated string from the input
    let coverImageFiles: FileList;
    let audioFiles: FileList;

    let isLoading = false;
    let errorMessage = "";

    // Reactive statement to show genre tags
    $: parsedGenres = genres.split(',').map(g => g.trim()).filter(g => g);

    async function handleCreateSong() {
        if (!audioFiles || audioFiles.length === 0) {
            errorMessage = "Debes seleccionar un archivo de audio.";
            return;
        }

        isLoading = true;
        errorMessage = "";

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("language", language);
            // Send genres as a JSON string array
            formData.append("genres", JSON.stringify(parsedGenres));
            formData.append("artistId", user.id_artist.toString());
            
            // Append files
            formData.append("audio_file", audioFiles[0]);
            if (coverImageFiles && coverImageFiles.length > 0) {
                formData.append("cover_image", coverImageFiles[0]);
            }

            const response = await songApi.create(formData);

            if (response.success && response.data) {
                onCreated(response.data); // response.data is the new song ID
                onClose();
            } else {
                errorMessage = response.error || "Error al crear la canción.";
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
        Subir una nueva canción
    </Heading>

    <form on:submit|preventDefault={handleCreateSong} class="space-y-6">
        <Label class="space-y-2">
            <span>Título</span>
            <Input type="text" bind:value={title} placeholder="Título de la canción" required />
        </Label>

        <Label class="space-y-2">
            <span>Idioma</span>
            <Input type="text" bind:value={language} placeholder="Ej: Español" />
        </Label>

        <div class="space-y-2">
            <Label>
                <span>Géneros (separados por coma)</span>
                <Input type="text" bind:value={genres} placeholder="Rock, Pop, Electrónica..." />
            </Label>
            {#if parsedGenres.length > 0}
                <div class="flex flex-wrap gap-1 mt-2">
                    {#each parsedGenres as genre}
                        <Badge color="indigo" class="font-semibold">{genre}</Badge>
                    {/each}
                </div>
            {/if}
        </div>

        <Label class="space-y-2">
            <span>Archivo de Audio (MP3, WAV, etc.)</span>
            <Fileupload bind:files={audioFiles} required />
        </Label>
        
        <Label class="space-y-2">
            <span>Imagen de Portada (Opcional)</span>
            <Fileupload bind:files={coverImageFiles} accept="image/*" />
        </Label>

        {#if errorMessage}
            <Alert color="red" class="mt-4">
                <span class="font-medium">Error:</span> {errorMessage}
            </Alert>
        {/if}

        <Button type="submit" outline color="blue" disabled={isLoading} class="w-full">
            {#if isLoading}
                <Spinner class="mr-2" size="4" />
                Subiendo...
            {:else}
                Subir Canción
            {/if}
        </Button>
    </form>
</div>
