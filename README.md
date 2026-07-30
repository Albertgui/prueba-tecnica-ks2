# Backend - Gestión de Inmuebles

Esta es la API RESTful para el sistema de Gestión de Inmuebles, construida con **NestJS**, **Prisma** y **PostgreSQL**.

## Arquitectura y Principios Aplicados (Clean Architecture & DDD)

Para garantizar un código mantenible, escalable y robusto, este backend implementa **Domain-Driven Design (DDD)** y **Arquitectura Limpia**:

- **Dominio Puro**: Las reglas de negocio, como la Máquina de Estados de los inmuebles (`DISPONIBLE -> RESERVADO -> VENDIDO`), están encapsuladas estrictamente en entidades de dominio puras.
- **Capa de Aplicación**: Orquesta los casos de uso sin depender de detalles de base de datos.
- **Capa de Infraestructura**: Contiene los Controladores, Repositorios (Adaptadores de Prisma) y Módulos de NestJS.
- **Seguridad**: 
  - Autenticación con **JWT** y encriptación de contraseñas (`bcrypt`).
  - **Protección IDOR** estricta: Los usuarios solo pueden editar/eliminar inmuebles de los que son propietarios.
  - El password nunca se filtra en las respuestas JSON.
  - Headers de seguridad con **Helmet** y limitación de peticiones con **Throttler (Rate Limit)**.
  - Validación de DTOs en modo whitelist estricto.

## Instalación

1. Sitúate en la carpeta del backend e instala las dependencias (puedes usar `npm` o `pnpm`):
   ```bash
   cd backend
   npm install
   ```

2. Configura las variables de entorno. Renombra o copia el archivo `.env.example` a `.env` y asegúrate de configurar tu conexión a Postgres:
   ```bash
   # Formato de conexión Prisma
   DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/NOMBRE_DB?schema=public"
   JWT_SECRET="tu-secreto-super-seguro"
   ```

## Sincronización y Seed de la Base de Datos

El proyecto incluye un script robusto para poblar la base de datos con información de prueba. Ejecuta los siguientes comandos en orden:

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```
> *Nota: El Seed creará los tipos de inmuebles base, 3 usuarios de prueba y 15 inmuebles aleatorios listos para ser consumidos.*

## Ejecución del Proyecto

Para iniciar el servidor en modo desarrollo con auto-recarga:

```bash
npm run start:dev
```

La API estará corriendo por defecto en `http://localhost:3000`.

## Principales Endpoints

- **`POST /auth/register`** y **`POST /auth/login`**: Autenticación.
- **`GET /inmuebles`**: Catálogo público con filtros avanzados (`?precioMin=X&habitaciones=Y&estado=DISPONIBLE&page=1&limit=10`).
- **`POST /inmuebles`**: Crear un inmueble (Requiere Autenticación).
- **`PATCH /inmuebles/:id/vender`** (y `/reservar`, `/liberar`): Transiciones de máquina de estados de un inmueble (Solo el dueño puede ejecutarlo).
