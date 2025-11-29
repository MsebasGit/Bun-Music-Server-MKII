// src/middlewares/auth.ts
import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
    // Plugin JWT
    .use(
        jwt({
            name: "jwt",
            secret: Bun.env.JWT_SECRET || "SECRET_KEY",
        })
    )
    // Middleware para validar token
    .onBeforeHandle(async ({ jwt, request, set }) => {
        const auth = request.headers.get("authorization");

        if (!auth) {
            set.status = 401;
            return { error: "Token no proporcionado" };
        }

        const token = auth.replace("Bearer ", "");
        const payload = await jwt.verify(token);

        if (!payload) {
            set.status = 401;
            return { error: "Token inválido o expirado" };
        }

        // Guardamos el usuario en el contexto
        request.user = payload;
    });

