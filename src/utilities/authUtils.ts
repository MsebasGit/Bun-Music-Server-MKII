
import { Database } from "bun:sqlite";
import { getUserCookie } from "./getCookie";

export async function isArtist(req: Request): Promise<{ id_artist: number } | Response> {
    const db = new Database("data/music-server.db");
    const userId = await getUserCookie(req);

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const artist = db.query<{ id_artist: number }, [number]>("SELECT id_artist FROM artists WHERE id_user = ?").get(userId);

    if (!artist) {
        return new Response("Forbidden: You are not an artist", { status: 403 });
    }

    return artist;
}

export async function isSongOwner(req: Request, songId: number): Promise<Response | null> {
    const db = new Database("data/music-server.db");

    const artistResult = await isArtist(req);
    if (artistResult instanceof Response) {
        return artistResult;
    }
    const artistId = artistResult.id_artist;

    // Check if the artist is associated with the song
    const songArtist = db.query("SELECT * FROM songs_artists WHERE id_artist = ? AND id_song = ?").get(artistId, songId);

    if (!songArtist) {
        return new Response("Forbidden: You are not the owner of this song", { status: 403 });
    }

    return null; // User is the owner
}
