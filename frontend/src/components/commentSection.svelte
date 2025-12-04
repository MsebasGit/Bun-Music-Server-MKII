<script lang="ts">
    import { Card, Listgroup, ListgroupItem, Avatar } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { commentApi } from "../services/apiClient";
    import type { Comment } from "../types/api";
    import { Textarea } from "flowbite-svelte";
    export let songId: number;

    let comments: Comment[] = [];
    let loading: boolean = true;
    let error: string | null = null;
    onMount(async () => {
        const result = await commentApi.getBySongId(songId);
        if (result.success) {
            comments = result.data || [];
        } else {
            error = result.error || "No se pudieron cargar los comentarios.";
        }
        loading = false;
    });
</script>

<div>
    <Card size="lg" class="p-4 sm:p-6 md:p-8 lg:p-10">
        {#if loading}
            <p>Cargando comentarios...</p>
        {:else if error}
            <p class="text-red-600 dark:text-red-400">Error: {error}</p>
        {:else if comments.length === 0}
            <p class="text-gray-700 dark:text-gray-300">
                No hay comentarios para esta canción.
            </p>
        {:else}
            <Textarea placeholder="Escribe un comentario..." class="w-full" />
            <br />
            <h3 class="text-lg font-semibold mb-2">Comentarios:</h3>
            <Listgroup items={comments} class="w-48" />
        {/if}
    </Card>
</div>
