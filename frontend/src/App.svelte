<script lang="ts">
  // @ts-nocheck
  import { onDestroy } from 'svelte';
  import { Route, router } from "tinro";
  import { auth } from "./stores/auth";

  // Componentes
  import Login from "./pages/users/Login.svelte";
  import Register from "./pages/users/Register.svelte";
  import SidebarLayout from "./layouts/SidebarLayout.svelte";


  // Evitar usar `$auth` dentro de callbacks (no está permitido por Svelte).
  // Nos suscribimos explícitamente y guardamos el valor en `isAuth`.
  let isAuth = false;
  const unsubscribeAuth = auth.subscribe((v) => (isAuth = v));

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