<script lang="ts">
    import type { Artist } from "../../types/api";
    import { Heading, ButtonGroup, Button, Navbar } from "flowbite-svelte";

    export let artist: Artist;
</script>

<Navbar>
    <Heading
        tag="h1"
        class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6"
    >
        {artist.name}
    </Heading>
    <ButtonGroup class="*:ring-primary-700!">
        <Button href="/artists/{artist.id}/songs">Canciones</Button>
        <Button href="/artists/{artist.id}/albums">Albums</Button>
        <Button href="/artists/{artist.id}/description">Descripción</Button>
    </ButtonGroup>
</Navbar>
