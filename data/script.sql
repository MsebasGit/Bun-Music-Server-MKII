
-- Desactivar restricciones de FK (Solo en SQLite/MySQL temporalmente)
PRAGMA foreign_keys = OFF;

-- Borrar datos en cualquier orden
DELETE FROM songs_artists;
DELETE FROM playlists_songs;
DELETE FROM social_networks;
DELETE FROM songs;
DELETE FROM playlists;
DELETE FROM artists;
DELETE FROM albums;
DELETE FROM users;

-- Reactivar restricciones de FK
PRAGMA foreign_keys = ON;