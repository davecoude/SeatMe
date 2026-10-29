## Context

In a coworking space, desks usually go to whoever arrives first: nobody knows which seat will be free, two people show up for the same desk, and the admin has no way to see who is using what. SeatMe turns that process into a web app: members check availability by zone, book a desk for a time slot and check in when they arrive; admins manage zones, desks and amenities, and follow each booking until it is completed.

> The product interface is in Spanish.

## My role

I built SeatMe end to end as a solo project, organized in sprints with one branch per feature:

- **Data model** in PostgreSQL with Prisma: zones, desks with position and status, amenities and bookings.
- **REST API** with Express: JWT authentication, role-based authorization and input validation with Zod.
- **Frontend** with Vue 3, Pinia and Tailwind: landing page, bookings, profile with avatar and an admin panel.
- **Quality and deployment**: unit tests with Vitest, ESLint and Prettier across the monorepo, and the frontend deployed on Vercel.

## Architecture

![SeatMe architecture diagram: the Vue SPA calls the Express API, which validates the JWT in a middleware and persists to PostgreSQL and Supabase Storage](../docs/architecture.svg)

It is a monorepo with two apps. The **web** app is a SPA that talks to the API over HTTP: an Axios interceptor attaches the token to every request, and router guards protect private routes and the admin panel. The **API** organizes every resource in the same four-layer module:

```
routes → controller → service → Prisma
            ↑
      schema (Zod)
```

Routes declare which middlewares apply (`authenticate`, `authorize(['ADMIN'])`), the controller validates input against the Zod schema, and the service holds the business rules. A single `sendError` helper maps errors (validation, permissions, Prisma error codes) to consistent HTTP responses shaped as `{ "error": "message" }`.

## Technical decisions

### 1. Bookings as a state machine

Every booking follows an explicit lifecycle:

```
PENDING ──▶ CONFIRMED ──▶ CHECKED_IN ──▶ COMPLETED
   └────────────┴──▶ CANCELLED
```

Each transition lives in its own service function and checks the current state before changing it; for example, only a confirmed booking can be checked in. An out-of-order request fails with a clear error instead of leaving inconsistent data behind.

**Trade-off:** the flow requires an admin to confirm every booking. That gives the coworking space control, but adds a manual step; a large space would be better served by automatic, rule-based confirmation.

### 2. Overlap checks before creating a booking

Before inserting, the service checks, in order, that the time range is valid, that the desk exists and is available, that no other active booking on that desk overlaps the requested slot, and that the user has no other active booking at the same time. Two slots overlap when `start₁ < end₂` and `end₁ > start₂`; times are stored as `HH:mm` strings validated with Zod, so string comparison follows chronological order.

**Trade-off:** the check lives in the application, not in the database. It is easy to read and to unit test, but two simultaneous requests could both pass it. The robust fix is a PostgreSQL exclusion constraint, which is the next step.

### 3. Two layers of authorization

The role (`MEMBER` or `ADMIN`) travels in the JWT, and the `authorize` middleware protects admin routes. That is not enough for routes shared by members and admins: a member could view or cancel someone else's booking just by changing the id in the URL (an IDOR vulnerability). I fixed it with an ownership check inside the service: only the booking's owner or an admin can view it, check in or cancel it; anyone else gets a 403.

**Trade-off:** the frontend keeps the token in `localStorage` for simplicity. It is convenient for a SPA, but exposed if an XSS ever happened; an `httpOnly` cookie would be safer, at the cost of handling CSRF.

## Outcome and next step

SeatMe is live at [seat-me-three.vercel.app](https://seat-me-three.vercel.app). It covers the full coworking flow, from sign-up to closing each booking, with 21 unit tests on the zone, desk and booking services, where the business logic lives.

What I would do next:

- **Enforce overlaps in the database** with a PostgreSQL exclusion constraint to close the race condition.
- **Move the token to an `httpOnly` cookie** to reduce the XSS surface.
- **Add API integration tests** against a real database, on top of the unit tests.
