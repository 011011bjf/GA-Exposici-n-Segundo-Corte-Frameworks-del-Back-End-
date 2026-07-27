# ARTISYNC — Frontend AlpineJS

Frontend en [AlpineJS](https://alpinejs.dev/) que consume la API REST del backend Spring Boot de **ArtiSync**. Desarrollado para la exposición del Segundo Corte de la materia de Aplicaciones Web (Frameworks del Back-End).

Este repositorio contiene únicamente el frontend estático (HTML + Alpine.js, sin build step ni framework de bundling). El backend (Spring Boot + PostgreSQL + Redis) vive en un repositorio separado.

## Requisitos previos

- Un navegador moderno (Chrome, Firefox, Edge).
- Node.js (para servir el sitio con `http-server`) **o** Python 3 como alternativa — solo se necesita uno de los dos.
- El backend de ArtiSync corriendo en `http://localhost:8080` (repositorio separado, no incluido aquí), con CORS habilitado para `http://localhost:4200`.

## Cómo ejecutar el frontend

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/011011bjf/GA-Exposici-n-Segundo-Corte-Frameworks-del-Back-End-.git
   ```

2. Desde la raíz del repo, servir los archivos estáticos con **una** de estas opciones:

   ```bash
   npx http-server . -p 4200
   ```

   o, como alternativa con Python:

   ```bash
   python -m http.server 4200
   ```

3. Abrir en el navegador:

   ```
   http://localhost:4200/login.html
   ```

4. ⚠️ **Advertencia:** el backend debe estar corriendo en `http://localhost:8080` con CORS configurado para permitir el origen `http://localhost:4200` (o `http://127.0.0.1:4200`). Si el backend no está disponible o el frontend se sirve en otro puerto, las peticiones fallarán por CORS o por conexión rechazada.

## Estructura del repositorio

| Archivo | Descripción |
|---|---|
| `login.html` | Formulario de inicio de sesión. Incluye manejo del flujo de verificación 2FA cuando el backend lo exige. |
| `registro.html` | Formulario de registro de nuevos usuarios (validación de mayoría de edad, fuerza de contraseña, rol CLIENTE/CREADOR). |
| `crud-usuarios.html` | Panel de administración: listado paginado, edición, cambio de estado, revocación de sesiones y eliminación de usuarios. |
| `admin-usuarios.html` | Formulario administrativo adicional para gestión de usuarios. |
| `api-client.js` | Cliente HTTP centralizado: define `API_BASE_URL`, el manejo de token (`authStore`) en `localStorage`, y el helper `fetchWithAuth()` que agrega el header `Authorization` y redirige a login en caso de `401`. |

## Flujo de autenticación

1. El usuario envía correo y contraseña a `POST /auth/login`.
2. Si el backend responde con `requiere2fa: false`, se guarda el `accessToken` recibido en `localStorage` y se redirige al panel (`crud-usuarios.html`).
3. Si el backend responde con `requiere2fa: true` (el usuario tiene 2FA activado), `login.html` muestra un segundo formulario pidiendo un código de 6 dígitos. Ese código se envía a `POST /auth/2fa/verify` junto con el correo; la respuesta de ese endpoint sí trae el `accessToken`, que se guarda igual que en el flujo normal.
4. En las páginas protegidas, el token guardado en `localStorage` se adjunta automáticamente a cada petición vía `fetchWithAuth()` (header `Authorization: Bearer <token>`). Si el backend responde `401`, el token se elimina y se redirige a `login.html`.

## Endpoints REST consumidos

| Método | Endpoint | Usado en |
|---|---|---|
| `POST` | `/auth/login` | `login.html` |
| `POST` | `/auth/2fa/verify` | `login.html` (solo si el login exige 2FA) |
| `POST` | `/auth/registro` | `registro.html` |
| `GET` | `/admin/usuarios` | `crud-usuarios.html` (listado paginado y exportación) |
| `PUT` | `/admin/usuarios/{id}` | `crud-usuarios.html` (edición) |
| `PATCH` | `/admin/usuarios/{id}/estado` | `crud-usuarios.html` (activar/desactivar) |
| `DELETE` | `/admin/usuarios/{id}/sesiones` | `crud-usuarios.html` (revocar sesiones) |
| `DELETE` | `/admin/usuarios/{id}` | `crud-usuarios.html` (eliminar usuario) |

Todas las rutas se resuelven contra `API_BASE_URL` (`http://localhost:8080/api`), definida en `api-client.js`.

> Nota: `admin-usuarios.html` llama actualmente a un endpoint (`/admin/db-permisos/crear-usuario-sistema`) que **no está confirmado en el backend** — pendiente de validar con el equipo de backend antes de documentarlo como funcional.

## Estado conocido / limitaciones

- La prueba end-to-end contra el backend real todavía está **pendiente**. El backend requiere variables de entorno (`JWT_SECRET`, credenciales de base de datos) y servicios externos (PostgreSQL, Redis) que se configuran en el repositorio del backend, no en este. Hasta que el backend se levante con esa configuración completa, el frontend solo se ha verificado sirviéndose correctamente en `:4200` (respuestas `HTTP 200` en todos los HTML), sin confirmar aún las respuestas reales de la API.
- El flujo de 2FA está implementado según el contrato documentado del backend, pero no ha sido probado contra una cuenta real con 2FA activado.

## Autores

- **Figueroa Morales Bryan Javier** — creador del repositorio / PFC
- **Loor Medranda Marlon Taylor** — [mloorm14@uteq.edu.ec](mailto:mloorm14@uteq.edu.ec) — colaborador, frontend AlpineJS
