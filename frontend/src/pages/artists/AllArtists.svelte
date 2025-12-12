<script lang="ts">
    import { onMount } from "svelte";
    import { Heading, Spinner } from "flowbite-svelte";
    import { artistApi } from "../../services/apiClient";
    import type { Artist } from "../../types/api";
    import ArtistGrid from "../../components/artist/ArtistGrid.svelte";
    import SearchBar from "../../components/ui/SearchBar.svelte";

    let artists: Artist[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    onMount(async () => {
        const result = await artistApi.getAll();
        if (result.success) {
            artists = result.data || [];
        } else {
            error = result.error || "Failed to fetch artists";
        }
        loading = false;
    });
    async function searchArtists(text: string) {
        const result = await artistApi.search(text)
        console.log(result);
        if (result.success) {
            artists = result.data || [];
        } else {
            error = result.error || "Failed to fetch songs";
        }
    }
</script>

<div class="container mx-auto p-4">
    <!-- Title is managed here -->
    <Heading
        tag="h1"
        class="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
    >
        Todos los Artistas
    </Heading>
    <SearchBar onSearch={searchArtists} />

    {#if loading}
        <div class="flex justify-center items-center h-40">
            <Spinner color="blue" size="8" />
            <p class="ml-2 text-gray-700 dark:text-gray-300">
                Cargando artistas...
            </p>
        </div>
    {:else if error}
        <div class="text-red-600 dark:text-red-400 text-center text-lg">
            <p>Error: {error}</p>
            <p>No se pudieron cargar los artistas.</p>
        </div>
    {:else}
        <ArtistGrid {artists} />
    {/if}
</div>
