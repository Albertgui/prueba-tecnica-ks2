# Fullstack Technical Test: User and Real Estate Management

## 01 Objective
Develop a fullstack application for managing users and real estate properties for sale, featuring authentication, CRUD operations, searching, and filtering.

**Required Stack:**
*   Backend: NestJS + TypeScript
*   Frontend: React + TypeScript
*   Database: PostgreSQL

**Time & Delivery:**
*   Estimated Time: 8 hours of effective work. The test is calibrated for 8 hours. If you exceed 10 hours, stop and deliver what you have with the technical debt declared.
*   Delivery Timeframe: 3 days.
*   Delivery Format: Read-only Git repository, or a `.zip` file including the `.git` folder.

**What is Evaluated:**
*   Technical judgment over the quantity of features.
*   How data is modeled, where business rules are placed, and how resources are protected.
*   *An incomplete but well-architected delivery scores higher than a complete delivery with logic in the wrong place.*
*   Optionals are truly optional: do not touch them until the mandatory requirements are closed.

---

## 02 Domain Model

A property (inmueble) is a real estate asset published in the system by a user. That user is the owner of the record (`vendedorId`) and is the only one who can modify or delete it.

### Entities

**usuario**
*   id (UUID)
*   nombre
*   email (unique)
*   password (hashed)
*   activo
*   createdAt, updatedAt, deletedAt

**tipo_inmueble**
*   id
*   codigo
*   nombre
*   activo
*   *Note: Parametric catalog. Do not use a TypeScript enum or a fixed CHECK constraint. It must be a queryable table because in production, these types are managed by a user, not a developer. Load at least 4 via seed (e.g., casa, apartamento, terreno, local comercial).*

**inmueble**
*   id (UUID)
*   direccion
*   precio (exact numeric, not float)
*   habitaciones
*   metrosCuadrados
*   tipoInmuebleId
*   vendedorId (FK)
*   estado
*   createdAt, updatedAt, deletedAt

*General Rules:* A user has many properties; `vendedorId` is a FK to user. All tables use UUID as PK and logical deletion (`deletedAt`). Logically deleted records must not appear in any queries.

### 2.2 Business Rules (Must be enforced in the backend)

**Property States:**
*   **DISPONIBLE (Available):** A property is born `DISPONIBLE`, assigned to the authenticated user.
*   **RESERVADO (Reserved):** Can transition from `DISPONIBLE`.
*   **VENDIDO (Sold):** Cannot be edited or return to `DISPONIBLE`. It is a final state.

**State Transitions & Rules:**
1.  Only the owner/seller of the property can edit or delete it.
2.  A `VENDIDO` property cannot be edited or reverted to `DISPONIBLE` (Final state).
3.  Valid transitions are: `DISPONIBLE` -> `RESERVADO`, `DISPONIBLE` -> `VENDIDO`. The only valid reverse transition is `RESERVADO` -> `DISPONIBLE`.
4.  Any invalid transition must return a `409 Conflict` with an identifiable error code (not a generic 400 or 500).
5.  A user can only edit or deactivate their own account.
6.  The price must be greater than zero.

---

## 03 Backend - NestJS

### 3.1 Configuration
*   NestJS with TypeScript, `@nestjs/config`, `class-validator`, `class-transformer`.
*   ORM: TypeORM or Prisma (your choice). Must include migrations and seeds executable via npm commands. (No manual `.sql` scripts accepted).
*   Database: `gestion_inmuebles`.
*   `.env.example` must be versioned. The JWT secret is read from the environment with no default value.

### 3.2 Endpoints

**AUTHENTICATION**
*   `POST /auth/register`: Validates unique email, format, and minimum password strength.
*   `POST /auth/login`: Returns JWT token.
*   `GET /auth/me`: Returns authenticated user data.

**USERS (Requires Authentication)**
*   `GET /usuarios`: Paginated. Never returns the password.
*   `GET /usuarios/:id`
*   `PATCH /usuarios/:id`: Only their own account.
*   `DELETE /usuarios/:id`: Logical deletion, only their own account.

**PROPERTIES (Requires Authentication)**
*   `GET /inmuebles`: Paginated, filterable, and sortable (See section 3.3).
*   `GET /inmuebles/:id`: Includes seller data.
*   `POST /inmuebles`: Born `DISPONIBLE`, assigned to authenticated user.
*   `PATCH /inmuebles/:id`: Only the owner, only if the state allows it.
*   `DELETE /inmuebles/:id`: Logical deletion, only the owner.
*   `PATCH /inmuebles/:id/estado`: Body requires `{estado: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO'}`.

*Note:* The `vendedorId` is never accepted from the body: it always comes from the token. If it comes in the payload, it is ignored.

**CATALOG**
*   `GET /tipos-inmueble`: Only active types.

### 3.3 List Queries (Everything resolved in SQL)
Supported query parameters: `page`, `limit`, `estado`, `tipoInmuebleId`, `soloMios` (boolean), `orderBy` (precio or createdAt), `order` (ASC/DESC), `precioMin`, `precioMax`, `search` (free text over the address).

*CRITICAL WARNING:* Fetching everything with `findAll()` and filtering with `.filter()` or paginating with `.slice()` in memory is heavily penalized. It is the most significant error in this test. Everything must be resolved in the SQL query.

### 3.4 Mandatory Technical Requirements
*   Password hashed with bcrypt or argon2. Never returned in any response.
*   DTOs validated with `class-validator` and global `ValidationPipe` in whitelist mode.
*   **Metadata Response Format:** List endpoints must return: `{ data, meta: { total, page, limit, totalPages } }`. The `total` comes from a database `COUNT`.
*   **Correct HTTP Codes:**
    *   `401`: Missing token.
    *   `403`: Missing permission.
    *   `404`: Non-existent resource.
    *   `409`: State conflict.
    *   `400/422`: Validation error.
*   **IDOR Protection:** If a user requests or modifies another user's resource they shouldn't see, return `404`, not `403`. Do not confirm the existence of third-party resources.
*   Authentication Guard applied to protected routes via decorator. (No `if (!req.user)` inside controllers).
*   Global Exception Filter with a consistent format: `{ statusCode, code, message, path }`.
*   Real modular structure: one module per domain (`auth`, `usuarios`, `inmuebles`, `catalogos`), business logic in services, thin controllers.
*   **Seeds:** At least 3 users and 15 properties distributed among them and across different states. Without data, filters and pagination cannot be evaluated.

---

## 04 Frontend - React + TypeScript

### 4.1 Structure and Authentication
*   Clear folder organization (`components`, `pages`, `services`, `hooks`, `types`).
*   Registration and login forms with client-side validation and server errors displayed to the user.
*   Protected routes: redirect to login if there is no session.
*   Session persistence. Justify in `DECISIONS.md` where you store the token and what risk you assume. `localStorage` is acceptable if defended, but not if it's just what a tutorial showed.

### 4.2 Views and Components (KEEP THESE EXACT NAMES)
*   `UserList` / `UserItem`: List of registered users with server pagination. `UserItem` shows individual data.
*   `AddUser`: User registration.
*   `InmuebleList`: Property list with filters and pagination resolved on the server.
*   `InmuebleItem`: Card or row with a visual indicator of the state.
*   `AddInmueble`: Creation form, with type loaded from `/tipos-inmueble`.
*   `EditInmueble`: Edit form.
*   `InmuebleDetalle`: Detail view with seller data and available actions.

*(Note: Vite or Next.js allowed. UI styling library is free choice. Visual design is not evaluated; proper handling of UI states is).*

### 4.3 Cross-Cutting Requirements
*   Functional UI filters: state, type, price range, address search, and a "only my properties" toggle. All must trigger a server query; do not filter the local array.
*   Only actions the user can execute are shown. Edit and delete only appear on their own properties; state changes respect valid transitions. A disabled button is acceptable; a button triggering a 403/409 is not.
*   Loading, error, and empty states handled explicitly in each view consuming data. An infinite spinner on an API failure is a defect.
*   No `any` in API responses. Types must be declared.

---

## 05 Delivery

The repository must contain:
1.  **README.md**: How to start everything from scratch (database, migrations, seeds), required environment variables, and test credentials for at least 2 users.
2.  **DECISIONS.md** (Half page, four concrete answers):
    1.  Where does the state rule validation live and why there?
    2.  How do you guarantee a user cannot modify another user's resources?
    3.  Where do you store the token on the client and what risk do you assume?
    4.  What technical debt did you consciously assume due to the time limit?
3.  Incremental commits with meaningful messages. A single commit for the whole project is a negative signal.
4.  No real `.env`, no `node_modules`, no credentials in the repo.

**Optionals (ONLY if mandatory requirements are closed):**
*   Docker Compose: Spin up everything with one command.
*   Swagger/OpenAPI: API documentation.
*   Justified Indexes: On filtered columns.