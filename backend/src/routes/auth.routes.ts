// src/routes/auth.routes.ts
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { registerController, loginController } from "../controllers/auth.controller";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET as string,
      exp: "7d",
    })
  )
  // La ruta solo define el path, el handler del controlador, y la validación del body.
  .post("/register", registerController, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
    }),
  })
  // Igual para el login.
  .post("/login", loginController, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
  });