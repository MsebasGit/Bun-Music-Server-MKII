/**
 * Maneja la obtención de una lista de entidades.
 * @param getAllFunction Función que devuelve una promesa con un array de entidades.
 * @param entityName Nombre de la entidad (para logging y mensajes de error).
 * @returns Un objeto Response.
 */
export async function handleGetAll(
    getAllFunction: () => Promise<any[]>,
    entityName: string
): Promise<Response> {
    try {
        const data = await getAllFunction();
        return Response.json(data, { status: 200 });
    } catch (error) {
        console.error(`Error al manejar la solicitud GET de todos los ${entityName}:`, error);
        return Response.json(
            { message: `Error interno del servidor al obtener la lista de ${entityName}.` },
            { status: 500 }
        );
    }
}

/**
 * Maneja la obtención de una entidad por su ID.
 * @param getFunction Una función que, al ser llamada, devuelve una promesa con la entidad.
 * @param entityName Nombre de la entidad (para logging y mensajes de error).
 * @returns Un objeto Response.
 */
export async function handleGetById(
    getFunction: () => Promise<any>,
    entityName: string
): Promise<Response> {
    try {
        const data = await getFunction();
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return Response.json({ message: `${entityName} no encontrado.` }, { status: 404 });
        }
        return Response.json(data, { status: 200 });
    } catch (error) {
        console.error(`Error al obtener ${entityName} por ID:`, error);
        return Response.json(
            { message: `Error interno del servidor al obtener ${entityName}.` },
            { status: 500 }
        );
    }
}

/**
 * Maneja la eliminación de una entidad por su ID.
 * @param deleteFunction Función que elimina la entidad, tomando un ID.
 * @param id El ID de la entidad a eliminar.
 * @param entityName Nombre de la entidad (para logging y mensajes de error).
 * @returns Un objeto Response.
 */
export async function handleDeleteById(
    deleteFunction: (id: number) => Promise<any>,
    id: number,
    entityName: string
): Promise<Response> {
    try {
        await deleteFunction(id);
        // Cambiamos la redirección por una respuesta JSON de éxito.
        return Response.json(
            { message: `${entityName} con ID ${id} eliminado correctamente.` },
            { status: 200 } 
        );
    } catch (error) {
        console.error(`Error al eliminar ${entityName} con ID ${id}:`, error);
        return Response.json(
            { message: `Error interno del servidor al eliminar ${entityName}.` },
            { status: 500 }
        );
    }
}

/**
 * Maneja la inserción de una nueva entidad.
 * @param req El objeto Request de la solicitud.
 * @param processor Función que toma el Request, lo procesa, y devuelve un array con los argumentos para la función de inserción.
 * @param insertFunction La función del modelo que inserta en la base de datos.
 * @param redirectURL La URL a la que redirigir tras una inserción exitosa.
 * @param entityName Nombre de la entidad (para logging y mensajes de error).
 * @returns Un objeto Response.
 */
export async function handleInsert(
    req: Request,
    processor: (req: Request) => Promise<any[]>,
    insertFunction: (...args: any[]) => Promise<any>,
    redirectURL: string,
    entityName: string
): Promise<Response> {
    try {
        const args = await processor(req);
        await insertFunction(...args);

        return new Response(null, {
            status: 302,
            headers: {
                Location: `${redirectURL}`,
            },
        });
    } catch (error: any) {
        if (error.message.includes('Faltan campos') || error.message.includes('inválido')) {
            return Response.json({ message: error.message }, { status: 400 });
        }
        console.error(`Error al insertar ${entityName}:`, error);
        return Response.json(
            { message: `Error interno del servidor al insertar ${entityName}.` },
            { status: 500 }
        );
    }
}

/**
 * Maneja la actualización de una entidad existente.
 * @param req El objeto Request de la solicitud.
 * @param id El ID de la entidad a actualizar.
 * @param processor Función que toma el Request, lo procesa, y devuelve un array con los argumentos para la función de actualización.
 * @param updateFunction La función del modelo que actualiza en la base de datos.
 * @param redirectURL La URL a la que redirigir tras una actualización exitosa.
 * @param entityName Nombre de la entidad (para logging y mensajes de error).
 * @returns Un objeto Response.
 */
export async function handleUpdate(
    req: Request,
    id: number,
    processor: (req: Request) => Promise<any[]>,
    updateFunction: (id: number, ...args: any[]) => Promise<any>,
    entityName: string
): Promise<Response> {
    try {
        const args = await processor(req);
        await updateFunction(id, ...args);

        // Cambiamos la redirección por una respuesta JSON de éxito.
        return Response.json(
            { message: `${entityName} con ID ${id} actualizado correctamente.` },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.message.includes('Faltan campos') || error.message.includes('inválido')) {
            return Response.json({ message: error.message }, { status: 400 });
        }
        console.error(`Error al actualizar ${entityName} con ID ${id}:`, error);
        return Response.json(
            { message: `Error interno del servidor al actualizar ${entityName}.` },
            { status: 500 }
        );
    }
}

/**
 * Obtiene la duración de un archivo de audio usando ffprobe.
 * @param filePath La ruta al archivo de audio.
 * @returns La duración del audio en segundos.
 * @throws Error si ffprobe falla o no puede parsear la duración.
 */
export async function getAudioDuration(filePath: string): Promise<number> {
    const command = [
        'ffprobe',
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        filePath
    ];

    const proc = Bun.spawn(command);
    const output = await new Response(proc.stdout).text();
    const duration = parseFloat(output);

    if (isNaN(duration)) {
        throw new Error(`No se pudo obtener la duración del audio de ${filePath}. Salida de ffprobe: ${output}`);
    }

    return duration;
}

/**
 * Genera un nombre de archivo seguro para evitar errores del sistema de archivos.
 * Crea un "slug", lo trunca y le antepone una marca de tiempo.
 * @param originalName El nombre del archivo original.
 * @param maxLength La longitud máxima del nombre de archivo generado.
 * @returns Un nombre de archivo seguro.
 */
export function generateSafeFilename(originalName: string, maxLength: number = 200): string {
    const extensionMatch = originalName.match(/\.([^.]+)$/);
    const extension = extensionMatch ? extensionMatch[1] : '';
    const baseName = extensionMatch ? originalName.substring(0, extensionMatch.index) : originalName;

    // Slugify simple y truncado.
    const sanitized = baseName
        .toLowerCase()
        .replace(/\s+/g, '-') // Reemplaza espacios con -
        .replace(/[^\w-]+/g, '') // Elimina todos los caracteres que no son de palabra
        .replace(/--+/g, '-') // Reemplaza múltiples - con uno solo
        .replace(/^-+/, '') // Elimina - del inicio
        .replace(/-+$/, ''); // Elimina - del final

    const timestamp = Date.now();
    const ext = extension ? `.${extension}` : '';

    // maxLength - timestamp - guion - extensión
    const maxBaseLength = maxLength - String(timestamp).length - 1 - ext.length;
    
    // Asegurarse de que maxBaseLength no sea negativo
    const safeMaxBaseLength = maxBaseLength > 0 ? maxBaseLength : 0;
    const truncatedBaseName = sanitized.substring(0, safeMaxBaseLength);

    return `${timestamp}-${truncatedBaseName}${ext}`;
}
