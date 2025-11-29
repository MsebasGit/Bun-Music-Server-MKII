import figlet from 'figlet';
import * as Bun from 'bun';

// --- RUTAS ---
import { userRoutes } from './src/routes/userRoutes';
import { artistRoutes } from './src/routes/artistRoutes';
import { albumRoutes } from './src/routes/albumRoutes';
import { songRoutes } from './src/routes/songRoutes';
import { playlistRoutes } from './src/routes/playlistRoutes';
import { playlistSongRoutes } from './src/routes/playlistSongRoutes';
import { socialNetworkRoutes } from './src/routes/socialNetworkRoutes';
import { songArtistRoutes } from './src/routes/songArtistRoutes';
import { userSongRatingRoutes } from './src/routes/userSongRatingRoutes';
import { commentRoutes } from './src/routes/commentRoutes';
import { serveHtmlWithSidebar } from './src/utilities/view';

const FRONTEND_DIST_PATH = './frontend/dist';
const ROOT_STATIC_PATH = './static';

// Helper to convert a route path with params (e.g., /songs/:id) to a regex
function pathToRegex(path: string) {
    const paramNames: string[] = [];
    const regexPath = path.replace(/\/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '/([^/]+)';
    });
    return { regex: new RegExp(`^${regexPath}$`), paramNames };
}

const allRoutes = [
    // Tus rutas importadas (API routes)
    ...userRoutes,
    ...artistRoutes,
    ...albumRoutes,
    ...songRoutes,
    ...playlistRoutes,
    ...playlistSongRoutes,
    ...socialNetworkRoutes,
    ...songArtistRoutes,
    ...userSongRatingRoutes,
    ...commentRoutes,
].map(route => ({
    ...route,
    ...pathToRegex(route.path)
}));

// --- MIDDLEWARE DE AUTENTICACIÓN ---
function authMiddleware(req: Request): Response | null {
    const cookieHeader = req.headers.get("Cookie") || '';
    const hasUserCookie = cookieHeader.split(';').some(c => c.trim().startsWith('id_user='));
    if (hasUserCookie) {
        return null;
    }

    const acceptHeader = req.headers.get('Accept') || '';
    if (acceptHeader.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(null, {
        status: 302,
        headers: {
            'Location': '/users/login.html'
        }
    });
}

// --- CONFIGURACIÓN DE CORS ---
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Permite cualquier origen (para desarrollo).
    // En producción, especifica el dominio de tu frontend.
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// --- HANDLER DE CORS GLOBAL ---
async function handleCors(req: Request, handler: (req: Request) => Promise<Response>): Promise<Response> {
    // 1. Manejar peticiones OPTIONS (pre-vuelo)
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204, // Sin contenido, solo encabezados
            headers: corsHeaders,
        });
    }

    // 2. Ejecutar la lógica de la aplicación
    const response = await handler(req);

    // 3. Agregar los encabezados CORS a la respuesta
    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

// --- SERVIDOR BUN ---
const server = Bun.serve({
    port: 3000,
    async fetch(req: Request) {
        return handleCors(req, async (actualReq) => {
            const url = new URL(actualReq.url);
            const path = url.pathname;
            const method = actualReq.method;

            // 1. Intentar servir API routes
            for (const route of allRoutes) {
                const match = route.regex.exec(path);
                if (match && route.method === method) {
                    const params: { [key: string]: string | number } = {};
                    route.paramNames.forEach((name, index) => {
                        const value = match[index + 1];
                        params[name] = isNaN(Number(value)) ? value : Number(value);
                    });

                    if (route.protected) {
                        const authResponse = authMiddleware(actualReq);
                        if (authResponse) {
                            return authResponse;
                        }
                    }
                    return route.handler(actualReq, ...Object.values(params));
                }
            }

            // 2. Servir archivos estáticos del frontend (Svelte build)
            // Para la ruta raíz, siempre servir el index.html del Svelte build
            if (path === '/' && method === 'GET') {
                const indexFile = Bun.file(`${FRONTEND_DIST_PATH}/index.html`);
                if (await indexFile.exists()) {
                    return new Response(indexFile, { headers: { 'Content-Type': 'text/html' } });
                }
            }

            // Intentar servir cualquier otro archivo desde el directorio de construcción de Svelte
            const frontendDistFilePath = `${FRONTEND_DIST_PATH}${path}`;
            const frontendDistFile = Bun.file(frontendDistFilePath);
            if (await frontendDistFile.exists()) {
                return new Response(frontendDistFile);
            }

            // 3. Servir archivos estáticos del directorio raíz 'static/'
            const rootStaticFilePath = `${ROOT_STATIC_PATH}${path}`;
            const rootStaticFile = Bun.file(rootStaticFilePath);
            if (await rootStaticFile.exists()) {
                if (rootStaticFilePath.endsWith('.html')) {
                    if (rootStaticFilePath.endsWith('login.html') || rootStaticFilePath.endsWith('signup.html')) {
                        return new Response(rootStaticFile);
                    }
                    return serveHtmlWithSidebar(rootStaticFilePath);
                }
                return new Response(rootStaticFile);
            }

            // 4. SPA Fallback: Para cualquier ruta no encontrada que no sea una API,
            // servir el index.html del Svelte build. Esto permite el enrutamiento del lado del cliente.
            // Asumimos que todas las APIs tienen un prefijo distinto o son manejadas por `allRoutes`
            // antes de llegar aquí.
            const indexFile = Bun.file(`${FRONTEND_DIST_PATH}/index.html`);
            if (await indexFile.exists()) {
                return new Response(indexFile, { headers: { 'Content-Type': 'text/html' } });
            }

            // Si no se encuentra nada
            return new Response('Not Found', { status: 404 });
        });
    },
});

console.log(figlet.textSync('MUSIC APP'));
console.log(`Listening on ${server.url}`);
