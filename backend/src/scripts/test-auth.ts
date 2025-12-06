// src/scripts/test-auth.ts
import "dotenv/config"; // Cargar variables de entorno para la BD
import { registerService, loginService } from "../services/auth.service";

async function main() {
  try {
    const userEmail = `test_${Date.now()}@drizzle.com`;
    
    console.log("Registrando nuevo usuario...");
    const newUser = await registerService({ 
        email: userEmail, 
        password: "supersecretpass", 
        name: "Usuario De Prueba" 
    });
    console.log("✅ Registro exitoso:", newUser);

    console.log("\nIniciando sesión...");
    const loggedInUser = await loginService({ 
        email: userEmail, 
        password: "supersecretpass" 
    });
    console.log("✅ Login exitoso:", loggedInUser);

  } catch (e: any) {
    console.error("❌ Error en el script de prueba:", e.message);
  }
}

main();
