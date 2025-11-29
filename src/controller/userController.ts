import * as userModel from '../model/userModel';
import * as artistModel from '../model/artistModel';
import { Elysia } from 'elysia';
import { getUserDataFromCookie } from '../utilities/getCookie';
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

        return new Response(JSON.stringify({ message: 'Usuario creado con éxito' }), { status: 201 });

    } catch (error) {
        console.error("Error al manejar la solicitud de registro:", error);
        return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
}

async function handleLogin(req: Request): Promise<Response> {
    try {
        const body = await req.json(); // Changed from formData() to json()
        const name = body.user as string; // Access 'user' property from JSON
        const pass = body.password as string; // Access 'password' property from JSON

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

        const artist = await artistModel.getArtistByUserId(user.id_user);
        const id_artist = artist ? artist.id_artist : null;

        // Now, create a payload to encrypt
        const cookiePayload = {
            id_user: user.id_user,
            id_artist: id_artist
        };

        const encryptedPayload = await encrypt(JSON.stringify(cookiePayload));
        const userCookie = `user_data=${encryptedPayload}; Path=/; HttpOnly`;

         // Prepara los headers para la respuesta
         const headers = new Headers();
         headers.append('Set-Cookie', userCookie);

         // Envía la redirección (302) CON todas las cookies
         return new Response(JSON.stringify({ message: 'Inicio de sesión exitoso' }), {
             status: 200,
             headers: headers,
         });

     } catch (error) {
         console.error("Error al manejar la solicitud de inicio de sesión:", error);
         return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
     }
}

async function getUserId(req: Request): Promise<Response> {
    const userData = await getUserDataFromCookie(req);

    return Response.json({ 
        id_user: userData ? userData.id_user.toString() : null, 
        id_artist: userData && userData.id_artist ? userData.id_artist.toString() : null 
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
