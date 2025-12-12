<script lang="ts">
  import { onMount } from "svelte";
  import { router } from "tinro";
  import { auth } from "../stores/auth";

  // IMPORTANTE: Empezamos en false.
  // Esto asegura que Svelte NO toque el DOM del hijo hasta estar seguros.
  let renderContent = false;

  onMount(() => {
    // Verificación inicial
    if ($auth) {
      // Si está logueado, abrimos la compuerta
      renderContent = true;
    } else {
      // Si NO está logueado, redirigimos.
      // Como renderContent sigue en false, el slot NUNCA se intenta montar,
      // evitando el error "before is undefined".
      router.goto("/login", true);
    }
  });

  // Verificación reactiva (por si hace logout mientras usa la app)
  $: if (renderContent && !$auth) {
      renderContent = false; // Cerramos la compuerta inmediatamente
      // Usamos setTimeout para que la redirección no choque con el desmontaje del DOM
      setTimeout(() => {
          router.goto("/login", true);
      }, 0);
  }
</script>

{#if renderContent}
  <slot />
{:else}
  <div class="auth-loading"></div>
{/if}

<style>
  /* Opcional: evitar parpadeos visuales */
  .auth-loading {
      width: 100%;
      height: 100vh;
  }
</style>