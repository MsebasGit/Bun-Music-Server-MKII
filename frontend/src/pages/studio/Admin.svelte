<script lang="ts">
    import {
        Button,
        Modal,
        Spinner,
        Heading,
        Card,
        Alert,
    } from "flowbite-svelte";
    import { userApi } from "../../services/apiClient";
    import type { User, Artist, Song, Album } from "../../types/api";
    import { onMount } from "svelte";
    import NewAlbum from "../../pages/albums/NewAlbum.svelte";   
    import NewArtist from "../../pages/artists/NewArtist.svelte";
    import NewSong from "../../pages/songs/NewSong.svelte";

    let artist: Artist | null = null;
    let user: User | null = null;
    let error: string | null = null;
    let loading: boolean = true;

    let showArtistModal = false;
    let showNewSongModal = false;
    let showNewAlbumModal = false;

    onMount(async () => {
        const result = await userApi.getMe();

        if (result.success && result.data) {
            user = result.data;
            if (!user.isArtist) {
                showArtistModal = true; // Show the modal automatically if not an artist
            } else {
                // The user is an artist, so we can proceed.
                // We could fetch artist-specific data here if needed.
            }
        } else {
            error = result.error || "Failed to fetch user details";
        }
        loading = false;
    });

    function handleNewArtistCreated(newArtist: Artist) {
        if (user) {
            user.isArtist = true;
            user.id_artist = newArtist.id;
        }
        showArtistModal = false;
    }

    function handleNewSongCreated(newSongId: number) {
        // Here you might want to refresh a list of songs or show a success message.
        console.log("New song created with ID:", newSongId);
        showNewSongModal = false;
    }

    function handleNewAlbumCreated(newAlbum: Album) {
        // Similarly, refresh album list or show success message.
        console.log("New album created:", newAlbum);
        showNewAlbumModal = false;
    }

    function handleModalClose() {
        showArtistModal = false;
        showNewSongModal = false;
        showNewAlbumModal = false;
    }
</script>

<div class="container mx-auto p-4">
    {#if loading}
        <div class="flex justify-center items-center h-full">
            <Spinner />
        </div>
    {:else if error}
        <div class="text-center text-red-500">
            <p>Error: {error}</p>
            <p>No puedes acceder al estudio en este momento.</p>
        </div>
    {:else if user && user.isArtist}
        <Heading
            tag="h1"
            class="text-3xl font-bold text-gray-900 dark:text-white mb-6"
        >
            Artist Studio
        </Heading>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card class="p-6">
                <Heading tag="h2" class="text-2xl mb-4">Canciones</Heading>
                <Button
                    onclick={() => (showNewSongModal = true)}
                    outline
                    color="blue"
                    class="mb-4 w-full"
                >
                    Subir canción
                </Button>
                <Button href="/me/songs" outline color="blue" class="w-full"
                    >Administrar canciones</Button
                >
            </Card>

            <Card class="p-6">
                <Heading tag="h2" class="text-2xl mb-4">Álbumes</Heading>
                <Button
                    onclick={() => (showNewAlbumModal = true)}
                    outline
                    color="blue"
                    class="mb-4 w-full"
                >
                    Crear álbum
                </Button>
                <Button href="/me/albums" outline color="blue" class="w-full"
                    >Administrar álbumes</Button
                >
            </Card>

        </div>
    {/if}
</div>


{#if user}
    <!-- Modal for becoming an artist -->
    <Modal bind:open={showArtistModal} size="md" outsideclose>
        <div class="p-4">
            <NewArtist
                {user}
                onCreated={handleNewArtistCreated}
                onClose={handleModalClose}
            />
        </div>
    </Modal>

    <!-- Modal for uploading a new song -->
    <Modal bind:open={showNewSongModal} size="lg" outsideclose>
        <div class="p-4">
            <NewSong
                {user}
                onCreated={handleNewSongCreated}
                onClose={() => (showNewSongModal = false)}
            />
        </div>
    </Modal>

    <!-- Modal for creating a new album -->
    <Modal bind:open={showNewAlbumModal} size="md" outsideclose>
        <div class="p-4">
            <NewAlbum
                {user}
                onCreated={handleNewAlbumCreated}
                onClose={() => (showNewAlbumModal = false)}
            />
        </div>
    </Modal>
{/if}
