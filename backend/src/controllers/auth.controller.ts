import { registerService, loginService } from '../services/auth.service';
import { handleRequest } from '../utilities/controllerUtils';
import { isUserAnArtist } from '../services/artist.service';

// Dejamos que Elysia infiera los tipos del contexto
export const registerController = (context: any) => 
  handleRequest(registerService, context, 201);

export const loginController = (context: any) => {
    // Definimos el manejador de éxito específico para el login
    const handleLoginSuccess = async (user: any, ctx: any) => {
        
        // Verificamos si el usuario es un artista
        const artistId = await isUserAnArtist(user.id);
        const isArtist = !!artistId; // Convertimos el ID (o null) a un booleano

        // Creamos el payload del token con el rol incluido
        const payload = { 
            userId: user.id,
            isArtist: isArtist 
        };
        
        const token = await ctx.jwt.sign(payload);

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

export const handleAuthStatus = (context: any) => {
    const isArtist = !!context.artist;
    
    context.set.status = 200;
    return {
        isAuthenticated: true,
        isArtist: isArtist,
        user: { 
            userId: context.user.userId 
        },
        artist: context.artist || null
    };
};