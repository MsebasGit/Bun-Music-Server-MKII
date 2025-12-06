<script lang="ts">
  import { userApi } from "../../services/apiClient";
  import type { User } from "../../types/api";
  import { router } from "tinro";
  import { onMount } from "svelte";

  // Importamos Checkbox, Card y Spinner además de los básicos
  import { 
    Heading, 
    Label, 
    Input, 
    Button, 
    Card, 
    Alert, 
    Spinner,
    DarkMode 
  } from "flowbite-svelte";

  let user: User | null = null;
  let loading: boolean = true;
  let error: string | null = null;

  async function handleSignup() {
    
  }

  onMount(async () => {
        const result = await userApi.getMe();
        if (result.success && result.data) {
            user = result.data;
        } else {
            error = result.error || "Failed to fetch songs";
        }
        loading = false;
    });
</script>

<div class="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 px-4">
  
  <Card class="w-full max-w-md p-6 space-y-6 sm:p-8">
    
    <Heading tag="h1" class="text-2xl font-bold text-gray-900 dark:text-white text-center">
      ¡Conviértase en artista!
    </Heading>
    <Heading tag="h2" class="text-2xl font-bold text-gray-900 dark:text-white text-center">
      Llene el siguiente formulario para crear su cuenta de artista
    </Heading>

    <form on:submit|preventDefault={handleSignup} class="mt-8 space-y-6">
      
      <Label class="space-y-2">
        <span>Usuario</span>
        <Input 
          type="text" 
          bind:value={user} 
          placeholder="Elige un usuario" 
          required 
        />
      </Label>

      <Label class="space-y-2">
        <span>Tu email</span>
        <Input 
          type="email" 
          bind:value={email} 
          placeholder="nombre@ejemplo.com" 
          required 
        />
      </Label>

      <Label class="space-y-2">
        <span>Contraseña</span>
        <Input 
          type="password" 
          bind:value={password} 
          placeholder="••••••••" 
          required 
        />
      </Label>

      {#if errorMessage}
        <Alert color="red" class="mt-4">
          <span class="font-medium">Error:</span> {errorMessage}
        </Alert>
      {/if}

      <Button 
        type="submit" 
        outline color="blue" 
        disabled={isLoading} 
        class="w-full"
      >
        {#if isLoading}
          <Spinner class="mr-3" size="4" color="blue" />
          Registrando...
        {:else}
          Crear cuenta
        {/if}
      </Button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
        ¿Ya tienes cuenta? 
        <a href="/login" class="text-blue-700 hover:underline dark:text-blue-500">
          Ingresa aquí
        </a>
      </div>

    </form>
  </Card>

  <div class="fixed bottom-4 right-4 z-50">
    <DarkMode />
  </div>
</div>