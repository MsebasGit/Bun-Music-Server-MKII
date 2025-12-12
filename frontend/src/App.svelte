<script lang="ts">
  // @ts-nocheck
  import { onDestroy } from 'svelte';
  import { Route, router } from "tinro";
  import { auth } from "./stores/auth";
  import { likedSongsStore } from "./stores/likesStore"; // <--- Importado

  // Componentes
  import Login from "./pages/users/Login.svelte";
  import Register from "./pages/users/Register.svelte";
  import SidebarLayout from "./layouts/SidebarLayout.svelte";

  let isAuth = false;

  // Suscripción al store de autenticación
  const unsubscribeAuth = auth.subscribe((v) => {
    isAuth = v;
    
    // Si el usuario se acaba de autenticar, cargamos sus likes automáticamente
    if (isAuth) {
      likedSongsStore.fetchInitialLikes();
    }
  });

  const unsubscribeRouter = router.subscribe((route) => {
    if (route.path !== '/login' && route.path !== '/signup' && !isAuth) {
      router.goto('/login');
    }

    if ((route.path === '/login' || route.path === '/signup') && isAuth) {
      router.goto('/');
    }
  });

  onDestroy(() => {
    unsubscribeAuth();
    unsubscribeRouter();
  });
</script>

<Route path="/login"><Login /></Route>
<Route path="/signup"><Register /></Route>

{#if isAuth}
  <Route path="/*"><SidebarLayout /></Route>
{/if}