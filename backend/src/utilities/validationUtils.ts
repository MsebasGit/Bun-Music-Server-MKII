// src/utilities/validationUtils.ts

/**
 * Verifica el resultado de una operación de base de datos y lanza un error si está vacío.
 * @param result - El array de resultados de Drizzle.
 * @param entityName - El nombre de la entidad para los mensajes de error (ej. "Usuario").
 * @param operation - La operación que se realizó (ej. "crear", "actualizar", "eliminar").
 * @returns El primer elemento del array si no está vacío.
 */
export function handleDrizzleResult<T>(
    result: T[], 
    entityName: string,
    operation: 'crear' | 'obtener' | 'actualizar' | 'eliminar'
): T {
    if (result.length === 0) {
        throw new Error(`Error al ${operation} o ${entityName.toLowerCase()} no encontrado.`);
    }
    return result[0];
}

/**
 * Verifica el resultado de una operación de eliminación y devuelve un mensaje de éxito.
 * @param result - El array de resultados de Drizzle de una operación de eliminación.
 * @param entityName - El nombre de la entidad para los mensajes de error.
 * @returns Un objeto con un mensaje de éxito.
 */
export function handleDeleteResult(
    result: any[],
    entityName: string
): { message: string } {
    if (result.length === 0) {
        throw new Error(`Error al eliminar o ${entityName.toLowerCase()} no encontrado.`);
    }
    return { message: `${entityName} eliminado correctamente.` };
}
