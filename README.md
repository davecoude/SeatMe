# SeatMe

Aplicación web para reservar escritorios en un espacio de trabajo compartido. Los miembros eligen un escritorio por zona y franja horaria, y los administradores gestionan zonas, escritorios, amenities y el ciclo de vida de las reservas.

Monorepo con dos aplicaciones:

| App | Stack | Ruta |
|---|---|---|
| **API** | Node.js · Express 5 · Prisma 7 (PostgreSQL) · Zod · JWT · Supabase Storage | [apps/api](apps/api) |
| **Web** | Vue 3 · Vite · Pinia · Vue Router · Tailwind CSS 4 · PrimeVue · GSAP | [apps/web](apps/web) |

## Inicio rápido

Requisitos: **Node.js 22.18+ o 24.12+**, una base de datos PostgreSQL (el proyecto usa Supabase) y un bucket de Supabase Storage llamado `avatars`.

```bash
# 1. API
cd apps/api
npm install                 # también ejecuta `prisma generate`
# crea apps/api/.env (ver "Variables de entorno")
npx prisma migrate deploy   # aplica las migraciones
npm run seed                # datos de ejemplo (opcional, ver advertencia abajo)
npm run dev                 # http://localhost:3000

# 2. Web (en otra terminal)
cd apps/web
npm install
npm run dev                 # http://localhost:5173
```

Comprueba que la API responde con `curl http://localhost:3000/health` → `{"status":"ok"}`. Luego abre http://localhost:5173, crea una cuenta en **/register** e inicia sesión.

> [!WARNING]
> `npm run seed` **borra** todas las zonas, escritorios, amenities y reservas antes de insertar los datos de ejemplo (3 zonas, 9 escritorios, 3 amenities). No lo ejecutes contra una base de datos con datos reales.

### Crear un administrador

El registro siempre crea usuarios con rol `MEMBER`. Para tener un administrador, cambia el rol directamente en la base de datos y vuelve a iniciar sesión (el rol viaja en el JWT):

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'tu@email.com';
```

## Variables de entorno

### `apps/api/.env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto de la API (por defecto `3000`) |
| `NODE_ENV` | `development` / `production` |
| `DATABASE_URL` | Conexión a PostgreSQL usada en tiempo de ejecución (en Supabase, la URL del *pooler*) |
| `DIRECT_URL` | Conexión directa usada por Prisma para migraciones |
| `JWT_SECRET` | Secreto para firmar los tokens |
| `JWT_EXPIRES_IN` | Duración del token, p. ej. `1d` |
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_ANON_KEY` | Clave anónima de Supabase (subida de avatares) |

La API no arranca si faltan `SUPABASE_URL` o `SUPABASE_ANON_KEY`, y el login falla si faltan `JWT_SECRET` o `JWT_EXPIRES_IN`.

### `apps/web/.env` (opcional)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API. Por defecto `http://localhost:3000` |

## Scripts

**API** ([apps/api](apps/api))

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor con recarga automática (`tsx watch`) |
| `npm run build` / `npm start` | Compila a `dist/` y lo ejecuta |
| `npm run seed` | Carga datos de ejemplo |
| `npm test` / `npm run test:run` | Tests de servicios con Vitest (modo watch / una vez) |
| `npm run lint` / `npm run format` | ESLint / Prettier |

**Web** ([apps/web](apps/web))

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Type-check con `vue-tsc` + build de producción |
| `npm run preview` | Sirve el build localmente |
| `npm run test:unit` | Tests con Vitest |
| `npm run lint` / `npm run format` | oxlint + ESLint / Prettier |

## Arquitectura

![Diagrama de arquitectura de SeatMe: la Web SPA llama a la API Express, que valida el JWT en el middleware y persiste en PostgreSQL y Supabase Storage](docs/architecture.svg)

```
apps/
├── api/
│   ├── prisma/            # schema.prisma, migraciones y seed
│   └── src/
│       ├── config/        # clientes de Prisma y Supabase
│       ├── middlewares/   # authenticate (JWT) y authorize(roles)
│       ├── modules/       # un módulo por recurso: routes → controller → service (+ schema Zod)
│       └── utils/         # HttpError y sendError (mapeo de errores Zod/Prisma a HTTP)
└── web/
    └── src/
        ├── views/         # landing, auth, dashboard, reservas, perfil y admin
        ├── services/      # llamadas a la API (axios añade el token Bearer)
        ├── stores/        # Pinia: estado de autenticación
        └── router/        # rutas y guards (sesión y rol ADMIN)
```

**Autenticación.** `POST /auth/login` devuelve un JWT con `userId`, `role` y `firstName`. El frontend lo guarda en `localStorage` y lo envía como `Authorization: Bearer <token>`. El router redirige a `/login` si no hay token y bloquea `/admin/*` para quien no tenga rol `ADMIN`.

**Modelo de datos.** `Zone` (piso) → `Desk` (código, posición, estado `AVAILABLE`/`MAINTENANCE`) ↔ `Amenity` (vía `DeskAmenity`). `User` → `Reservation` (escritorio, fecha, hora de inicio y fin). Ver [schema.prisma](apps/api/prisma/schema.prisma).

### Ciclo de vida de una reserva

```
PENDING ──(admin confirma)──▶ CONFIRMED ──(usuario hace check-in)──▶ CHECKED_IN ──(admin completa)──▶ COMPLETED
   │                              │
   └──────────(cancelar)──────────┴──▶ CANCELLED
```

Al crear una reserva se valida que el escritorio esté `AVAILABLE` y que ni el escritorio ni el usuario tengan otra reserva activa que se solape en la misma fecha y horario.

## API

Todas las rutas, salvo `/auth/*` y `/health`, requieren token. 🔒 = solo `ADMIN`.

| Recurso | Endpoints |
|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` |
| Usuarios | `GET /users/me` · `POST /users/avatar` (multipart, campo `avatar`) |
| Zonas | `GET /zones` · `GET /zones/:id` · 🔒 `POST /zones` · 🔒 `PATCH /zones/:id` · 🔒 `DELETE /zones/:id` |
| Escritorios | `GET /desks` · `GET /desks/:id` · 🔒 `POST /desks` · 🔒 `PATCH /desks/:id` · 🔒 `DELETE /desks/:id` |
| Amenities | `GET /amenities` · `GET /amenities/:id` · 🔒 `POST /amenities` · 🔒 `PATCH /amenities/:id` · 🔒 `DELETE /amenities/:id` |
| Amenities de un escritorio | `GET /desks/:deskId/amenities` · 🔒 `POST` / `DELETE /desks/:deskId/amenities/:amenityId` |
| Reservas | `POST /reservations` · `GET /reservations/my` · `GET /reservations/desk/:deskId` · `GET /reservations/:id` · `PATCH /reservations/:id/check-in` · `PATCH /reservations/:id/cancel` · 🔒 `GET /reservations/all` · 🔒 `PATCH /reservations/:id/confirm` · 🔒 `PATCH /reservations/:id/complete` |

Los errores se devuelven como `{ "error": "mensaje" }`.

Ejemplo:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"Prueba1234"}' | jq -r .token)

curl http://localhost:3000/zones -H "Authorization: Bearer $TOKEN"
```

La contraseña de registro debe tener al menos 8 caracteres, una mayúscula y un número.

## Contribuir

- Crea una rama desde `main` y abre un merge request.
- Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `test:`…).
- Antes de subir cambios ejecuta `npm run lint` y los tests en la app que modificaste.
- Nuevos recursos de la API: sigue la estructura `*.routes.ts` → `*.controller.ts` → `*.service.ts` + `*.schema.ts` de [apps/api/src/modules](apps/api/src/modules) y usa `sendError` para responder errores.
