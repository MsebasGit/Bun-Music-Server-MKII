🧩 Lista de Componentes
Este documento detalla los componentes visuales de la interfaz de usuario.

---

### 🖥️ Vista Principal

- **Sidebar de Configuración y Resultados**
  - Pestaña de **Configuración**: Contiene todos los sliders y controles para definir el escenario de la simulación.
    - Sliders para las leyes del escenario (densidad, riesgo, etc.).
    - Controles para el pincel de interacción (tamaño, tipo).
    - Slider para la cantidad de simulaciones (ejecuciones de Montecarlo).
  - Pestaña de **Resultados**: Muestra las métricas una vez que la simulación ha finalizado.
    - Indicador de "daño promedio".
    - Indicadores de "mejor" y "peor caso".
    - Indicador de "desviación estándar".
    - Lista de resultados por cada ejecución individual.
  - **Botones de Acción Principales**
    - Botón para **iniciar la simulación** de Montecarlo.

- **Panel de Simulación Visual**
  - **Grilla de Simulación**
    - Matriz visual de N x N donde interactúan los autómatas.
  - **Barra de Controles de Reproducción (Time Travel)**
    - Botón de reproducción automática para una ejecución.
    - Botones de navegación para avanzar/retroceder entre generaciones.
    - Botón para expandir la grilla a pantalla completa.

- **Gestión de Simulaciones**
  - Botón para **Guardar** la configuración actual como un nuevo escenario.
  - Botón para navegar a la **vista de simulaciones almacenadas**.

---

### 📂 Vista de Simulaciones Almacenadas

- **Galería de Tarjetas**
  - Cada tarjeta representa una simulación guardada con su información principal (nombre, fecha, etc.).
- **Acciones por Tarjeta**
  - Botón para **Abrir** una simulación (carga el escenario en la Vista Principal).
  - Botón para **Eliminar** una simulación de forma permanente.