// src/controllers/auth.controller.ts
import { registerService, loginService } from '../services/auth.service';
import { handleRequest } from '../utilities/controllerUtils';

// Definimos un tipo genérico para el contexto de Elysia que usan nuestros handlers
type ElysiaContext = { body: any; set: any; jwt: any; [key: string]: any };

export const registerController = (context: ElysiaContext) => 
  handleRequest(registerService, context, 201);

export const loginController = (context: ElysiaContext) => {
    // Definimos el manejador de éxito específico para el login
    const handleLoginSuccess = async (user: any, ctx: ElysiaContext) => {
        const token = await ctx.jwt.sign({ userId: user.id });
        ctx.set.status = 200;
        return {
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email },
        };
    };
    // Llamamos a handleRequest con el manejador de éxito
    return handleRequest(loginService, context, 200, handleLoginSuccess);
}