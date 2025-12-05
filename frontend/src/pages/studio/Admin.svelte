<script lang="ts">
    import { Button } from "flowbite-svelte";
</script>

<div class="container mx-auto p-4">
    <Button href="/songs/new" outline color="green">Subir canción</Button>
    <Button href="/me/songs" outline color="red">Administrar canciones</Button>

    <Button href="/albums/new" outline color="green">Crear álbum</Button>
    <Button href="/me/albums" outline color="red">Administrar álbumes</Button>

    <Button href="/socials-networks/new" outline color="green">Añadir red social</Button>
    <Button href="/me/socials-networks" outline color="red">Administrar redes sociales</Button>
</div>
