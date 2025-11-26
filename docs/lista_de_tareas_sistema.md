# 📋 Hoja de Ruta del Sistema: Music Server

Este documento desglosa el desarrollo del sistema de catalogación de música en base a los requerimientos definidos en la documentación del proyecto (`db-original-MKIV.pdf`).

---

### ✅ Fase 1: Gestión de Contenido y Catálogo Principal

El objetivo de esta fase es construir el núcleo del sistema, permitiendo a los artistas subir y administrar su música, y a los usuarios explorarla.

- **Módulo de Autenticación y Usuarios**
  - [ ] Implementar formulario de registro de nuevos usuarios (`/signup`).
  - [ ] Implementar formulario de inicio de sesión (`/login`).
  - [ ] Crear endpoints para registrar, autenticar y obtener datos de usuarios.
  - [ ] Permitir la edición y eliminación de perfiles de usuario.

- **Módulo de Artistas (Perfil y Contenido)**
  - [ ] Implementar el proceso "Convertirse en Artista" a través de un formulario de registro.
  - [ ] Permitir a los artistas agregar y administrar sus redes sociales.
  - [ ] Crear una vista pública para el perfil del artista (biografía, nacionalidad, redes, etc.).
  - [ ] Crear endpoints para todas las operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre el perfil del artista.

- **Módulo de Canciones**
  - [ ] Permitir a un artista subir un archivo de audio (`.mp3`, `.wav`).
  - [ ] Implementar un formulario para registrar los detalles de una canción (título, género, idioma, portada).
  - [ ] Permitir la asignación de una canción a un álbum existente.
  - [ ] Implementar la gestión de colaboradores (añadir/eliminar otros artistas a una canción).
  - [ ] Permitir la edición de los detalles de una canción.
  - [ ] Permitir la eliminación de una canción de la plataforma.

- **Módulo de Álbumes**
  - [ ] Permitir a un artista crear un nuevo álbum (nombre, portada, fecha).
  - [ ] Permitir la edición de los detalles de un álbum.
  - [ ] Permitir la eliminación de un álbum.
  - [ ] Implementar la vista que muestra todos los álbumes de un artista.

- **Módulo de Catálogo y Búsqueda**
  - [ ] Implementar una vista de detalles para cada canción.
  - [ ] Implementar la vista de "contenido por artista" (sus canciones y álbumes).
  - [ ] Implementar la vista de "canciones por álbum".
  - [ ] Implementar una funcionalidad de búsqueda básica (por título de canción, nombre de artista, género).

---

### ✅ Fase 2: Interacción Social y Personalización

Esta fase se centra en las funcionalidades que permiten a los usuarios interactuar con el contenido y personalizar su experiencia.

- **Módulo de Playlists Personales**
  - [ ] Permitir a los usuarios crear nuevas playlists (con nombre y descripción).
  - [ ] Permitir a los usuarios editar sus playlists.
  - [ ] Permitir a los usuarios eliminar sus playlists.
  - [ ] Implementar la funcionalidad para añadir/quitar canciones de una playlist.
  - [ ] Crear la vista que muestra todas las playlists de un usuario.
  - [ ] Crear la vista que muestra todas las canciones dentro de una playlist específica.

- **Módulo de "Me Gusta" (Likes)**
  - [ ] Implementar la capacidad de un usuario para marcar/desmarcar una canción como "Me Gusta".
  - [ ] Crear una vista/playlist automática ("Canciones que me gustan") para cada usuario.
  - [ ] Mostrar un conteo público del total de "Me Gusta" para cada canción.

- **Módulo de Comentarios**
  - [ ] Permitir a los usuarios escribir y guardar comentarios en una canción específica.
  - [ ] Mostrar todos los comentarios asociados a una canción.
  - [ ] Permitir a un usuario modificar o eliminar sus propios comentarios.
  - [ ] Ordenar los comentarios del más reciente al más antiguo.

---

### ✅ Fase 3: Seguridad

Implementación de medidas de seguridad críticas para proteger los datos de los usuarios y la integridad del sistema.

- **Seguridad de Contraseñas**
  - [ ] Utilizar un algoritmo de hashing robusto (como **Bcrypt**) para almacenar las contraseñas de los usuarios.
  - [ ] Asegurar que las contraseñas nunca se almacenen en texto plano.

- **Gestión Segura de Sesiones**
  - [ ] Encriptar el identificador del usuario en la cookie de sesión utilizando un método de encriptación autenticada (**AES-GCM**).
  - [ ] Configurar las cookies de sesión con los atributos `HttpOnly` y `Path=/` para mitigar ataques XSS y CSRF.
  - [ ] Implementar middleware para verificar la identidad del usuario (y si es artista) en rutas protegidas.

---

### ✅ Fase 4: Interfaz de Usuario y Experiencia (Frontend)

Desarrollo de todas las vistas y componentes visuales para hacer el sistema funcional e intuitivo.

- **Vistas Principales y Navegación**
  - [ ] Diseñar y construir la página de inicio (`index.html`) que muestra todas las canciones.
  - [ ] Implementar la barra lateral de navegación (`sidebar.html`).
  - [ ] Construir la vista general de álbumes (`albumsMenuView.html`).
  - [ ] Construir la vista general de artistas (`artistsMenuView.html`).

- **Vistas del "Studio" para Artistas**
  - [ ] Crear un panel central (`meMenu.html`) para que los artistas accedan a las funciones de gestión.
  - [ ] Implementar las vistas para administrar canciones (`meSongsView.html`) y álbumes (`meAlbumsView.html`).
  - [ ] Desarrollar los formularios para crear/editar canciones, álbumes y añadir colaboradores.

- **Vistas de Usuario**
  - [ ] Implementar la vista para gestionar playlists (`playlistsMenuView.html`).
  - [ ] Desarrollar la vista que muestra el contenido de una playlist (`playlistSongsView.html`).
  - [ ] Crear la vista de canciones favoritas (`likedSongsView.html`).

- **Componentes Reutilizables y Utilitarios**
  - [ ] Crear un reproductor de música funcional para las vistas de álbum, playlist y artista.
  - [ ] Desarrollar funciones utilitarias en JavaScript (`utilities.js`) para peticiones `fetch`, manipulación del DOM y manejo de formularios.
  - [ ] Aplicar un diseño consistente (`style.css`) a todos los componentes de la aplicación.
