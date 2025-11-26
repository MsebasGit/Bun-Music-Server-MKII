/**
 * Ejecuta una consulta a la base de datos y maneja los errores de forma centralizada.
 * @param queryFunction La función que ejecuta la consulta y devuelve los datos.
 * @param errorMessage El mensaje de error a registrar si la consulta falla.
 * @returns Una promesa que se resuelve con el resultado de la consulta.
 */
export async function executeDbQuery<T>(
    queryFunction: () => T,
    errorMessage: string
): Promise<T> {
    try {
        return queryFunction();
    } catch (error) {
        console.error(errorMessage, error);
        throw new Error(`Error en la base de datos: ${errorMessage}`);
    }
}
