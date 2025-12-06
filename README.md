# Music Server API con Bun, Elysia y Drizzle

## Descripción del Proyecto
Este es un sistema de backend para un servidor de streaming de música, construido con **Bun**, el framework web **Elysia.js** y **Drizzle ORM** para la gestión de la base de datos **SQLite**.

El proyecto actualmente soporta:
-   Autenticación de usuarios (registro e inicio de sesión) utilizando emails y JWTs.
-   Gestión de usuarios con roles (invitados y artistas).
-   Operaciones CRUD para canciones, álbumes y playlists (para usuarios con rol de artista).
-   Interacciones de usuario como "Me gusta" y comentarios.
-   Funcionalidades para el streaming de canciones.

## Frontend (Svelte)
Existe una aplicación frontend complementaria, construida con Svelte, diseñada para interactuar con esta API.

## Tecnologías Utilizadas
-   **Runtime**: [Bun](https://bun.sh)
-   **Web Framework**: [Elysia.js](https://elysiajs.com/)
-   **Base de Datos**: SQLite
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Autenticación**: JWT, Bun.password

## Integrantes
-   Medrano Chacolla Sebastian Jorge
-   Torrez Flores Nicole Fabiana
-   Puente Herendia Alain Puente

## Lista de Tareas
[Tablero de Trello](https://trello.com/invite/b/69275f5cb172437e8db648/ATTIdef8b8c47c6a7bf2c84b6fd57262e06e61E700F8/bun-music-server-mkii)