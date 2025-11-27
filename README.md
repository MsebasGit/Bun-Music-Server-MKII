# dbiiproy

## Proyecto:
(Base) Sistema de streaming músical, escrito en Bun (con TypeScript) y SQLite con las siguientes caracteristicas:
   - Incluye login
   - Permite tener usuarios con rol de invitados y artistas
   - Incluye procesos CRUD para canciones, álbumes y playlists (usuario con rol de artista)
   - Permite interactuar mediante "Me gusta" y comentarios (todos los usuarios)
   - Permite escuchar las canciones
(Añadido) Mejora y correcciones del primer sistema musical con ayuda de un framework frontend
   - Correciones en el backend
   - Uso la librería Halogen/PureScript para mejorar y corregir el frontend
     - Simplificar lógica
     - Creación de componentes

## Objetivo
Mejorar el primer sistema con mejores prácticas en el Backend, añadiendo más funcionalidades y utilizando Halogen para reconstruir totalmente el frontend

## Lista de tareas:
(Trello) https://trello.com/invite/b/69275f5b5cb172437e8db648/ATTIdef8b8c47c6a7bf2c84b6fd57262e06e61E700F8/bun-music-server-mkii

## Integrantes:
  - Medrano Chacolla Sebastian Jorge
  - Torrez Flores Nicole Fabiana
  - Puente Herendia Alain Puente
  
  
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
