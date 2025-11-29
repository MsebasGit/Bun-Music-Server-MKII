<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Route, router } from "tinro";
  import { auth } from "../stores/auth";

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
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
    <div class="h-16 flex items-center px-6 border-b border-gray-200">
      <span class="text-xl font-bold text-blue-700">Mi App</span>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <a 
        href="/" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/')}"
      >
        <span class="truncate">Dashboard</span>
      </a>

      <a 
        href="/users" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/users')}"
      >
        <span class="truncate">Usuarios</span>
      </a>

      <a 
        href="/settings" 
        class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {isActive('/settings')}"
      >
        <span class="truncate">Configuración</span>
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

  <main class="flex-1 ml-64 p-8 overflow-y-auto h-full">
    <Route path="/">
      <h1 class="text-2xl font-bold mb-4">Panel Principal</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p class="text-gray-600">Bienvenido al sistema.</p>
      </div>
    </Route>

    <Route path="/users">
      <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p class="text-gray-600">Aquí aparecerá la tabla de usuarios.</p>
      </div>
    </Route>

    <Route path="/settings">
      <h1 class="text-2xl font-bold mb-4">Configuración</h1>
      <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p class="text-gray-600">Ajustes de la cuenta.</p>
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