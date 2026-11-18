# Catálogo WhatsApp

Catálogo web para tiendas de ropa que venden por WhatsApp. La dueña carga sus productos con foto, precio y talles; el cliente arma un carrito y con un botón se abre WhatsApp con el pedido ya escrito. No usa la API de WhatsApp: solo un enlace `wa.me`, así que no hay costos ni aprobaciones de Meta.

![CI](https://github.com/FranprzDev/catalogo-whatsapp/actions/workflows/ci.yml/badge.svg)

## Cómo funciona

1. **La tienda** entra a `/admin`, crea su contraseña y carga productos (foto, precio, categoría, talles). En "Configuración" define el nombre de la tienda, el número de WhatsApp que recibe los pedidos y la moneda.
2. **El cliente** recorre el catálogo, busca, filtra por categoría, elige talle y agrega al carrito.
3. **Al pedir**, escribe su nombre (y una nota opcional) y toca "Pedir por WhatsApp": se abre el chat de la tienda con el pedido completo (prendas, talles, cantidades, total). El pago y la entrega se arreglan en el chat, como ya trabajan estas tiendas.

## Stack

- **Next.js 16** (App Router, server components + server actions) + **TypeScript** estricto + **Tailwind CSS 4**
- **Neon Postgres** (serverless) para productos, configuración y credenciales del admin
- Sesión de administración con JWT firmado (`jose`) y contraseña hasheada (`bcryptjs`), sin servicios de auth externos

### Por qué Neon (y no Firebase ni Supabase)

- **Neon vs Supabase:** al escalar, Neon cobra solo por uso real sin piso mensual (con scale-to-zero, un catálogo chico paga centavos; su gasto típico publicado es ~USD 15/mes ya con tráfico). Supabase Pro arranca en USD 25/mes fijos y su plan gratis pausa el proyecto tras una semana de inactividad. Precios: [neon.com/pricing](https://neon.com/pricing), [supabase.com/pricing](https://supabase.com/pricing).
- **Sin Firebase Storage:** desde 2026 Cloud Storage for Firebase exige el plan pago Blaze ([fuente oficial](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024)). Para que el repo sea 100% gratis, las fotos se comprimen en el navegador a WebP (≤ 600 KB) y se guardan como data URL dentro de Postgres.

## Setup (10 minutos, todo gratis)

Requisitos: Node 20+ y una cuenta gratuita de [Neon](https://neon.com).

1. **Cloná e instalá:**
   ```bash
   git clone https://github.com/FranprzDev/catalogo-whatsapp.git
   cd catalogo-whatsapp
   npm install
   ```
2. **Creá la base:** en la consola de Neon, creá un proyecto y copiá la connection string (pooled).
3. **Corré el esquema:** pegá el contenido de [`schema.sql`](./schema.sql) en el SQL Editor de Neon (o `psql "$DATABASE_URL" -f schema.sql`).
4. **Configurá el entorno:**
   ```bash
   cp .env.example .env.local
   ```
   Completá `DATABASE_URL` con tu connection string y generá el `AUTH_SECRET` con:
   ```bash
   openssl rand -base64 32
   ```
5. **Levantá el sitio:**
   ```bash
   npm run dev
   ```
   Abrí http://localhost:3000/admin: la primera vez te pide crear la contraseña de administración. Después cargá productos (o tocá "Cargar productos de ejemplo") y configurá tu WhatsApp en la pestaña Configuración.

## Deploy gratis

Cualquier host con soporte Next.js sirve. En [Vercel](https://vercel.com): importá el repo, agregá las variables `DATABASE_URL` y `AUTH_SECRET` en Project Settings → Environment Variables y deployá. No hace falta nada más.

## Estructura

```
src/
  app/               página del catálogo, /admin y server actions
  components/
    store/           catálogo: grilla, tarjeta de producto, imagen
    cart/            drawer del carrito con checkout por WhatsApp
    admin/           login, setup inicial, dashboard, formularios
  context/           estado del carrito (persiste en localStorage)
  lib/
    products/        repository: único lugar que habla con Postgres
    validators/      validaciones de dominio (producto, configuración)
    order.ts         texto del pedido + URL wa.me (funciones puras, testeadas)
    cart.ts          reducer del carrito (funciones puras, testeadas)
    image-compress.ts  compresión de fotos en el navegador
schema.sql           tablas: products, settings, admin_credentials
```

## Scripts

```bash
npm run dev         # desarrollo
npm run build       # build de producción
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run test        # vitest (lógica de carrito y pedido)
```

CI (GitHub Actions) corre lint + typecheck + tests + build en cada PR y push a `main`. El build no necesita credenciales: las páginas son dinámicas y la base solo se toca en runtime.

## Límites conocidos (a propósito)

- **Una sola cuenta de administración** (la tienda). No hay multi-vendedor.
- **Fotos como data URL en Postgres:** cómodo y gratis hasta ~1.500 productos en el plan free de Neon (1 GB). Si una tienda crece más, el siguiente paso es mover las fotos a Neon Object Storage o un bucket S3.
- **Lectura en cada request:** el catálogo es SSR dinámico, así que siempre muestra stock y precios actuales; tras unos minutos sin tráfico, Neon tarda ~1 s en despertar del scale-to-zero.
- **Sin pagos online:** el pedido cierra por WhatsApp, que es donde estas tiendas ya cobran.

## Licencia

MIT — usalo, modificalo y vendé catálogos con esto.
