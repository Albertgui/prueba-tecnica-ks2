# 🏢 Prueba Técnica KS2 - Gestión de Inmuebles (Fullstack)

¡Bienvenido al repositorio de la prueba técnica para el sistema de Gestión de Inmuebles! Este proyecto es una solución **Fullstack** robusta, segura y con un diseño moderno, pensada para administrar propiedades inmobiliarias.

Está dividido en dos partes principales:
1. **Backend**: API RESTful construida con **NestJS**, Prisma ORM y PostgreSQL.
2. **Frontend**: Aplicación Web Single Page Application (SPA) construida con **React**, **Vite**, **TailwindCSS** y **Shadcn UI**.

---

## ✨ Características Principales

### 🎨 Frontend (Interfaz de Usuario)
- **Diseño Premium:** Estética moderna utilizando *Glassmorphism*, diseño responsivo (Mobile First), y animaciones fluidas que proporcionan una experiencia de usuario superior (WOW factor).
- **Accesibilidad (A11y):** Optimizado para alcanzar un puntaje perfecto de **100/100 en Google Lighthouse** (contraste de colores, etiquetas ARIA, jerarquía de encabezados y landmarks semánticos).
- **Gestión de Estado y Fetching:** Uso de `SWR` para un fetching de datos optimizado, caché y revalidación en tiempo real.
- **Componentes:** Construido con componentes modulares basados en *Shadcn UI* y *Radix UI* para máxima accesibilidad y personalización.
- **Testing:** Entorno de pruebas automatizadas configurado con **Vitest**, **React Testing Library** y **jsdom**.

### 🛡️ Backend (Lógica y API)
- **Seguridad en Capas:**
  - **Autenticación y Autorización:** Implementado con **JWT** y `Passport`. Las contraseñas se almacenan de forma segura utilizando `bcrypt`.
  - **Anti-IDOR:** Controles estrictos a nivel de servicio para asegurar que un usuario solo pueda editar o eliminar sus propios inmuebles.
  - **Defensas de Red:** Uso de **Helmet** para cabeceras HTTP seguras, configuración restrictiva de **CORS** y **Rate Limiting** (Throttler) para prevenir ataques DDoS o de fuerza bruta.
  - **Validación Estricta:** Uso de `ValidationPipe` (con whitelist) para evitar ataques de *Mass Assignment*.
- **Base de Datos:** **PostgreSQL** orquestado a través del ORM **Prisma**.
- **Linting & Calidad:** Configuración estricta de ESLint y TypeScript sin vulnerabilidades (`pnpm audit` en verde).

---

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:
- **Node.js** (v18 o superior)
- **pnpm** (Gestor de paquetes recomendado para este proyecto)
- **PostgreSQL** (Servidor de base de datos relacional corriendo)
- **Git**

---

## 🛠️ Cómo Iniciar el Proyecto desde Cero

### 1. Clonar el repositorio
```bash
git clone https://github.com/Albertgui/prueba-tecnica-ks2.git
cd prueba-tecnica-ks2
```

### 2. Configurar y arrancar el Backend

```bash
cd backend
pnpm install
```

**Variables de Entorno (Backend)**
Crea un archivo `.env` en la carpeta `backend` basado en el `.env.example`. Asegúrate de definir las siguientes variables:
```env
# URL de conexión a tu base de datos PostgreSQL local
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/gestion_inmuebles?schema=public"

# Puerto donde correrá el backend
PORT=3000

# Secreto para firmar los JWT (Cámbialo por una cadena muy segura y compleja)
JWT_SECRET="super-secret-jwt-key"

# URL del Frontend (Crucial para que los CORS permitan la comunicación)
FRONTEND_URL="http://localhost:5173"
```

**Base de datos (Migraciones y Semillas)**
Asegúrate de que tu servidor PostgreSQL esté corriendo. Luego ejecuta los siguientes comandos para generar la base de datos y poblarla de información inicial:
```bash
npx prisma migrate dev --name init
npm run build
npm run seed
```
> **Nota:** El comando `npm run seed` insertará automáticamente los 4 tipos de inmuebles requeridos, **5 usuarios de prueba** y **15 inmuebles** distribuidos en varios estados (DISPONIBLE, RESERVADO, VENDIDO), tal como lo exige la prueba.

**Arrancar servidor Backend**
```bash
npm run start:dev
```
*El backend quedará escuchando en `http://localhost:3000`.*

---

### 3. Configurar y arrancar el Frontend

Abre una **nueva terminal** en la raíz del proyecto.
```bash
cd frontend
pnpm install
```

**Variables de Entorno (Frontend)**
Crea un archivo `.env` en la carpeta `frontend`:
```env
# URL base para realizar las peticiones a la API del backend
VITE_API_URL="http://localhost:3000"
```

**Arrancar servidor Frontend**
```bash
npm run dev
```
*La aplicación web estará disponible y visible en `http://localhost:5173`.*

---

## 🔑 Credenciales de Prueba

La semilla (`seed`) de la base de datos ha creado 5 usuarios que puedes utilizar para probar los permisos de edición (verificación Anti-IDOR), inicio de sesión y filtros. 

**La contraseña para TODOS los usuarios es:** `TestPassword123!`

Aquí tienes 2 cuentas principales que puedes usar inmediatamente:

1. **Vendedor 1 (Alejandro Mendoza)** 
   - Email: `alejandro@test.com`
   - Contraseña: `TestPassword123!`
   
2. **Vendedor 2 (Sofía Ramírez)** 
   - Email: `sofia@test.com`
   - Contraseña: `TestPassword123!`

*(También existen `diego@test.com`, `carmen@test.com` y `lucas@test.com` con la misma contraseña).*

---

## 🧪 Pruebas Unitarias

Ambos entornos están configurados con testing automatizado.

- **Frontend (Vitest + React Testing Library):**
  ```bash
  cd frontend
  npm run test
  ```
- **Backend (Jest):**
  ```bash
  cd backend
  npm run test
  ```
