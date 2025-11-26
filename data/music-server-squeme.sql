-- Habilitar la verificación de claves foráneas
PRAGMA foreign_keys = ON;

------------------------------------------------------
-- 1. Table USERS (La Cuenta Personal/Oyente)
------------------------------------------------------
CREATE TABLE users (
    id_user         INTEGER PRIMARY KEY,
    name            TEXT NOT NULL,
    password        TEXT NOT NULL,
    creation_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email           TEXT UNIQUE NOT NULL -- Email único y obligatorio
);

---

------------------------------------------------------
-- 2. Table ARTISTS (La Entidad Creadora Oficial)
------------------------------------------------------
CREATE TABLE artists (
    id_artist       INTEGER PRIMARY KEY,
    name            TEXT UNIQUE NOT NULL, -- Nombre artístico único y obligatorio
    nationality     TEXT,
    biography       TEXT,
    debut_date      TIMESTAMP,
    id_user         INTEGER,
    -- Si el usuario asociado al artista se borra, ¿qué pasa? SET NULL parece adecuado.
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

---

------------------------------------------------------
-- 3. Table ALBUMS (Corregida)
------------------------------------------------------
CREATE TABLE albums (
    id_album        INTEGER PRIMARY KEY,
    name            TEXT NOT NULL,
    release_date    TIMESTAMP,
    cover_path      TEXT,
    id_artist       INTEGER NOT NULL, -- <-- NUEVO CAMPO: Artista principal
    -- Si el artista principal se borra, ¿borramos el álbum? Generalmente sí (CASCADE)
    FOREIGN KEY (id_artist) REFERENCES artists(id_artist) ON DELETE CASCADE
);

---

------------------------------------------------------
-- 4. Table SONGS
------------------------------------------------------
CREATE TABLE songs (
    id_song             INTEGER PRIMARY KEY,
    title               TEXT NOT NULL, -- El título puede no ser único si hay covers, quitamos UNIQUE.
    language            TEXT,
    release_date        TIMESTAMP,
    duration            REAL NOT NULL, -- La duración debe ser obligatoria
    genre               TEXT,
    song_path           TEXT UNIQUE NOT NULL, -- La ruta del archivo sí debe ser única
    cover_path          TEXT,
    id_album            INTEGER,
    -- Si el album se borra, la canción ya no tendrá album (SET NULL) o se borra (CASCADE)?
    -- Optamos por SET NULL, si el album se borra, la canción queda 'huérfana' pero existe.
    FOREIGN KEY (id_album) REFERENCES albums(id_album) ON DELETE SET NULL
);

---

------------------------------------------------------
-- 5. Table SOCIAL_NETWORKS
------------------------------------------------------
CREATE TABLE social_networks (
    id_network      INTEGER PRIMARY KEY,
    name            TEXT NOT NULL,
    url             TEXT UNIQUE NOT NULL, -- La URL debe ser única
    id_artist       INTEGER NOT NULL,
    -- Si el artista se borra, borramos automáticamente sus redes sociales
    FOREIGN KEY (id_artist) REFERENCES artists(id_artist) ON DELETE CASCADE
);

---

------------------------------------------------------
-- 6. Table PLAYLISTS
------------------------------------------------------
CREATE TABLE playlists (
    id_playlist         INTEGER PRIMARY KEY,
    name                TEXT NOT NULL,
    description         TEXT,
    modification_date   TIMESTAMP,
    creation_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_user             INTEGER,
    -- Si el usuario que creó la playlist se borra, ¿qué pasa?
    -- Opción A (SET NULL): La playlist permanece sin dueño.
    -- Opción B (CASCADE): La playlist se borra con el usuario.
    -- Elegimos SET NULL para conservar las playlists.
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

---

------------------------------------------------------
-- 7. Table SONGS_ARTISTS (N:M entre Canción y Artista)
------------------------------------------------------
CREATE TABLE songs_artists (
    id_artist   INTEGER,
    id_song     INTEGER,
    PRIMARY KEY (id_artist, id_song),
    -- Si el artista o la canción se borran, se borra la relación
    FOREIGN KEY (id_artist) REFERENCES artists(id_artist) ON DELETE CASCADE,
    FOREIGN KEY (id_song) REFERENCES songs(id_song) ON DELETE CASCADE
);

---

------------------------------------------------------
-- 8. Table COMMENTS (Comentarios en Canciones)
------------------------------------------------------
CREATE TABLE comments (
    id_comment        INTEGER PRIMARY KEY,
    comment_text      TEXT NOT NULL,
    creation_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP,
    id_song           INTEGER NOT NULL,
    id_user           INTEGER,
    -- Si la canción se borra, se borran los comentarios (CASCADE)
    FOREIGN KEY (id_song) REFERENCES songs(id_song) ON DELETE CASCADE,
    -- Si el usuario se borra, el comentario permanece pero sin dueño (SET NULL)
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL
);

---

------------------------------------------------------
-- 9. Table PLAYLISTS_SONGS (N:M entre Playlist y Canción)
------------------------------------------------------
CREATE TABLE playlists_songs (
    id_playlist INTEGER,
    id_song     INTEGER,
    PRIMARY KEY (id_playlist, id_song),
    -- **¡IMPLEMENTACIÓN REQUERIDA!** Si la playlist se borra, se borran todas las referencias.
    FOREIGN KEY (id_playlist) REFERENCES playlists(id_playlist) ON DELETE CASCADE,
    -- Si la canción se borra, se borra la referencia de la playlist.
    FOREIGN KEY (id_song) REFERENCES songs(id_song) ON DELETE CASCADE
);

---

------------------------------------------------------
-- 10. Tabla USER_SONG_RATINGS (Likes de Usuarios a Canciones)
------------------------------------------------------
CREATE TABLE user_song_ratings (
    id_user         INTEGER,
    id_song         INTEGER,
    is_liked        BOOLEAN NOT NULL DEFAULT TRUE,
    interaction_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_user, id_song),

    -- Si el usuario o la canción se borran, se borra la calificación
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_song) REFERENCES songs(id_song) ON DELETE CASCADE
);