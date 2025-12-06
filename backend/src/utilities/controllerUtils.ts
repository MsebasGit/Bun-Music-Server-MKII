// src/utilities/controllerUtils.ts

/**
 * Función de alto nivel para manejar peticiones de forma genérica y flexible.
 * @param serviceFn La función del servicio a ejecutar.
 * @param context El contexto de Elysia { body, set, jwt, etc. }.
 * @param successStatus El código de estado HTTP para una respuesta exitosa por defecto.
 * @param onSuccess (Opcional) Una función callback para manejar la respuesta en caso de éxito.
 */
export async function handleRequest<T, C extends { body: any; set: any }>(
  serviceFn: (data: any) => Promise<T>,
  context: C,
  successStatus: number = 200,
  onSuccess?: (result: T, context: C) => Promise<any> | any
) {
  const { body, set } = context;

  try {
    const result = await serviceFn(body);

    if (onSuccess) {
      // Si se provee un manejador de éxito, se delega la respuesta a él.
      return await onSuccess(result, context);
    }

    // Respuesta de éxito por defecto.
    set.status = successStatus;
    return {
      message: "Operation successful",
      data: result,
    };
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      set.status = 409; // Conflict
    } else if (error.message.includes("Invalid credentials")) {
      set.status = 401; // Unauthorized
    } else {
      set.status = 500; // Internal Server Error
    }

    return {
      message: "Operation failed",
      error: error.message,
    };
  }
}