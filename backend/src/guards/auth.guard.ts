// src/guards/auth.guard.ts

// Eliminamos por completo la anotación de tipo del 'context'.
// Elysia inferirá que tiene las propiedades 'jwt', 'set' y 'headers' en este punto.
export const authGuard = async ({ jwt, set, headers }: any) => {
  const authorization = headers.authorization;
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

  return {
    user: payload,
  };
};
