// src/guards/auth.guard.ts
import { isUserAnArtist, getArtistByUserId } from "../services/artist.service";

export const authGuard = async (context: any) => {
  const { jwt, set, headers, request } = context;

  console.log(`[${new Date().toISOString()}] Auth Guard Triggered for ${request.method} ${new URL(request.url).pathname}`);

  const authorization = headers.authorization || headers.Authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log(`[${new Date().toISOString()}] Auth FAILED: No token provided.`);
    set.status = 401;
    return { message: "Unauthorized: No token provided" };
  }

  const token = authorization.substring(7);
  const payload = await jwt.verify(token);

  if (!payload) {
    console.log(`[${new Date().toISOString()}] Auth FAILED: Invalid token.`);
    set.status = 401;
    return { message: "Unauthorized: Invalid token" };
  }

  if(await isUserAnArtist(payload.userId)) {
    const artist = await getArtistByUserId(payload.userId);
    console.log(`[${new Date().toISOString()}] Auth SUCCESS for artist:`, artist?.name);
    // Attach artist info to the context for the next handler
    context.artist = artist;
  }

  console.log(`[${new Date().toISOString()}] Auth SUCCESS for user:`, payload.userId);
  // Attach user to the context for the next handler
  context.user = payload;
  
};
