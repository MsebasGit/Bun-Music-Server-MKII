<script lang="ts">
  import { userApi } from "../../services/apiClient"; 
  import { Heading } from "flowbite-svelte";
  import { router } from "tinro"; // 1. Importamos router de Tinro
  import { auth } from "../../stores/auth"; 

  let user = "";
  let password = "";
  let isLoading = false;
  let errorMessage = "";

  async function handleLogin() {
    isLoading = true;
    errorMessage = "";
    
    try {
      const response = await userApi.login(user, password);
      
      if (response.success) {
        // Actualizar Store
        auth.login(); 
        
        // 2. Redirección con Tinro
        router.goto("/"); 
      } else {
        errorMessage = response.error || "Error en credenciales";
      }
    } catch (e) {
      errorMessage = "Error de conexión";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-white px-4">
  <div class="w-full max-w-sm">
    <Heading tag="h2" class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Iniciar Sesión
    </Heading>

    <form on:submit|preventDefault={handleLogin} class="max-w-sm mx-auto">
      <div class="mb-5">
        <label for="user" class="block mb-2.5 text-sm font-medium text-gray-900">Usuario</label>
        <input
          type="text"
          id="user"
          bind:value={user}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 placeholder-gray-400 shadow-sm"
          placeholder="Tu nombre de usuario"
          required
        />
      </div>

      <div class="mb-5">
        <label for="password" class="block mb-2.5 text-sm font-medium text-gray-900">Contraseña</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 placeholder-gray-400 shadow-sm"
          placeholder="••••••••"
          required
        />
      </div>

      {#if errorMessage}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {errorMessage}
        </div>
      {/if}

      <button
        type="submit"
        disabled={isLoading}
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {#if isLoading} Cargando... {:else} Ingresar {/if}
      </button>

      <p class="mt-4 text-sm font-light text-gray-500">
        ¿No tienes cuenta?
        <a href="/signup" class="font-medium text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </form>
  </div>
</div>