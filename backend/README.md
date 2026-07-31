# ⚙️ Backend - Gestión de Inmuebles

Esta es la API RESTful para el sistema de Gestión de Inmuebles, construida con **NestJS**, **Prisma ORM** y **PostgreSQL**.

## 🏗️ Arquitectura y Principios Aplicados
Para garantizar un código mantenible, escalable y robusto, este backend implementa **Domain-Driven Design (DDD)** y **Arquitectura Limpia (Clean Architecture)**:

- **Dominio Puro**: Las reglas de negocio, como la Máquina de Estados de los inmuebles (`DISPONIBLE -> RESERVADO -> VENDIDO`), están encapsuladas estrictamente en entidades de dominio puras. No dependen de Prisma ni de NestJS.
- **Capa de Aplicación**: Los *Services* orquestan los casos de uso (crear, actualizar, etc.) sin acoplarse a detalles de persistencia.
- **Capa de Infraestructura**: Contiene los Controladores HTTP, Repositorios (Adaptadores de Prisma), Módulos de NestJS y Configuración de Base de Datos.
- **Seguridad (Defensa en Profundidad)**: 
  - Autenticación segura mediante **JWT** (JSON Web Tokens) y contraseñas hasheadas con `bcrypt`.
  - **Protección IDOR estricta**: Los usuarios solo pueden editar, cambiar de estado o eliminar **sus propios inmuebles**. Devolverá un `404 Not Found` si intentan acceder a un inmueble de otra persona para evitar la *enumeración de objetos*.
  - Las contraseñas y datos sensibles nunca se filtran en las respuestas JSON.
  - Cabeceras de seguridad inyectadas con **Helmet**.
  - Prevención de ataques de fuerza bruta y DDoS usando **Throttler (Rate Limiting)** a nivel global (100 reqs/minuto).
  - Validación de Payload (DTOs) en modo *whitelist* estricto, para evitar inyección de campos no deseados (*Mass Assignment*).

---

## 🚀 Instalación y Despliegue Local

### 1. Dependencias
Sitúate en la carpeta del backend e instala las dependencias usando `pnpm` (recomendado):
```bash
cd backend
pnpm install
```

### 2. Variables de Entorno
Renombra o copia el archivo `.env.example` a `.env` y configura tu conexión:
```env
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/gestion_inmuebles?schema=public"
PORT=3000
JWT_SECRET="un_secreto_muy_seguro_para_firmar_tokens"
FRONTEND_URL="http://localhost:5173"
```

### 3. Base de Datos
Asegúrate de que PostgreSQL está encendido y corre los siguientes comandos:
```bash
# Sincroniza la base de datos (crea tablas)
npx prisma migrate dev --name init

# Genera los tipos de TypeScript para Prisma
npx prisma generate

# Poblar la base de datos con datos de prueba
npm run seed
```
> **Nota de Seed:** Se crearán 4 Tipos de Inmuebles, 5 Usuarios (password: `TestPassword123!`) y 15 Inmuebles reales asociados a ellos.

### 4. Arrancar el Servidor
Para iniciar el servidor en modo desarrollo (con auto-recarga):
```bash
npm run start:dev
```
La API estará escuchando peticiones en `http://localhost:3000`.

---

## 📖 Documentación de Endpoints (API)

A continuación, la referencia de los endpoints principales. 
> 🔒 **Todas las rutas (excepto las de Auth) requieren un Bearer Token en la cabecera:**
> `Authorization: Bearer <tu_jwt_token>`

### 👤 Autenticación (`/auth`)

#### `POST /auth/register`
Registra un nuevo usuario en la plataforma.
- **Body:**
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@test.com",
    "password": "Password123!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "access_token": "eyJhbG...",
    "refresh_token": "eyJhbG..."
  }
  ```

#### `POST /auth/login`
Inicia sesión y obtiene el token JWT.
- **Body:**
  ```json
  {
    "email": "juan@test.com",
    "password": "Password123!"
  }
  ```
- **Response (201 Created):** 
  ```json
  {
    "access_token": "eyJhbG...",
    "refresh_token": "eyJhbG..."
  }
  ```

#### `POST /auth/refresh`
Refresca la sesión enviando el token de larga duración.
- **Body:**
  ```json
  {
    "refreshToken": "eyJhbG..."
  }
  ```
- **Response (200 OK):** Nuevo `access_token` y `refresh_token`.

---

### 🏠 Inmuebles (`/inmuebles`)
*(Requieren JWT Token)*

#### `GET /inmuebles`
Obtiene un catálogo paginado y filtrado de inmuebles.
- **Query Params Opcionales:**
  - `page`: Número de página (Default: 1)
  - `limit`: Resultados por página (Default: 10)
  - `estado`: Filtrar por estado (`DISPONIBLE`, `RESERVADO`, `VENDIDO`)
  - `precioMin` / `precioMax`: Rango de precios
  - `habitaciones`: Número exacto de habitaciones
  - `tipoInmuebleId`: Filtrar por categoría (Casa, Apto, etc).
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "direccion": "Av. Las Palmas",
        "precio": 120000,
        "estado": "DISPONIBLE",
        "vendedor": { "id": "uuid", "nombre": "Juan" },
        "tipoInmueble": { "id": "uuid", "nombre": "Casa" }
      }
    ],
    "meta": { "total": 15, "page": 1, "limit": 10, "totalPages": 2 }
  }
  ```

#### `GET /inmuebles/:id`
Obtiene los detalles completos de un inmueble.

#### `POST /inmuebles`
Publica un nuevo inmueble (Quedará asignado automáticamente al ID del usuario autenticado).
- **Body:**
  ```json
  {
    "direccion": "Calle Falsa 123",
    "precio": 55000,
    "habitaciones": 2,
    "metrosCuadrados": 75,
    "tipoInmuebleId": "uuid_del_tipo_apto"
  }
  ```

#### `PATCH /inmuebles/:id`
Edita la información de un inmueble. *(Solo el propietario puede hacerlo)*.

#### `PATCH /inmuebles/:id/estado`
Avanza o retrocede la máquina de estados del inmueble. *(Solo el propietario puede hacerlo)*.
- **Body:**
  ```json
  {
    "estado": "RESERVADO" // Solo permite: DISPONIBLE, RESERVADO o VENDIDO
  }
  ```

#### `DELETE /inmuebles/:id`
Elimina (Soft-delete) un inmueble. *(Solo el propietario puede hacerlo)*.

---

### 📋 Tipos de Inmuebles (`/tipos-inmueble`)
*(Requieren JWT Token)*

#### `GET /tipos-inmueble`
Retorna el catálogo base de categorías habilitadas (Casa, Terreno, Apartamento, etc).
- **Response (200 OK):**
  ```json
  [
    { "id": "uuid", "codigo": "CASA", "nombre": "Casa" },
    { "id": "uuid", "codigo": "APTO", "nombre": "Apartamento" }
  ]
  ```

---

### 👥 Usuarios (`/usuarios`)
*(Requieren JWT Token)*

- **`GET /usuarios`**: Lista todos los usuarios (útil para dashboards de administradores).
- **`GET /usuarios/:id`**: Obtiene el perfil público de un usuario y sus inmuebles.
- **`DELETE /usuarios/:id`**: Desactiva la cuenta de un usuario.

---

## 🧪 Testing

El backend está cubierto con un conjunto de tests unitarios (Jest) que validan toda la lógica de negocio pura y la inyección de dependencias de los servicios.

Para correr los tests, ejecuta:
```bash
npm run test
```
