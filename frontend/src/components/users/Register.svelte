<script lang="ts">
  import { userApi } from "../../services/apiClient";
  import { router } from "tinro";

  let user = '';
  let email = '';
  let password = '';
  let acceptedTerms = false; // Para el checkbox
  
  let isLoading = false;
  let errorMessage = '';

  async function handleSignup() {
    isLoading = true;
    errorMessage = '';
    
    try {
      const response = await userApi.signup(user, email, password); // Using userApi.signup
      if (response.success) {
        router.goto("/login"); // Redirect to login on successful signup
      } else {
        errorMessage = response.error || 'Error al registrarse';
      }
    } catch (error: any) {
      errorMessage = "Error de red o desconocido"; // Generic error for network issues
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-white px-4">
  <div class="w-full max-w-sm">
    
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Crear Cuenta</h2>

    <form on:submit|preventDefault={handleSignup} class="max-w-sm mx-auto">
      
      <div class="mb-5">
        <label for="user" class="block mb-2.5 text-sm font-medium text-gray-900">Usuario</label>
        <input 
          type="text" 
          id="user" 
          bind:value={user}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 placeholder-gray-400 shadow-sm" 
          placeholder="Elige un usuario" 
          required 
        />
      </div>

      <div class="mb-5">
        <label for="email" class="block mb-2.5 text-sm font-medium text-gray-900">Tu email</label>
        <input 
          type="email" 
          id="email" 
          bind:value={email}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 placeholder-gray-400 shadow-sm" 
          placeholder="nombre@ejemplo.com" 
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

      <div class="flex items-start mb-5">
        <div class="flex items-center h-5">
          <input 
            id="terms" 
            type="checkbox" 
            bind:checked={acceptedTerms}
            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
            required 
          />
        </div>

      </div>

      {#if errorMessage}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          {errorMessage}
        </div>
      {/if}

      <button 
        type="submit" 
        disabled={isLoading || !acceptedTerms} 
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full focus:outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {#if isLoading} Registrando... {:else} Crear cuenta {/if}
      </button>

      <p class="mt-4 text-sm font-light text-gray-500">
        ¿Ya tienes cuenta? <a href="/login" class="font-medium text-blue-600 hover:underline">Ingresa aquí</a>
      </p>

    </form>
  </div>
</div>