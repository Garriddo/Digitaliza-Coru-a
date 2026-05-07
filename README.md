# Digitaliza Coruña

Proyecto exportado desde Hostinger Horizons con frontend React/Vite, API Node/Express y PocketBase.

## Estructura

- `apps/web`: aplicación React/Vite.
- `apps/api`: API Node/Express para Stripe y rutas backend.
- `apps/pocketbase`: hooks, migraciones y tipos de PocketBase.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build frontend

```bash
npm run build --prefix apps/web
```

El build queda en:

```text
dist/apps/web
```

## Variables de entorno

No se versionan `.env` ni `.env.local`. Usa como referencia:

- `apps/api/.env.example`
- `apps/web/.env.example`

## Despliegue en Hostinger

Para despliegue estático, publica el contenido de `dist/apps/web` en `public_html`.

Para despliegue conectado a GitHub, configura en Hostinger:

- Install/build command: `npm install && npm run build --prefix apps/web`
- Output directory: `dist/apps/web`

Conserva el `.htaccess` generado para que funcionen rutas como `/login`, `/register` y `/dashboard`.
