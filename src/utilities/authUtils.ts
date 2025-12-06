
import { db } from "./connectionDB";
import { getUserDataFromCookie } from "./getCookie";

export async function isArtist(req: Request): Promise<{ id_artist: number } | Response> {
    const userData = await getUserDataFromCookie(req);

    if (!userData || !userData.id_user) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (userData.id_artist) {
        return { id_artist: userData.id_artist };
    }

    // Fallback to database query if not in cookie (optional, but safer)
    const artist = db.query<{ id_artist: number }, [number]>("SELECT id_artist FROM artists WHERE id_user = ?").get(userData.id_user);

    if (!artist) {
        return new Response("Forbidden: You are not an artist", { status: 403 });
    }

    return artist;
}

export async function isSongOwner(req: Request, songId: number): Promise<Response | null> {
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

export function withAuthCheck(authFunction: Function, passAuthResult: boolean = false) {
    return function(handler: Function): Function {
        return async function(req: Request, ...params: any[]) {
            const authResult = await authFunction(req, ...params);

            if (authResult instanceof Response) {
                return authResult; // Authorization failed
            }
            
            if (passAuthResult) {
                return handler(req, authResult, ...params);
            }

            return handler(req, ...params);
        }
    }
}
