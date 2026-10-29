## Contexto

En un coworking los escritorios se reparten "a quien llegue primero": nadie sabe qué puesto estará libre, dos personas aparecen para el mismo escritorio y el administrador no tiene forma de ver quién usa qué. SeatMe lleva ese proceso a una aplicación web: los miembros consultan la disponibilidad por zona, reservan un escritorio en una franja horaria y hacen check-in al llegar; los administradores gestionan zonas, escritorios y amenities, y acompañan cada reserva hasta que se completa.

## Mi rol

Desarrollé SeatMe de punta a punta como proyecto individual, organizado en sprints con una rama por funcionalidad:

- **Modelo de datos** en PostgreSQL con Prisma: zonas, escritorios con posición y estado, amenities y reservas.
- **API REST** con Express: autenticación con JWT, autorización por rol y validación de entrada con Zod.
- **Frontend** con Vue 3, Pinia y Tailwind: landing, reservas, perfil con avatar y panel de administración.
- **Calidad y despliegue**: tests unitarios con Vitest, ESLint y Prettier en el monorepo y despliegue del frontend en Vercel.

## Arquitectura

![Diagrama de arquitectura de SeatMe: la SPA en Vue llama a la API en Express, que valida el JWT en un middleware y persiste en PostgreSQL y Supabase Storage](../docs/architecture.svg)

Es un monorepo con dos aplicaciones. La **web** es una SPA que habla con la API por HTTP: un interceptor de Axios añade el token a cada petición y los guards del router protegen las rutas privadas y el panel de administración. La **API** organiza cada recurso en el mismo módulo de cuatro capas:

```
routes → controller → service → Prisma
            ↑
      schema (Zod)
```

Las rutas declaran qué middlewares aplican (`authenticate`, `authorize(['ADMIN'])`), el controlador valida la entrada con el schema de Zod y el servicio concentra las reglas de negocio. Un único `sendError` traduce los errores (validación, permisos, códigos de Prisma) a respuestas HTTP consistentes con la forma `{ "error": "mensaje" }`.

## Decisiones técnicas

### 1. La reserva como máquina de estados

Cada reserva sigue un ciclo explícito:

```
PENDING ──▶ CONFIRMED ──▶ CHECKED_IN ──▶ COMPLETED
   └────────────┴──▶ CANCELLED
```

Cada transición vive en su propia función del servicio y verifica el estado de origen antes de cambiarlo; por ejemplo, solo se puede hacer check-in a una reserva confirmada. Así una petición fuera de orden falla con un error claro en lugar de dejar datos incoherentes.

**Trade-off:** el flujo exige que un administrador confirme cada reserva. Eso le da control al coworking, pero añade un paso manual; en un espacio grande convendría la confirmación automática con reglas.

### 2. Validar solapamientos antes de crear la reserva

Antes de insertar, el servicio comprueba en orden que el horario sea válido, que el escritorio exista y esté disponible, que no haya otra reserva activa en ese escritorio que se cruce con la franja pedida, y que el usuario no tenga otra reserva activa a la misma hora. Dos franjas se solapan cuando `inicio₁ < fin₂` y `fin₁ > inicio₂`; las horas se guardan como `HH:mm` validadas con Zod, así que la comparación de texto respeta el orden cronológico.

**Trade-off:** la validación está en la aplicación y no en la base de datos. Es simple de leer y de probar con tests unitarios, pero dos peticiones simultáneas podrían pasar el chequeo a la vez. La solución robusta es una restricción de exclusión en PostgreSQL, que queda como siguiente paso.

### 3. Autorización en dos niveles

El rol (`MEMBER` o `ADMIN`) viaja en el JWT y el middleware `authorize` protege las rutas de administración. Eso no basta para las rutas que comparten miembros y administradores: un miembro podía consultar o cancelar la reserva de otro con solo cambiar el id en la URL (una vulnerabilidad IDOR). Lo corregí con una verificación de propiedad dentro del servicio: solo el dueño de la reserva o un administrador pueden verla, hacer check-in o cancelarla, y en otro caso la API responde 403.

**Trade-off:** el frontend guarda el token en `localStorage` por simplicidad. Es práctico para una SPA, pero queda expuesto si hubiera un XSS; una cookie `httpOnly` sería más segura a cambio de manejar CSRF.

## Resultado y siguiente paso

SeatMe está en producción: [seat-me-three.vercel.app](https://seat-me-three.vercel.app). Cubre el flujo completo de un coworking, desde el registro hasta el cierre de cada reserva, y tiene 21 tests unitarios sobre los servicios de zonas, escritorios y reservas, donde vive la lógica de negocio.

Lo siguiente que haría:

- **Garantizar los solapamientos en la base de datos** con una restricción de exclusión de PostgreSQL, para cerrar la condición de carrera.
- **Mover el token a una cookie `httpOnly`** y reducir la superficie ante XSS.
- **Agregar tests de integración** de la API contra una base de datos real, además de los unitarios.
