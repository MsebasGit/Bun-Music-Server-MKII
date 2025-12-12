// src/guards/auth.guard.ts
import { isUserAnArtist, getArtistByUserId } from "../services/artist.service";

export const authGuard = async (context: any) => {
  const { jwt, set, headers, request } = context;

  const authorization = headers.authorization || headers.Authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    set.status = 401;
    return { message: "Unauthorized: No token provided" };
  }

  const token = authorization.substring(7);
  const payload = await jwt.verify(token);

  if (!payload) {
    set.status = 401;
    return { message: "Unauthorized: Invalid token" };
  }

  if(await isUserAnArtist(payload.userId)) {
    const artist = await getArtistByUserId(payload.userId);
    // Attach artist info to the context for the next handler
    context.artist = artist;
  }

  // Attach user to the context for the next handler
  context.user = payload;
  
};
