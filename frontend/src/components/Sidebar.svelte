<script lang="ts">
  import { onDestroy } from 'svelte';
  import { router } from "tinro";
  import { auth } from "../stores/auth";

  function handleLogout() {
    auth.logout();
    router.goto('/login');
    try {
      location.replace('/login');
    } catch (e) {
      // no-op in non-browser envs
    }
  }

  // Active link styling logic
  let currentPath = window.location.pathname;
  const unsubscribe = router.subscribe(r => currentPath = r.path);
  onDestroy(() => unsubscribe());

  function isActive(path: string) {
    // Make Home active only on exact match
    if (path === '/') {
        return currentPath === '/' ? "bg-gray-100 text-blue-700" : "text-gray-900 hover:bg-gray-100";
    }
    // For other paths, check if the current path starts with it
    return currentPath.startsWith(path) ? "bg-gray-100 text-blue-700" : "text-gray-900 hover:bg-gray-100";
  }
</script>

<aside class="w-48 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
  <div class="h-16 flex items-center px-6 border-b border-gray-200">
    <span class="text-xl font-bold text-blue-700">Mi App</span>
  </div>

  <nav class="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
    <div>
      <h3 class="text-xs font-semibold text-gray-500 uppercase px-3 mb-1">Explorar</h3>
      <div class="space-y-1">
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
      </div>
    </div>

    <div>
      <h3 class="text-xs font-semibold text-gray-500 uppercase px-3 mb-1">Tu Librería</h3>
      <div class="space-y-1">
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
      </div>
    </div>
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
