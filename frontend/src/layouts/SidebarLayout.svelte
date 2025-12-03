<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Route, router } from "tinro";
  import { auth } from "../stores/auth";
  import Home from '../pages/Home.svelte';
  import AllAlbums from '../pages/albums/AllAlbums.svelte';
  import AllArtists from '../pages/artists/AllArtists.svelte';
  import AllFavorites from '../pages/userSongRatings/AllFavorites.svelte';
  import AllPlaylists from '../pages/playlists/AllPlaylists.svelte';

  function handleLogout() {
    auth.logout();
    // Aseguramos navegación a /login y cargado limpio.
    // Usamos router.goto para navegación SPA y luego location.replace
    // para forzar una recarga limpia que evita estados residuales.
    router.goto('/login');
    try {
      // replace evita añadir entrada en el historial
      location.replace('/login');
    } catch (e) {
      // en entornos sin window no hacemos nada
    }
  }

  // Ruta actual para estilos de enlace activo
  let currentPath = window.location.pathname;
  const unsubscribe = router.subscribe(r => currentPath = r.path);
  onDestroy(() => unsubscribe());

  function isActive(path: string) {
    return currentPath === path ? "bg-gray-100 text-blue-700" : "text-gray-900 hover:bg-gray-100";
  }
</script>

<div class="flex h-screen bg-gray-50">
  <aside class="w-48 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
    <div class="h-16 flex items-center px-6 border-b border-gray-200">
      <span class="text-xl font-bold text-blue-700"> Mi App</span>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <a 
        href="/" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/')}"
      >
        <span class="truncate">Home</span>
      </a>

      <a 
        href="/albums" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/albums')}"
      >
        <span class="truncate">Álbumes</span>
      </a>

      <a 
        href="/artists" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/artists')}"
      >
        <span class="truncate">Artistas</span>
      </a>
      <hr>

      <a 
        href="/favorites" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/favorites')}"
      >
        <span class="truncate">Favoritos</span>
      </a>

      <a 
        href="/playlists" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/playlists')}"
      >
        <span class="truncate">Listas de Reproducción</span>
      </a>

    </nav>

    <div class="p-4 border-t border-gray-200">
      <button
        on:click={handleLogout}
        class="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
      >
        <span class="truncate">Cerrar Sesión</span>
      </button>
    </div>
  </aside>

  <main class="flex-1 ml-48 p-8 overflow-y-auto h-full">
    <Route path="/">
      <h1 class="text-2xl font-bold mb-4">Panel Principal</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <Home />
      </div>
    </Route>

    <Route path="/albums">
      <h1 class="text-2xl font-bold mb-4">Todos los Álbumes</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <AllAlbums />
      </div>
    </Route>

    <Route path="/artists">
      <h1 class="text-2xl font-bold mb-4">Todos los Artistas</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <AllArtists />
      </div>
    </Route>

    <Route path="/favorites">
      <h1 class="text-2xl font-bold mb-4">Canciones Favoritas</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <AllFavorites />
      </div>
    </Route>

    <Route path="/playlists">
      <h1 class="text-2xl font-bold mb-4">Todas las Listas de Reproducción</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <AllPlaylists />
      </div>
    </Route>

    <Route fallback>
      <div class="text-center mt-10">
        <h2 class="text-xl font-bold text-gray-700">Página no encontrada</h2>
        <a href="/" class="text-blue-600 hover:underline">Volver al inicio</a>
      </div>
    </Route>

  </main>
</div>