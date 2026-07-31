# 🎨 Frontend - Gestión de Inmuebles

Esta es la aplicación Web Single Page Application (SPA) para el sistema de Gestión de Inmuebles. Está construida con las herramientas y patrones más modernos del ecosistema frontend actual para ofrecer una experiencia ultrarrápida, escalable, accesible y visualmente impactante.

## 🚀 Tecnologías y Arquitectura

- **Core:** React 19 + TypeScript.
- **Build Tool:** Vite (compilación y Hot Module Replacement increíblemente rápidos).
- **Enrutamiento:** React Router DOM v7.
- **Estilos y Componentes:** 
  - **TailwindCSS** para estilos utilitarios rápidos.
  - **Shadcn UI & Radix UI** para componentes accesibles, headless y altamente personalizables.
- **Iconografía:** Lucide React (iconos SVG optimizados y modernos).
- **Gestión de Formularios y Validación:** `react-hook-form` combinado con `Zod` para validación estricta de esquemas y tipos inferidos directamente desde los formularios.
- **State Management & Fetching:** `SWR` (Stale-While-Revalidate) para obtención de datos, caché inteligente, revalidación en foco y manejo de errores.

## ✨ Características Destacadas (UX / UI / A11y)

1. **Diseño "Premium" (Glassmorphism):**
   La interfaz abandona el típico diseño corporativo monótono. Se implementó una estética moderna que hace uso de *Glassmorphism* (fondos translúcidos y desenfoques), sombras suaves, micro-interacciones (hover effects), y una paleta de colores vibrante pero profesional.
   
2. **Accesibilidad Perfecta (Puntaje 100/100 en Lighthouse):**
   Se han seguido estándares de la WCAG para garantizar que la aplicación sea utilizable por todos:
   - Uso correcto de *Landmarks* semánticos (etiqueta `<main>`).
   - Todos los botones que solo contienen iconos tienen sus respectivas etiquetas `aria-label`.
   - Jerarquía de encabezados perfecta (`h1` -> `h2` -> `h3`) sin saltos de nivel.
   - Contraste de colores testeado y ajustado para asegurar total legibilidad.

3. **Arquitectura Orientada a Componentes:**
   Los componentes base de UI están centralizados en `src/components/ui/` (Botones, Inputs, Diálogos, etc.) asegurando una sola fuente de verdad para el sistema de diseño.

---

## 🛠️ Instalación y Despliegue Local

### 1. Dependencias
Es recomendable usar `pnpm` para evitar conflictos en el lockfile. Desde la carpeta `frontend`, ejecuta:
```bash
pnpm install
```

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz de la carpeta `frontend`. Solo necesitas apuntar a tu backend local:
```env
VITE_API_URL="http://localhost:3000"
```

### 3. Ejecución en Desarrollo
Inicia el servidor de desarrollo ultrarrápido de Vite:
```bash
npm run dev
```
O si prefieres:
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📂 Estructura del Proyecto

- `src/components/`:
  - `/ui`: Componentes puros de sistema de diseño (botones, diálogos, selectores) generados e integrados vía Shadcn UI.
  - `/layout`: Componentes estructurales de la página (como el `Header` premium con animaciones).
  - `/inmuebles` y `/usuarios`: Componentes específicos de cada dominio (Tarjetas de inmueble, Formularios).
- `src/pages/`: Vistas completas de la aplicación (Login, Register, Catálogo, Dashboard).
- `src/hooks/`: Custom hooks genéricos. Destaca `useAuth` para centralizar la lógica de sesión.
- `src/types/`: Interfaces de TypeScript para mantener sincronía perfecta con los DTOs del Backend.
- `src/lib/`: Utilidades genéricas (ej. combinador de clases `cn` para Tailwind).

---

## 🧪 Pruebas Unitarias Automatizadas

El frontend cuenta con un entorno de pruebas moderno y robusto basado en **Vitest** y **React Testing Library** utilizando **JSDOM**.

Se han escrito pruebas automatizadas para asegurar el correcto renderizado y comportamiento de componentes clave (ej. que el `Header` cambie según el estado de autenticación, o que la tarjeta de usuario formatee los datos correctamente).

Para correr el linter de código (Oxlint) y asegurar que no hay errores de sintaxis:
```bash
npm run lint
```

Para ejecutar los tests unitarios:
```bash
npm run test
```
