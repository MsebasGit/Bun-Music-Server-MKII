// src/routes/auth.routes.ts
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { registerController, loginController, handleAuthStatus } from "../controllers/auth.controller";
import { authGuard } from "../guards/auth.guard";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET as string,
      exp: "7d",
    })
  )
  // --- Rutas Públicas ---
  .post("/register", registerController, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
    }),
  })
  .post("/login", loginController, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
  })

  // --- Rutas Protegidas ---
  .guard({
      beforeHandle: authGuard 
    },
    (app) => app.get("/status", handleAuthStatus)
  );