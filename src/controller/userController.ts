import * as userModel from '../model/userModel';
import * as artistModel from '../model/artistModel';
import { Elysia } from 'elysia';
import { getUserCookie } from '../utilities/getCookie';
import { isArtist } from '../utilities/authUtils';
import { encrypt } from '../utilities/cryptoUtils';
import { 
    handleGetAll, 
    handleGetById, 
    handleInsert, 
    handleUpdate, 
    handleDeleteById 
} from '../utilities/controllerUtils';

export {
    handleSignUp,
    handleLogin,
    getUserId,
    handleGetSongById,
    handleDeleteUser,
    handleUpdateUser
}

async function handleSignUp(req: Request): Promise<Response> {
    try {
        const body = await req.formData();
        const user = body.get("user") as string;
        const pass = body.get("password") as string;
        const hashedPassword = await Bun.password.hash(pass);
        const email = body.get("email") as string;

        if (!user || !hashedPassword || !email) {
            return new Response(JSON.stringify({ message: 'Faltan campos obligatorios' }), { status: 400 });
        }

        await userModel.insertUser(user, hashedPassword, email);

        return new Response(null, {
            status: 302, // O 301 para redirección permanente
            headers: {
                Location: "/login",
            },
        });
        return new Response(JSON.stringify({ message: 'Usuario creado con éxito' }), { status: 201 });

    } catch (error) {
        console.error("Error al manejar la solicitud de registro:", error);
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

async function handleLogin(req: Request): Promise<Response> {
    try {
        const body = await req.formData();
        const name = body.get("user") as string;
        const pass = body.get("password") as string;

        // (Respuesta de error, está bien)
        if (!name || !pass) {
            return new Response(JSON.stringify({ message: 'Faltan campos obligatorios' }), { status: 400 });
        }

        const user = await userModel.getUser(name);

        // (Verificación de usuario, está bien)
        if (!user) {
            return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), { status: 401 });
        }

        // (Verificación de contraseña, está bien)
        const hashedPassword = user.password;
        const verify = await Bun.password.verify(pass, hashedPassword);

        if (!verify) {
            return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), { status: 401 });
        }

         // Encrypt the user ID for the cookie
         const encryptedUserId = await encrypt(user.id_user.toString());
         const userCookie = `id_user=${encryptedUserId}; Path=/; HttpOnly`;

         // Prepara los headers para la respuesta
         const headers = new Headers();
         headers.set('Location', "/"); // A dónde redirigir
         headers.append('Set-Cookie', userCookie); // Añade la PRIMERA cookie

         // Envía la redirección (302) CON todas las cookies
         return new Response(null, {
             status: 302,
             headers: headers, // Usa el objeto headers que preparamos
         });

     } catch (error) {
         console.error("Error al manejar la solicitud de inicio de sesión:", error);
         return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
     }
}

async function getUserId(req: Request): Promise<Response> {
    const id_user = await getUserCookie(req);
    let id_artist: number | null = null;

    const artistResult = await isArtist(req);
    if (!(artistResult instanceof Response)) {
        id_artist = artistResult.id_artist;
    }

    return Response.json({ 
        id_user: id_user ? id_user.toString() : null, 
        id_artist: id_artist ? id_artist.toString() : null 
    });
}

// GET /get/songs/:id
async function handleGetSongById(req: Request, id: number): Promise<Response> {
    const response = await handleGetById(() => userModel.safeGetUserByID(id), 'usuario');
    return response;
}

async function processUserForm(req: Request): Promise<[string, string]> {
    const body = await req.formData();
    const name = body.get("name") as string;
    const email = body.get("email") as string;

    if (!name || !email) {
        throw new Error('Faltan campos obligatorios: nombre y email.');
    }

    return [name, email];
}

// DELETE /users/:id
async function handleDeleteUser(req: Request, id: number): Promise<Response> {
    return handleDeleteById(userModel.deleteUser, id, 'usuario');
}

// PUT /users/:id
async function handleUpdateUser(req: Request, id: number): Promise<Response> {
    return handleUpdate(req, id, processUserForm, userModel.safeUpdateUser, 'usuario');
}
