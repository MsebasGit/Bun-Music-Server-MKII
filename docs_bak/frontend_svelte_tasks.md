### **Fase 1: Configuración y Fundamentos del Proyecto**

*   **Título de la Tarjeta:** 🏗️ [SETUP] Inicializar Proyecto Svelte con Vite y Bun
    *   **Descripción:** Configurar el nuevo proyecto de frontend con Svelte, utilizando Vite como bundler y Bun como gestor de paquetes y entorno de ejecución. (Ya realizado en gran parte)
    *   **Tareas:**
        1.  (Ya realizado) Inicializar un nuevo proyecto Svelte/TypeScript con Vite y Bun: `bun create vite frontend --template svelte-ts`.
        2.  (Verificar) Asegurarse de que las dependencias básicas de Svelte y Vite estén instaladas (esto lo maneja `bun create vite`).
        3.  (Verificar) La estructura de carpetas `frontend/src/` ya está creada para tu código Svelte y `frontend/index.html` para cargar la aplicación.
        4.  (Verificar) Los scripts de `dev` y `build` para Svelte con Vite ya están configurados en `frontend/package.json`.
    *   **Objetivo:** Tener un "Hola Mundo" en Svelte compilando y ejecutándose en el navegador (ya logrado con la inicialización del proyecto).

*   **Título de la Tarjeta:** 🔗 [API] Definir Interfaces y Cliente para el Backend
    *   **Descripción:** Crear un módulo o conjunto de archivos para definir las interfaces TypeScript para las entidades de tu backend (Song, Album, Artist, User, etc.) y un cliente HTTP (usando `fetch` nativo o una librería como `axios`) para interactuar con tus endpoints REST. Esto reemplazará `fetchData` de `utilities.js`.
    *   **Tareas:**
        1.  Definir interfaces TypeScript (ej. `interface Song`, `interface Album`, `interface Artist`) que representen fielmente la estructura JSON que envía tu backend. Estas interfaces pueden ir en archivos como `src/types/api.ts` o cerca de los componentes que las usan.
        2.  Crear un servicio o módulo (ej. `src/services/apiClient.ts`) con funciones asíncronas para realizar llamadas HTTP a tu backend (ej. `getSongs(): Promise<Song[]>`, `getAlbum(id: number): Promise<Album>`).
        3.  Manejar la serialización/deserialización de JSON y la gestión de errores dentro de este cliente HTTP. SvelteKit y Vite ya manejan muchas de estas preocupaciones, pero las llamadas `fetch` deben incluir manejo de errores.
        4.  Considerar usar `@tanstack/svelte-query` (ya instalado) para una gestión de estado más avanzada, caching y sincronización de datos para las llamadas API.
    *   **Archivos de Referencia:** Todos los endpoints backend, `js/utilities.js` (`fetchData`), `frontend/package.json` (`@tanstack/svelte-query`).

### **Fase 2: Arquitectura de la Interfaz de Usuario**

*   **Título de la Tarjeta:** 🗺️ [ROUTING] Implementar Enrutamiento en Svelte
    *   **Descripción:** Configurar el enrutamiento del lado del cliente para que la aplicación Svelte maneje las URLs sin recargar la página. Esto se puede lograr con un enrutador de terceros o implementando uno simple si las necesidades son básicas.
    *   **Tareas:**
        1.  Decidir sobre una estrategia de enrutamiento:
            *   **SvelteKit:** Si la aplicación crece, considera migrar a SvelteKit, que incluye enrutamiento basado en archivos (`filesystem-based routing`) por defecto.
            *   **Librería de terceros:** Instalar y configurar una librería de enrutamiento popular para Svelte, como `svelte-navigator`, `svelte-routing`, o `@dekkai/svero`.
            *   **Enrutador simple:** Para aplicaciones pequeñas, puedes implementar un enrutador basado en `window.location.hash` o `History API` con lógica condicional en tu `App.svelte`.
        2.  Definir las rutas de tu aplicación (ej. `/`, `/albums/:id`, `/artists/:id`).
        3.  Implementar los componentes de vista para cada ruta.
        4.  Integrar el enrutador en tu componente principal (`App.svelte`) para renderizar la vista correcta basada en la URL actual.
        5.  Asegurarse de que los enlaces internos utilicen el enrutador para la navegación sin recarga.
    *   **Objetivo:** La navegación entre las diferentes "páginas" de la aplicación Svelte es instantánea y sin recargas, y las URLs reflejan el estado actual de la aplicación.

*   **Título de la Tarjeta:** 🎨 [CORE] Componente de Layout Principal y Sidebar
    *   **Descripción:** Recrear el layout base de tu aplicación, incluyendo la barra lateral (`sidebar.html`), como componentes de Svelte.
    *   **Tareas:**
        1.  Crear un componente `Sidebar.svelte` (ej. en `src/lib/Sidebar.svelte`) que refleje la estructura y estilos de `static/sidebar.html`.
        2.  Implementar la lógica de mostrar/ocultar el sidebar usando el estado reactivo de Svelte (ej. `let isSidebarOpen = false;`).
        3.  Actualizar los enlaces del sidebar para que utilicen la solución de enrutamiento elegida en Svelte para la navegación interna.
        4.  Crear un componente `App.svelte` (o modificar el existente) que orqueste el `Sidebar` y el área principal donde se montarán los componentes de página (`<slot />` o `<RouterView />`).
        5.  Asegurarse de que `static/style.css` se integre correctamente o se refactorice en estilos de Svelte.
    *   **Archivos de Referencia:** `static/sidebar.html`, `static/style.css`, `src/App.svelte`.

### **Fase 3: Migración de Vistas y Lógica Específica**

*   **Título de la Tarjeta:** ⏯️ [FEATURE] Componente Global de Reproductor de Música
    *   **Descripción:** Reimplementar la funcionalidad del `MusicPlayer` (`utilities.js`) como un componente Svelte, accesible y controlable desde cualquier parte de la aplicación.
    *   **Tareas:**
        1.  Definir el estado del reproductor (ej. `currentSong`, `playlist`, `volume`, `isPlaying`) utilizando stores reactivos de Svelte (ej. `writable` o `readable`) para que el estado sea global y reactivo.
        2.  Utilizar la API nativa de JavaScript `HTMLAudioElement` directamente dentro del componente o en una lógica separada que interactúe con el store.
        3.  Implementar las acciones (play, pause, next, prev) y la lógica de la cola de reproducción dentro de un componente `MusicPlayer.svelte`.
        4.  Montar el componente `MusicPlayer.svelte` en el layout principal (`App.svelte` o un componente de layout) para que sea visible y controlable globalmente.
    *   **Archivos de Referencia:** `js/utilities.js` (`MusicPlayer` class), Documentación de `HTMLAudioElement`.

*   **Título de la Tarjeta:** 🖼️ [COMPONENT] Página Principal y Componente `Card` de Elemento
    *   **Descripción:** Convertir el contenido de la página principal (anteriormente `static/index.html`) en un componente `HomePage.svelte`. Este componente utilizará el cliente API para obtener datos (ej. canciones, álbumes, artistas) y los mostrará en una cuadrícula usando un componente `Card` reutilizable.
    *   **Tareas:**
        1.  Crear un componente `Card.svelte` (ej. en `src/lib/Card.svelte`) que sea genérico para mostrar información de canciones, álbumes y artistas. Utiliza props para pasar los datos y slots de Svelte para personalizar el contenido o acciones (ej. un botón de "Play" o "Ver Detalles").
        2.  Crear el componente `HomePage.svelte` (ej. en `src/routes/HomePage.svelte` si usas un enrutador basado en componentes, o `src/pages/Home.svelte`).
        3.  En `HomePage.svelte`, cargar las canciones (y/o álbumes/artistas) utilizando las funciones del cliente API (definido en la tarjeta 🔗 [API]) y `@tanstack/svelte-query` para una gestión eficiente de los datos.
        4.  Renderizar los elementos cargados utilizando el componente `Card.svelte` dentro de un diseño de cuadrícula (CSS Grid o Flexbox).
    *   **Archivos de Referencia:** `static/index.html`, `static/albums/albumsMenuView.html`, `js/utilities.js` (`songTemplate`), `src/services/apiClient.ts` (del paso anterior).

*   **Título de la Tarjeta:** 🎼 [COMPONENT] Página de Detalles de Canción (`SongDetail`)
    *   **Descripción:** Convertir el contenido de `static/songs/showSongByID.html` en un componente `SongDetailPage.svelte`. Este será uno de los componentes más complejos, manejando la visualización de detalles, comentarios y la funcionalidad de "likes".
    *   **Tareas:**
        1.  Obtener el ID de la canción de los parámetros de la ruta utilizando la API del enrutador de Svelte elegido.
        2.  Cargar los datos de la canción, sus comentarios y la información de "likes" usando las funciones del cliente API y `@tanstack/svelte-query`.
        3.  Crear sub-componentes reutilizables de Svelte como `CommentList.svelte`, `CommentForm.svelte`, y `LikeButton.svelte`.
        4.  Gestionar la interacción de "like" (estado del botón, envío al API) y el envío de comentarios utilizando el estado reactivo de Svelte y las funciones API.
        5.  Integrar el componente `MusicPlayer` globalmente (si existe) para permitir la reproducción de la canción desde esta página.
    *   **Archivos de Referencia:** `static/songs/showSongByID.html`, `src/services/apiClient.ts`.

*   **Título de la Tarjeta:** 🗂️ [COMPONENT] Vistas de Listado (Álbumes, Artistas, Playlists)
    *   **Descripción:** Migrar las vistas de listado de álbumes (`albumsMenuView.html`), artistas (`artistsMenuView.html`) y playlists (`playlistsMenuView.html`) a componentes de Svelte.
    *   **Tareas:**
        1.  Crear componentes de página específicos como `AlbumsPage.svelte`, `ArtistsPage.svelte`, `PlaylistsPage.svelte` (ej. en `src/routes/` o `src/pages/`).
        2.  Cada componente cargará sus datos correspondientes utilizando el cliente API y `@tanstack/svelte-query`.
        3.  Renderizar los elementos cargados utilizando el componente `Card.svelte` genérico (creado previamente) dentro de un diseño de cuadrícula o lista.
        4.  Implementar la paginación o carga infinita si es necesario para grandes colecciones.
    *   **Archivos de Referencia:** `static/albums/albumsMenuView.html`, `static/artists/artistsMenuView.html`, `static/playlists/playlistsMenuView.html`, `src/services/apiClient.ts`, `src/lib/Card.svelte`.

*   **Título de la Tarjeta:** 🔍 [FEATURE] Componente de Búsqueda Global
    *   **Descripción:** Reimplementar la funcionalidad de búsqueda (`setupSearch` en `utilities.js`) como un componente Svelte reutilizable.
    *   **Tareas:**
        1.  Crear un componente `SearchInput.svelte` (ej. en `src/lib/SearchInput.svelte`) que gestione el estado del campo de entrada (usando `bind:value`) y emita eventos de búsqueda (usando `createEventDispatcher` o simplemente props y callbacks).
        2.  Integrar este componente en las páginas de listado (`HomePage.svelte`, `AlbumsPage.svelte`, `ArtistsPage.svelte`) o en el componente de layout principal si la búsqueda es global.
        3.  Implementar la lógica para llamar a las APIs de búsqueda (utilizando el cliente API y `@tanstack/svelte-query` con sus funcionalidades de debounce para optimizar las llamadas) y mostrar los resultados filtrados.
    *   **Archivos de Referencia:** `js/utilities.js` (`setupSearch`), `static/index.html`, `src/services/apiClient.ts`.

*   **Título de la Tarjeta:** 📝 [COMPONENT] Formularios de Creación y Edición
    *   **Descripción:** Convertir todos los formularios HTML existentes (`newAlbumView.html`, `editSongView.html`, etc.) en componentes de Svelte reactivos y completamente tipados.
    *   **Tareas:**
        1.  Crear componentes de formulario Svelte específicos como `NewAlbumForm.svelte`, `EditSongForm.svelte` (ej. en `src/components/forms/`).
        2.  Gestionar el estado de los campos de entrada utilizando `bind:value` y el estado reactivo de Svelte.
        3.  Implementar la lógica de envío del formulario, llamando a las funciones apropiadas del cliente API (POST, PUT) para insertar/actualizar datos en el backend. Utilizar `@tanstack/svelte-query` para manejar mutaciones y la invalidación de caché.
        4.  Manejar la subida de archivos (imágenes, música) utilizando el objeto `FormData` y las llamadas API. Asegurarse de que el backend esté configurado para recibir estos archivos.
        5.  Implementar validación de formularios, mostrando mensajes de error al usuario.
    *   **Archivos de Referencia:** `static/songs/newSongView.html`, `static/albums/editAlbumView.html`, `static/playlists/newPlaylistView.html`, `src/services/apiClient.ts`.

### **Fase 4: Despliegue**

*   **Título de la Tarjeta:** 🚀 [DEPLOY] Configurar Bun para Servir la SPA Svelte
    *   **Descripción:** Ajustar el servidor Bun para que sirva tu aplicación Svelte compilada como una SPA.
    *   **Tareas:**
        1.  (Ya configurado) Configurar tu `frontend/package.json` para tener un script de `build` que ejecute `vite build` y mueva los archivos compilados a `frontend/dist/`.
        2.  (Ya configurado) Modificar tu `index.ts` del backend para servir el `frontend/dist/index.html` como fallback para todas las rutas que no sean de la API.
        3.  (Ya configurado) Asegurarse de que Bun sirva correctamente los archivos estáticos (JS compilado, CSS, imágenes) desde el directorio `frontend/dist/` y `static/`.
        4.  (Ya configurado) Utilizar `concurrently` para ejecutar `bun run index.ts` y `cd frontend && bun run build` para construir y servir ambas partes del proyecto.
    *   **Objetivo:** La aplicación Svelte se carga y funciona como una SPA, con el backend de Bun sirviendo las APIs y los assets del frontend.
