
import * as Bun from 'bun';

// Ruta al archivo de la barra lateral
const SIDEBAR_PATH = './static/sidebar.html';

/**
 * Lee el contenido de un archivo HTML y lo combina con una barra lateral (sidebar).
 * La función extrae el CSS y el cuerpo (body) de la barra lateral y los inyecta
 * en el archivo HTML de contenido principal.
 *
 * @param contentFilePath La ruta al archivo HTML que se usará como contenido principal.
 * @returns Un objeto Response con el HTML combinado.
 */
export async function serveHtmlWithSidebar(contentFilePath: string): Promise<Response> {
    try {
        // 1. Leer el contenido de la barra lateral y del archivo principal en paralelo
        const [sidebarContent, mainContent] = await Promise.all([
            Bun.file(SIDEBAR_PATH).text(),
            Bun.file(contentFilePath).text()
        ]);

        // 2. Extraer las partes relevantes de la barra lateral usando expresiones regulares
        // Extraer el contenido de la etiqueta <body>
        const bodyMatch = sidebarContent.match(/<body>([\s\S]*?)<\/body>/);
        const sidebarBody = bodyMatch ? bodyMatch[1] : '';

        // 3. Inyectar la barra lateral en el contenido principal
        // Asegurarse de que el contenido principal tenga un enlace a /style.css
        let combinedHtml = mainContent;
        if (!combinedHtml.includes('<link rel="stylesheet" href="/style.css">')) {
            combinedHtml = combinedHtml.replace('</head>', '<link rel="stylesheet" href="/style.css"></head>');
        }

        // Inyectar el HTML de la barra lateral justo después de abrir el <body>
        // Usamos una función en replace para manejar casos donde no hay atributos en body
        combinedHtml = combinedHtml.replace(/<body(.*?)>/, `<body$1>${sidebarBody}`);

        // 4. Devolver la respuesta HTML combinada
        return new Response(combinedHtml, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });

    } catch (error) {
        console.error(`Error serving HTML with sidebar: ${error}`);
        // Si algo falla (ej. archivo no encontrado), devolver un error 404
        return new Response('Not Found', { status: 404 });
    }
}
// Hola