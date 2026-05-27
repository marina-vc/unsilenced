# Base del Proyecto Final — Máster en Programación para Creativos

Este repositorio es una plantilla mínima para iniciar el Proyecto Final del Máster en Programación para Creativos. Proporciona una estructura clara de archivos, una hoja de estilos modularizada y un punto de entrada de JavaScript.

## Estructura de carpetas

```
MPC Base/
├─ index.html               # Documento HTML principal
├─ css/
│  ├─ style.css             # Entrada de estilos (importa el resto)
│  ├─ reset.css             # Reset de estilos y bases de accesibilidad
│  ├─ typography.css        # Jerarquía tipográfica y fuentes
│  ├─ variables.css         # Variables de color, espaciados, etc.
│  └─ global.css            # Patrones globales (botones, formularios, grid)
├─ js/
│  └─ main.js               # Entrada de JavaScript
├─ img/                     # Imágenes y recursos gráficos
└─ fonts/                   # Fuentes tipográficas
```

## HTML
- **Archivo principal**: `index.html`.
- **Estilos**: enlaza `css/style.css` como hoja de estilos principal.
- **Scripts**: incluye `js/main.js` como script principal.
- **Contenido**: el `<body>` está listo para que añadas tu estructura.

## CSS (arquitectura)
- `css/style.css` actúa como orquestador e importa el resto de módulos mediante `@import`:
  - `reset.css`: normaliza y mejora la base de estilos (box-sizing, márgenes, listas, multimedia responsive, accesibilidad básica, etc.).
  - `typography.css`: define la jerarquía tipográfica, tamaños, pesos y familias. Aquí puedes declarar `@font-face` si añades fuentes en `fonts/`.
  - `variables.css`: centraliza tokens de diseño (colores, espaciados, sombras...).
  - `global.css`: componentes y patrones reutilizables (botones, formularios, estructura...).
- Recomendación: añade nuevos módulos específicos de páginas o componentes y solo impórtalos desde `style.css` para mantener un único punto de entrada.

## JavaScript
- `js/main.js` escucha `DOMContentLoaded` y confirma la carga en consola.
- Amplía este archivo con tu lógica (componentes, utilidades, peticiones, etc.).

## Cómo empezar
- Usa la extensión “Live Server” en tu editor (por ejemplo, VS Code):
  1. Instálala desde el marketplace de extensiones.
  2. Abre este proyecto en tu editor.
  3. Haz clic en “Open with Live Server” sobre `index.html` o en la barra de estado.
  4. Live Server abrirá el proyecto en tu navegador y recargará al guardar cambios.

## Añadir librerías externas (p5.js, GSAP, etc.)
Puedes incluir librerías de dos formas, sin configurar herramientas adicionales:

### Opción A: CDN (recomendada para empezar)
Añade las etiquetas `<script>` en `index.html` antes de tu `main.js`:

```html
<!-- p5.js -->
<script src="https://cdn.jsdelivr.net/npm/p5@1.10.0/lib/p5.min.js"></script>
<!-- GSAP -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<!-- Tu script principal siempre al final -->
<script src="js/main.js" defer></script>
```

### Opción B: Archivos locales
1. Descarga los archivos de las librerías (por ejemplo, `p5.min.js`, `gsap.min.js`).
2. Guárdalos en `js/libs/` (crea la carpeta si es necesario).
3. Enlázalos en `index.html` asegurando el orden: primero las librerías, luego tu `main.js`.

```html
<script src="js/libs/p5.min.js"></script>
<script src="js/libs/gsap.min.js"></script>
<script src="js/main.js" defer></script>
```

Consejos:
- Mantén el orden de carga: dependencias primero, tu código después.
- Usa `defer` en tu script principal para que el DOM esté listo.
- Revisa la documentación oficial de cada librería para extensiones/plugins.

## Buenas prácticas sugeridas
- Define la paleta y espaciados en `variables.css` antes de maquetar.
- Mantén tipografías y tamaños en `typography.css` para consistencia.
- Crea utilidades y patrones en `global.css` y reutilízalos.
- Evita modificar `reset.css` salvo por necesidades claras del proyecto.
- Agrupa nuevas piezas de UI en CSS/JS modulares y documenta su uso.

## Despliegue
- Al ser un proyecto estático, puedes publicarlo en GitHub Pages, Netlify o Vercel sin configuración adicional (apunta la raíz al directorio del proyecto).

## Licencia
Esta plantilla la podéis usar para el PFM o cualquier otro proyecto vuestro personal o profesional.

