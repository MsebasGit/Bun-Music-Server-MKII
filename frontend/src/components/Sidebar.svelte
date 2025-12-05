<script lang="ts">
  import {
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarBrand,
  } from "flowbite-svelte";
  import {
    HomeSolid,
    MusicSolid,
    MicrophoneSolid,
    HeartSolid,
    BookmarkSolid,
    PlusOutline,
    HeadphonesSolid
  } from "flowbite-svelte-icons";
  import { router } from "tinro";

  // Clase común para los iconos
  const iconClass = "w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white";
</script>

<Sidebar activeUrl={$router.path} class="z-50 h-full">
  
  <SidebarBrand href="/" class="mb-6">
    <img
      src="https://flowbite.com/docs/images/logo.svg"
      class="h-6 me-3 sm:h-7"
      alt="Flowbite Logo"
    />
    <span class="self-center text-xl font-semibold">Flowbite</span>
  </SidebarBrand>

  <SidebarGroup>
    
    <SidebarItem label="Panel Principal" href="/">
      {#snippet icon()}
        <HomeSolid class={iconClass} />
      {/snippet}
    </SidebarItem>

    <SidebarItem label="Álbumes" href="/albums">
      {#snippet icon()}
        <MusicSolid class={iconClass} />
      {/snippet}
    </SidebarItem>

    <SidebarItem label="Artistas" href="/artists">
      {#snippet icon()}
        <MicrophoneSolid class={iconClass} />
      {/snippet}
    </SidebarItem>
  </SidebarGroup>
  <SidebarGroup border>
    <SidebarItem label="Me gusta" href="/favorites">
      {#snippet icon()}
        <HeartSolid class={iconClass} />
      {/snippet}
    </SidebarItem>

    <SidebarItem label="Playlists" href="/playlists">
      {#snippet icon()}
        <BookmarkSolid class={iconClass} />
      {/snippet}
    </SidebarItem>

  </SidebarGroup>

  <SidebarGroup border>
    <SidebarItem label="Studio" href="/studio">
      {#snippet icon()}
        <HeadphonesSolid class={iconClass} />
      {/snippet}
    </SidebarItem>

  </SidebarGroup>
</Sidebar>