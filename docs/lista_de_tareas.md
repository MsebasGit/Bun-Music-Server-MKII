📋 Hoja de Ruta: Simulador de Incendios Forestales para IO
Este documento organiza el desarrollo del simulador en fases incrementales. Marca las casillas a medida que avances.

🏁 Fase 1: **El Motor Lógico (Backend Matemático en Haskell)**
- **Definir Estructuras de Datos**
  - Crear constantes para los estados de celda (**TIERRA, ARBOL, FUEGO, CENIZA**).
  - Definir la estructura del objeto **Configuracion** (densidad, viento, riesgo).
- **Implementar Lógica de Inicialización**
  - Crear función **generarGrilla**(ancho, alto, densidad, riesgo) que devuelva una matriz $N \times N$.
  - Implementar la lógica de distribución de tipos de vegetación basada en el "**Nivel de Riesgo**".
- **Implementar Reglas de Transición (El Autómata)**
  - Crear función **obtenerVecinos**(x, y) (Manejar bordes correctamente).
  - Crear función **calcularProbabilidadIgnicion**(celda, vecinos, viento).
  - Implementar el ciclo principal **siguienteGeneracion**(grillaActual) -> nuevaGrilla.
- **Prueba Unitaria Simple**
  - Ejecutar una simulación de 10 pasos en consola y verificar que el fuego se expande y luego se apaga.

🎨 Fase 2: **Interfaz de Usuario (Frontend)**
Implementar el diseño visual (Mockup) y conectarlo con la lógica.
- **Estructura del Proyecto**
  - Configurar **Elm**.
  - Instalar **lucide-react** para los iconos.
- **Componentes Base**
  - Crear componente **<MapView />** (La grilla visual).
  - Crear componente **<Sidebar />** con las pestañas de Configuración y Resultados.
  - Crear componente **<PlaybackControls />** (Slider de tiempo y botones).
- **Estado Global (React Context o State)**
  - Conectar los sliders de la **Sidebar** (Densidad, Riesgo) al estado de la aplicación.
  - Asegurar que al cambiar un slider, la grilla se regenere visualmente (preview).

🚀 Fase 3: **Integración y Montecarlo**
Donde la magia de Investigación Operativa ocurre. Separar la lógica pesada de la visual.
- **Motor de Simulación (Web Worker)**
  - Mover la lógica de la Fase 1 a un archivo separado (**Web Worker**) para no congelar la UI.
  - Crear la función **ejecutarMonteCarlo**(config, n_simulaciones) que corra el bucle rápido.
- **Gestión de Semillas (Seeds)**
  - Implementar un **Generador de Números Pseudo-Aleatorios (PRNG)** que acepte una "**semilla**" (seed).
  - Asegurar que **generarGrilla(seed)** siempre produzca el mismo mapa exacto.
- **Conexión UI - Worker**
  - Hacer que el botón "**INICIAR MONTECARLO**" dispare el worker.
  - Mostrar barra de progreso o estado "**Calculando...**".
  - Recibir la lista de resultados y mostrarla en la **Sidebar**.

📼 Fase 4: **Funcionalidad de "Replay" (Time Travel)**
La característica premium para análisis.
- **Sistema de Grabación**
  - Crear un array `historial` en el estado principal.
  - Al dar "**Play**" en modo visual, guardar cada nueva generación en `historial`.
- **Lógica de Reproducción**
  - Conectar el **Slider de Tiempo (Timeline)** al índice del array `historial`.
  - Implementar botones "**Paso Atrás**" y "**Paso Adelante**".
- **Carga de Escenarios Pasados**
  - Al hacer clic en un resultado de la lista, reiniciar el motor usando la **seed** de ese resultado específico.

💾 Fase 5: **Almacenamiento y Gestión de Simulaciones (CRUD)**
Funcionalidad para guardar, cargar y eliminar escenarios.
- **Backend (API Endpoints)**
  - `POST /api/simulations`: **Guardar** una nueva configuración de simulación.
  - `GET /api/simulations`: Obtener la lista de simulaciones guardadas (**metadata**).
  - `GET /api/simulations/:id`: Obtener la configuración completa de una simulación específica.
  - `DELETE /api/simulations/:id`: **Eliminar** una simulación guardada.
- **Frontend (Integración con la UI)**
  - Implementar la lógica del botón "**Guardar Simulación**" para enviar la configuración al backend.
  - Crear una nueva vista/página para mostrar las "**Simulaciones Almacenadas**".
  - En esa vista, obtener y mostrar las simulaciones como tarjetas interactivas.
  - Implementar el botón "**Abrir**" en cada tarjeta para cargar un escenario guardado en la vista principal.
  - Implementar el botón "**Eliminar**" en cada tarjeta para borrar una simulación y actualizar la lista.

🌟 Fase 6: **Extras y Pulido (Opcional)**
- **Herramienta de Edición Manual**: Permitir hacer clic en una celda para cambiarla a FUEGO o CORTAFUEGOS.
- **Gráficos**: Añadir un pequeño gráfico de línea que muestre la curva de "Celdas Quemadas vs Tiempo".
- **Exportar Datos**: Botón para descargar los resultados de Montecarlo como CSV.
