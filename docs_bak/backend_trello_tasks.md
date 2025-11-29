# Plan de Mejoras para el Backend (Tarjetas para Trello)

Aquí tienes una lista de tareas que puedes copiar a tu tablero de Trello para mejorar la calidad y mantenibilidad de tu servidor de música.

## Categoría: Refactorización Crítica (Alto Impacto)

*   **Título de la Tarjeta:** 🐞 [BUG] Usar Conexión de DB Compartida en `authUtils.ts`
    *   **Descripción:** Actualmente, `src/utilities/authUtils.ts` crea una nueva conexión a la base de datos (`new Database(...)`) en cada llamada a `isArtist` o `isSongOwner`. Esto es muy ineficiente y puede agotar los recursos. Se debe refactorizar para que utilice la instancia `db` ya exportada por `src/utilities/connectionDB.ts`.
    *   **Archivos Afectados:** `src/utilities/authUtils.ts`.

*   **Título de la Tarjeta:** 🎨 [REFACTOR] Unificar el Formato de Respuestas de la API
    *   **Descripción:** Las respuestas de la API son inconsistentes. Por ejemplo, al crear (`POST`), algunas rutas redirigen (`302`), mientras que al actualizar (`PUT`) o eliminar (`DELETE`), devuelven un JSON. Debemos estandarizar esto para seguir un patrón RESTful:
        *   `POST`: Devolver `201 Created` con el recurso creado.
        *   `PUT`: Devolver `200 OK` con el recurso actualizado, o `204 No Content`.
        *   `DELETE`: Devolver `204 No Content`.
        *   Las redirecciones (`302`) deben usarse solo para la navegación entre páginas HTML, no en los endpoints de la API.
    *   **Archivos Afectados:** `src/utilities/controllerUtils.ts` (principalmente `handleInsert`, `handleUpdate`, `handleDeleteById`), y varios controladores que no los usan.

*   **Título de la Tarjeta:** 🎨 [REFACTOR] Centralizar el Manejo de Errores en los Modelos
    *   **Descripción:** Hay inconsistencias en el manejo de errores. Por ejemplo, `src/model/userModel.ts` a veces usa `try/catch` y otras veces no, a pesar de que ya existe una utilidad `executeDbQuery`. Debemos asegurar que **todas** las consultas en **todos** los modelos se envuelvan con `executeDbQuery` para un manejo de errores uniforme y centralizado.
    *   **Archivos Afectados:** `src/model/*.ts`.

## Categoría: Mejoras de Código y DRY (Don't Repeat Yourself)

*   **Título de la Tarjeta:** 🎨 [REFACTOR] Abstraer la Lógica de Subida de Archivos
    *   **Descripción:** La lógica para validar, generar un nombre seguro y guardar archivos está duplicada en `songController.ts` y `albumController.ts`. Crear una nueva función en `src/utilities/controllerUtils.ts`, como `async function handleFileUpload(file: File, allowedExtensions: string[], destinationPath: string): Promise<string>`, que se encargue de este proceso y devuelva la ruta final del archivo.
    *   **Archivos Afectados:** `src/controller/songController.ts`, `src/controller/albumController.ts`, `src/utilities/controllerUtils.ts`.

*   **Título de la Tarjeta:** 🎨 [REFACTOR] Simplificar la Autorización con Middlewares
    *   **Descripción:** La lógica de autorización (ej. `isArtist`, `isSongOwner`) se llama directamente dentro de los manejadores de ruta. Sería más limpio y reutilizable implementarlo como un "middleware" o una función de envoltura que decore al manejador principal. Esto separaría la autorización de la lógica de negocio.
    *   **Archivos Afectados:** `src/routes/*.ts`, `src/utilities/authUtils.ts`.

*   **Título de la Tarjeta:** 🎨 [REFACTOR] Unificar Nomenclatura de Endpoints de la API
    *   **Descripción:** Algunos endpoints de la API usan un prefijo `/get/` (ej. `/get/albums`), lo cual no es una convención estándar en APIs REST. Se deben renombrar estas rutas para que sean más intuitivas. Por ejemplo:
        *   `GET /get/albums` -> `GET /api/albums`
        *   `GET /get/artists/:id/songs` -> `GET /api/artists/:id/songs`
        *   (Opcional) Mover todas las rutas de la API bajo un prefijo común como `/api/v1/`.
    *   **Archivos Afectados:** `src/routes/*.ts`.

## Categoría: Optimización y Rendimiento

*   **Título de la Tarjeta:** 🚀 [OPTIMIZACIÓN] Cachear el Estado de Artista del Usuario
    *   **Descripción:** Funciones como `isArtist` consultan la base de datos en cada petición para verificar si un usuario es un artista. Este estado no cambia frecuentemente. Considerar añadir el `id_artist` (si existe) al cookie encriptado del usuario durante el login. De esta forma, la verificación se puede hacer leyendo el cookie, evitando una consulta a la base de datos en cada petición protegida.
    *   **Archivos Afectados:** `src/controller/userController.ts` (al hacer login), `src/utilities/authUtils.ts` (al verificar).
