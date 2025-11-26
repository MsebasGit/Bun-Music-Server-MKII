🧩 Lista de Componentes
Este documento detalla los componentes visuales de la interfaz de usuario, inferidos desde los archivos en `static`.

---

### 🧭 Navegación y Vistas Principales

- **Vista Principal (`index.html`)**
  - Barra de búsqueda global para canciones, artistas y álbumes.
  - Grilla de tarjetas con "Todas las Canciones".

- **Menú Lateral (`sidebar.html`)**
  - Enlaces de navegación: Home, Álbumes, Artistas.
  - Sección "Tú cuenta": Playlists, Favoritos.
  - Sección "Tú Studio": Enlace al panel de artista (o para registrarse).
  - Enlace para "Cambiar de cuenta" (Login/Logout).

- **Vista General de Álbumes (`albumsMenuView.html`)**
  - Barra de búsqueda para álbumes.
  - Grilla de tarjetas con todos los álbumes disponibles.

- **Vista General de Artistas (`artistsMenuView.html`)**
  - Barra de búsqueda para artistas.
  - Grilla de tarjetas con todos los artistas disponibles.

---

### 🎶 Vistas de Contenido Musical

- **Detalle de Canción (`showSongByID.html`)**
  - **Panel Izquierdo (Principal):**
    - Título, portada, y detalles (idioma, género, fecha, etc.).
    - Nombres de los artistas (con enlaces a sus perfiles).
    - Reproductor de audio para la canción actual.
    - **Barra de Acciones:**
      - Botón de "Like" con contador.
      - Selector para añadir la canción a una de tus playlists.
    - **Sección de Comentarios:**
      - Formulario para escribir un nuevo comentario.
      - Lista de comentarios existentes (con nombre de usuario y fecha).
      - Botones para editar/eliminar tus propios comentarios.
  - **Panel Derecho (Lateral):**
    - Lista de "Todas las Canciones" para navegación rápida, resaltando la actual.

- **Contenido de un Artista (`songsArtistView.html`, `albumsArtistView.html`, `socialNetworkArtistView.html`)**
  - Encabezado con el nombre del artista.
  - Barra de navegación del artista (Canciones, Álbumes, Redes Sociales).
  - **Pestaña Canciones:**
    - Botón "Reproducir Todas".
    - Reproductor de música para la cola de canciones del artista.
    - Grilla de tarjetas con las canciones del artista.
  - **Pestaña Álbumes:**
    - Grilla de tarjetas con los álbumes del artista.
  - **Pestaña Redes Sociales (Acerca de):**
    - Biografía del artista.
    - Lista de vínculos a sus redes sociales.
    - Información adicional (Nacionalidad, Debut, Contacto).

- **Canciones de un Álbum (`albumSongsView.html`)**
  - Título del álbum.
  - Botón "Reproducir Todas".
  - Reproductor de música para la cola de canciones del álbum.
  - Grilla de tarjetas con las canciones que pertenecen al álbum.

---

### 👤 Vistas de Usuario (Mi Cuenta)

- **Mis Playlists (`playlistsMenuView.html`)**
  - Botón para "Crear playlist".
  - Grilla de tarjetas con las playlists del usuario.
  - Cada tarjeta tiene botones para "Editar" y "Borrar".

- **Canciones de una Playlist (`playlistSongsView.html`)**
  - Detalles de la playlist (nombre, descripción, fechas).
  - Botón "Reproducir Todas".
  - Reproductor de música.
  - Grilla de tarjetas con las canciones de la playlist.
  - Cada tarjeta de canción tiene un botón para "Quitar de la playlist".

- **Canciones que me Gustan (`likedSongsView.html`)**
  - Barra de búsqueda para filtrar canciones favoritas.
  - Botón "Reproducir Todas".
  - Reproductor de música.
  - Grilla de tarjetas con todas las canciones a las que el usuario ha dado "like".

---

### 🚀 Vistas de Artista (Studio)

- **Menú del Studio (`meMenu.html`)**
  - Botones para:
    - "Crear canción" y "Administrar músicas".
    - "Crear álbum" y "Administrar álbumes".
    - "Agregar redes" sociales.

- **Mis Canciones (`meSongsView.html`)**
  - Detalles del perfil del artista.
  - Grilla de tarjetas con las canciones del artista.
  - **Acciones por Canción:**
    - Botón "Editar".
    - Botón "Eliminar".
    - Botón "Añadir Colaborador".
    - Botón "Administrar Colaboradores".

- **Mis Álbumes (`meAlbumsView.html`)**
  - Detalles del perfil del artista.
  - Grilla de tarjetas con los álbumes del artista.
  - **Acciones por Álbum:**
    - Botón "Editar".
    - Botón "Eliminar".

- **Administrar Colaboradores (`manageCollaboratorsView.html`)**
  - Título de la canción que se está administrando.
  - Lista de artistas colaboradores.
  - Botón para "Eliminar" a un colaborador de la canción.

---

### ✍️ Formularios (Creación y Edición)

- **Formulario de Canción (`newSongView.html`, `editSongView.html`)**
  - Campos para título, lenguaje, género.
  - Carga de archivo de audio y de imagen de portada.
  - Selector para asociar la canción a un álbum (opcional).

- **Formulario de Álbum (`newAlbumView.html`, `editAlbumView.html`)**
  - Campo para el nombre del álbum.
  - Carga de imagen de portada.

- **Formulario de Playlist (`newPlaylistView.html`, `editPlaylistView.html`)**
  - Campos para nombre y descripción.

- **Formulario de Registro de Artista (`newArtistView.html`)**
  - Campos para nombre artístico, nacionalidad, biografía y fecha de debut.

- **Formulario de Añadir Colaborador (`newSongArtistView.html`)**
  - Selector de canción (informativo).
  - Selector para elegir el artista a añadir como colaborador.

- **Formulario de Red Social (`newSocialNetworkView.html`)**
  - Campos para el nombre de la red y la URL del perfil.

- **Formulario de Edición de Usuario (`editUserView.html`)**
  - Campos para nombre de usuario y email.
  - Botón para eliminar la cuenta de usuario.

---

### 🔐 Autenticación

- **Inicio de Sesión (`login.html`)**
  - Formulario con campos para usuario y contraseña.
  - Botón para redirigir al registro.

- **Registro (`signup.html`)**
  - Formulario con campos para usuario, contraseña y email.
  - Botón para redirigir al inicio de sesión.