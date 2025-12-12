<script lang="ts">
  import { userApi } from "../../services/apiClient";
  import { router } from "tinro";
  import { auth } from "../../stores/auth";
  // Importamos todos los componentes necesarios de flowbite-svelte
  import {
    Heading,
    Label,
    Input,
    Button,
    Card,
    Alert,
    Spinner,
    DarkMode,
  } from "flowbite-svelte";

  let email = "";
  let password = "";
  let isLoading = false;
  let errorMessage = "";

  function initializeSession(token: string) {
    localStorage.setItem("jwt_token", token);
    auth.login();
    router.goto("/");
  }

  async function handleLogin() {
    isLoading = true;
    errorMessage = "";

    try {
      const response = await userApi.login(email, password);

      // 2. Primer Guard Clause: Si la API dice que falló, paramos aquí.
      if (!response.success) {
        errorMessage = response.error || "Error en credenciales";
        return; // <--- El return evita que el código siga ejecutándose
      }

      // 3. Segundo Guard Clause: Si no hay token, paramos aquí.
      // (Nota: Corregí un bug de tu original, donde el login continuaba aunque no hubiera token)
      const token = response.data?.token;
      if (!token) {
        errorMessage = "Error: El servidor no devolvió un token de sesión.";
        return;
      }

      // 4. Happy Path: Si llegamos aquí, todo está perfecto.
      // El código está plano, sin indentación excesiva.
      initializeSession(token);
    } catch (e) {
      errorMessage = "Error de conexión con el servidor";
      console.error(e);
    } finally {
      isLoading = false;
    }
  }
</script>

<div
  class="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 px-4"
>
  <Card class="w-full max-w-md p-6 space-y-6 sm:p-8">
    <Heading
      tag="h2"
      class="text-2xl font-bold text-gray-900 dark:text-white text-center"
    >
      Iniciar Sesión
    </Heading>

    <form on:submit|preventDefault={handleLogin} class="mt-8 space-y-6">
      <Label class="space-y-2">
        <span>Email</span>
        <Input
          type="email"
          bind:value={email}
          placeholder="nombre@empresa.com"
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
          <span class="font-medium">Error:</span>
          {errorMessage}
        </Alert>
      {/if}

      <Button
        type="submit"
        outline
        color="blue"
        disabled={isLoading}
        class="w-full"
      >
        {#if isLoading}
          <Spinner class="mr-3" size="4" color="blue" />
          Cargando...
        {:else}
          Ingresar
        {/if}
      </Button>

      <div
        class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center"
      >
        ¿No tienes cuenta?
        <a
          href="/signup"
          class="text-blue-700 hover:underline dark:text-blue-500"
        >
          Regístrate aquí
        </a>
      </div>
    </form>
  </Card>

  <div class="fixed bottom-4 right-4 z-50">
    <DarkMode />
  </div>
</div>
