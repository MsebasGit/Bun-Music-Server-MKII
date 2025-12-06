// src/controllers/auth.controller.ts
import { registerService, loginService } from '../services/auth.service';
import { handleRequest } from '../utilities/controllerUtils';

// Dejamos que Elysia infiera los tipos del contexto
export const registerController = (context: any) => 
  handleRequest(registerService, context, 201);

export const loginController = (context: any) => {
    // Definimos el manejador de éxito específico para el login
    const handleLoginSuccess = async (user: any, ctx: any) => {
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