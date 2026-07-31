# Prueba Técnica KS2 - Gestión de Inmuebles (Fullstack)

Este repositorio contiene la solución a la prueba técnica para el sistema de Gestión de Inmuebles. 
El proyecto está dividido en dos partes principales: el **Backend** (API RESTful en NestJS) y el **Frontend** (Aplicación web en React).

## 🚀 Requisitos Previos

- **Node.js** (v18 o superior)
- **PostgreSQL** (Base de datos relacional)
- **npm** instalado

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
npm install
```

**Variables de Entorno (Backend)**
Crea un archivo `.env` en la carpeta `backend` basado en el `.env.example`. Asegúrate de definir las siguientes variables:
```env
# URL de conexión a tu base de datos PostgreSQL local
DATABASE_URL="postgresql://usuario:password@localhost:5432/gestion_inmuebles?schema=public"

# Puerto donde correrá el backend
PORT=3000

# Secreto para firmar los JWT (Cámbialo por una cadena segura)
JWT_SECRET="super-secret-jwt-key"

# URL del Frontend (para configurar CORS correctamente)
FRONTEND_URL="http://localhost:5173"
```

**Base de datos (Migraciones y Semillas)**
Asegúrate de que tu servidor PostgreSQL esté corriendo. Luego ejecuta:
```bash
npx prisma migrate dev --name init
npm run build
npm run seed
```
*Nota: El script `npm run seed` insertará automáticamente los 4 tipos de inmuebles, 3 usuarios de prueba y 15 inmuebles distribuidos en varios estados (DISPONIBLE, RESERVADO, VENDIDO), tal como lo exige la prueba.*

**Arrancar servidor Backend**
```bash
npm run start:dev
```

### 3. Configurar y arrancar el Frontend

Abre una nueva terminal en la raíz del proyecto.
```bash
cd frontend
npm install
```

**Variables de Entorno (Frontend)**
Crea un archivo `.env` en la carpeta `frontend`:
```env
VITE_API_URL="http://localhost:3000"
```

**Arrancar servidor Frontend**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔑 Credenciales de Prueba

La semilla de la base de datos ha creado 3 usuarios que puedes utilizar para probar los permisos de edición (IDOR) y los filtros. **La contraseña para todos es `TestPassword123!`**.

1. **Vendedor 1:** `carlos@test.com` (Contraseña: `TestPassword123!`)
2. **Vendedor 2:** `maria@test.com` (Contraseña: `TestPassword123!`)
3. **Vendedor 3:** `jose@test.com` (Contraseña: `TestPassword123!`)


