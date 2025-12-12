<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { songApi } from "../../services/apiClient";
    import type { Song } from "../../types/api";
    import {
        Heading,
        Label,
        Input,
        Button,
        Alert,
        Spinner,
        Fileupload,
        Badge,
        Card
    } from "flowbite-svelte";

    export let song: Song;
    export let onClose: () => void;

    const dispatch = createEventDispatcher();

    // Form state initialized from prop
    let title = song.title;
    let language = song.language;
    let genres = Array.isArray(song.genre) ? song.genre.join(", ") : song.genre;
    let coverImageFiles: FileList;

    let isUpdating = false;
    let errorMessage = "";

    // Reactive statement for genre tags
    $: parsedGenres = genres.split(',').map(g => g.trim()).filter(g => g);

    async function handleUpdateSong() {
        isUpdating = true;
        errorMessage = "";

        try {
            // Update text-based fields
            const songDetails = {
                title,
                language,
                genres: parsedGenres,
            };
            
            const response = await songApi.update(song.id_song, songDetails);

            if (!response.success) {
                throw new Error(response.error || "Error al actualizar los detalles de la canción.");
            }

            // If there's a new cover image, upload it separately
            if (coverImageFiles && coverImageFiles.length > 0) {
                const formData = new FormData();
                formData.append("cover_image", coverImageFiles[0]);
                
                const coverResponse = await songApi.updateCover(song.id_song, formData);
                if (!coverResponse.success) {
                    throw new Error(coverResponse.error || "Error al actualizar la portada.");
                }
            }

            dispatch("songUpdated");
            onClose();

        } catch (error: any) {
            errorMessage = error.message || "Error de red o desconocido.";
        } finally {
            isUpdating = false;
        }
    }
</script>

<div>
    <Heading tag="h2" class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
        Editar Canción
    </Heading>

    <form on:submit|preventDefault={handleUpdateSong} class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
                <Label class="space-y-2">
                    <span>Título</span>
                    <Input type="text" bind:value={title} required />
                </Label>

                <Label class="space-y-2">
                    <span>Idioma</span>
                    <Input type="text" bind:value={language} />
                </Label>

                <div class="space-y-2">
                    <Label>
                        <span>Géneros (separados por coma)</span>
                        <Input type="text" bind:value={genres} />
                    </Label>
                    {#if parsedGenres.length > 0}
                        <div class="flex flex-wrap gap-1 mt-2">
                            {#each parsedGenres as genre}
                                <Badge color="indigo" class="font-semibold">{genre}</Badge>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
                <Label class="space-y-2">
                    <span>Portada Actual</span>
                    <img src={`/${song.cover_path}`} alt="Portada de {song.title}" class="rounded-lg shadow-md w-full h-auto object-cover max-h-48">
                </Label>
                <Label class="space-y-2">
                    <span>Cambiar Portada (Opcional)</span>
                    <Fileupload bind:files={coverImageFiles} accept="image/*" />
                </Label>
            </div>
        </div>

        {#if errorMessage}
            <Alert color="red" class="mt-4" dismissable on:close={() => errorMessage = ''}>
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
