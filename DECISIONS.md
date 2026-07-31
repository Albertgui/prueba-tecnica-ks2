# 🧠 Registro de Decisiones Arquitectónicas (ADR)

A lo largo de la prueba técnica tuve que priorizar y tomar decisiones para mantener un equilibrio entre las buenas prácticas, la seguridad y el tiempo limitado de entrega (8 horas).

Aquí respondo a las cuatro preguntas clave sobre cómo está construido el sistema:

### 1. ¿Dónde vive la validación de las reglas de estado y por qué ahí?

La lógica de la "máquina de estados" de los inmuebles (las transiciones de `DISPONIBLE -> RESERVADO -> VENDIDO`) vive de forma pura dentro de la **entidad de Dominio `Inmueble`** (`backend/src/modules/inmuebles/domain/inmueble.entity.ts`).

**¿Por qué ahí?**
Porque quise aplicar los principios de *Domain-Driven Design (DDD)*. Las reglas que definen qué estado puede seguir a otro son el corazón del negocio. Si ponía esa validación suelta en un Controlador o en un Servicio, corría el riesgo de que mañana otro desarrollador creara un script, un cronjob o un nuevo endpoint que se saltara la regla. Al encapsular la validación *dentro* del objeto mismo (mediante su método `cambiarEstado()`), hago imposible que un inmueble adquiera un estado inválido, sin importar desde dónde se intente modificar en la aplicación.

### 2. ¿Cómo garantizas que un usuario no pueda modificar recursos ajenos?

Implementando una estricta protección **Anti-IDOR (Insecure Direct Object Reference)** en la capa de Servicios de la aplicación.

El flujo funciona así:
1. Extraigo de forma confiable el ID del usuario directamente desde el token JWT decodificado en el middleware (`req.user.id`), **nunca** confío en un ID que venga en el cuerpo de la petición.
2. Cuando el usuario intenta editar o borrar un inmueble, el `InmueblesService` consulta primero la base de datos para ver a quién le pertenece ese registro.
3. Si el `vendedorId` del inmueble no coincide con el `req.user.id` del token, arrojo un `404 Not Found` en lugar de un `403 Forbidden`.

Hacerlo devolviendo un `404` es intencional: evita la enumeración de objetos. Un atacante ni siquiera debe saber si el inmueble ajeno existe o no en nuestra base de datos.

### 3. ¿Dónde guardas el token en el cliente y qué riesgo asumes?

El token JWT está almacenado en el **`localStorage`** del navegador (`AuthContext.tsx`).

**El riesgo asumido:**
Al guardar un token en `localStorage`, estoy asumiendo la vulnerabilidad frente a ataques **XSS (Cross-Site Scripting)**. Si un atacante lograra inyectar código JavaScript malicioso en el frontend (por ejemplo, a través de una dependencia npm comprometida), podría leer fácilmente el `localStorage` y robar el token de sesión.

**¿Por qué lo elegí?**
Por el límite de tiempo de la prueba. La alternativa blindada hubiese sido configurar el backend para emitir el JWT dentro de una cookie `HttpOnly` con los flags `Secure` y `SameSite=Strict`. Sin embargo, esto requiere una orquestación más compleja de los CORS, los proxies y los credenciales de Axios, lo cual me habría quitado tiempo valioso para cerrar requerimientos funcionales más urgentes.

### 4. ¿Qué deuda técnica asumiste conscientemente por el límite de tiempo?

Para lograr entregar un proyecto funcional, seguro y con buen diseño dentro del límite de las 8 horas, dejé conscientemente las siguientes deudas técnicas:

- **Búsqueda Full-Text rudimentaria:** La búsqueda por dirección (`search`) usa un simple `ILIKE / contains` de PostgreSQL a través de Prisma. Funciona perfecto con miles de registros, pero si el sistema escala a millones de inmuebles, el rendimiento caerá drásticamente. Lo ideal hubiese sido usar índices Full-Text nativos o ElasticSearch.
- **Tests End-to-End (E2E):** Aunque configuré y ejecuté pruebas unitarias tanto en el frontend como en el backend para la lógica crítica, dejé fuera las pruebas E2E (con herramientas como Playwright o Cypress) para simular los flujos de usuario reales de punta a punta.
