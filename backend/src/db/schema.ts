// src/db/schema.ts
import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// -- TABLAS PRINCIPALES --

export const users = sqliteTable("users", {
  id: integer("id_user").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  password: text("password").notNull(),
  creationDate: text("creation_date").default(sql`(strftime('%Y-%m-%d %H:%M:%S', 'now'))`),
  email: text("email").notNull().unique(),
  preferences: text("preferences", { mode: 'json' }), // Para almacenar un objeto JSON como texto
});

export const artists = sqliteTable("artists", {
  id: integer("id_artist").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  nationality: text("nationality"),
  biography: text("biography"),
  debutDate: text("debut_date"),
  userId: integer("id_user").references(() => users.id, { onDelete: 'set null' }).unique(),
  socialLinks: text("social_links", { mode: 'json' }), // JSON como texto
});

export const albums = sqliteTable("albums", {
  id: integer("id_album").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  releaseDate: text("release_date"),
  coverPath: text("cover_path"),
  artistId: integer("id_artist").notNull().references(() => artists.id, { onDelete: 'cascade' }),
});

export const songs = sqliteTable("songs", {
  id: integer("id_song").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  language: text("language"),
  releaseDate: text("release_date"),
  duration: integer("duration").notNull(),
  songPath: text("song_path").notNull().unique(),
  coverPath: text("cover_path"),
  albumId: integer("id_album").references(() => albums.id, { onDelete: 'set null' }),
  genres: text("genres", { mode: 'json' }), // JSON como texto
  metadata: text("metadata", { mode: 'json' }), // JSON como texto
});

export const playlists = sqliteTable("playlists", {
  id: integer("id_playlist").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  modificationDate: text("modification_date"),
  creationDate: text("creation_date").default(sql`(strftime('%Y-%m-%d %H:%M:%S', 'now'))`),
  userId: integer("id_user").references(() => users.id, { onDelete: 'set null' }),
});

// -- TABLAS DE RELACIONES (Muchos a Muchos) --

export const songsToArtists = sqliteTable("songs_artists", {
  artistId: integer("id_artist").notNull().references(() => artists.id, { onDelete: 'cascade' }),
  songId: integer("id_song").notNull().references(() => songs.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.artistId, t.songId] }),
}));

export const playlistsToSongs = sqliteTable("playlists_songs", {
  playlistId: integer("id_playlist").notNull().references(() => playlists.id, { onDelete: 'cascade' }),
  songId: integer("id_song").notNull().references(() => songs.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.playlistId, t.songId] }),
}));

export const userSongRatings = sqliteTable("user_song_ratings", {
  userId: integer("id_user").notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: integer("id_song").notNull().references(() => songs.id, { onDelete: 'cascade' }),
  isLiked: integer("is_liked", { mode: 'boolean' }).notNull().default(true),
  interactionDate: text("interaction_date").default(sql`(strftime('%Y-%m-%d %H:%M:%S', 'now'))`),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.songId] }),
}));


// -- DEFINICIÓN DE TIPOS --
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewArtist = typeof artists.$inferInsert;
export type NewAlbum = typeof albums.$inferInsert;
export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = typeof playlists.$inferInsert;
export type NewSong = typeof songs.$inferInsert;
// (Puedes añadir más tipos para las otras tablas si los necesitas)
