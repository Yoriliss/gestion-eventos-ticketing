# Sistema de Gestion de Eventos con Ticketing

Proyecto Integrador Final - Desarrollo de Aplicaciones Web II (Semana 16)

## Descripcion

Plataforma web que permite a una empresa organizadora de eventos publicar eventos, y a los usuarios registrarse, autenticarse y comprar tickets con reserva temporal. El proyecto integra los conceptos vistos en el curso:

- **Unidad 7 (ORM):** modelos y relaciones con Sequelize sobre PostgreSQL.
- **Unidad 8 (APIs):** API RESTful, autenticacion con JWT, rate limiting.
- **Unidad 9 (Seguridad):** Helmet (headers HTTP), CORS configurado, validacion de entradas, hashing de contrasenas con bcrypt.

## Tecnologias utilizadas

| Capa | Tecnologia |
|------|-----------|
| Backend | Node.js + Express |
| Base de datos | PostgreSQL + Sequelize (ORM) |
| Autenticacion | JWT (jsonwebtoken) + bcryptjs |
| Seguridad | Helmet, CORS, express-validator, express-rate-limit |
| Frontend | React (componentes funcionales con hooks) |

## Estructura del proyecto

```
proyecto-eventos/
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── models/ (Usuario, Evento, Ticket, relaciones)
│   │   ├── controllers/ (authController, eventoController, ticketController)
│   │   ├── middleware/ (auth, rateLimit, validators)
│   │   ├── routes/ (authRoutes, eventoRoutes, ticketRoutes)
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/ (Login, Registro, EventosList, MisTickets)
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

## Modelo de datos

- **Usuario**: id, nombre, email, password_hash, rol (admin/cliente)
- **Evento**: id, nombre, descripcion, fecha, lugar, capacidad, tickets_vendidos, precio
- **Ticket**: id, usuario_id (FK), evento_id (FK), codigo_unico, estado (reservado/pagado/cancelado/usado), fecha_expiracion_reserva

Relaciones: un Usuario tiene muchos Tickets; un Evento tiene muchos Tickets (1 a N en ambos casos).

## Endpoints de la API

### Autenticacion
| Metodo | Ruta | Descripcion | Protegida |
|--------|------|-------------|-----------|
| POST | /api/auth/register | Registra un nuevo usuario | No |
| POST | /api/auth/login | Inicia sesion y devuelve token JWT | No (con rate limit de 5/15min) |
| GET | /api/auth/profile | Devuelve datos del usuario autenticado | Si |

### Eventos
| Metodo | Ruta | Descripcion | Protegida |
|--------|------|-------------|-----------|
| GET | /api/eventos | Lista todos los eventos | No |
| GET | /api/eventos/:id | Detalle de un evento | No |
| POST | /api/eventos | Crea un evento | Si (admin) |
| PUT | /api/eventos/:id | Actualiza un evento | Si (admin) |
| DELETE | /api/eventos/:id | Elimina un evento | Si (admin) |

### Tickets
| Metodo | Ruta | Descripcion | Protegida |
|--------|------|-------------|-----------|
| POST | /api/tickets/comprar | Reserva un ticket (10 min para pagar) | Si |
| GET | /api/tickets/mis-tickets | Lista los tickets del usuario | Si |
| PUT | /api/tickets/:id/confirmar | Confirma el pago de una reserva | Si |

## Instalacion local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# editar .env con los datos de tu base PostgreSQL
npm run start
```
El servidor queda escuchando en `http://localhost:3001`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run start
```
La app queda disponible en `http://localhost:3000`.

> Es necesario tener PostgreSQL instalado y corriendo, con una base de datos creada (por ejemplo `eventos_db`) antes de iniciar el backend. Las tablas se crean automaticamente al arrancar (`sequelize.sync`).

## Seguridad implementada (resumen)

- Contrasenas almacenadas con hash bcrypt (nunca en texto plano).
- Autenticacion stateless con JWT, expiracion de 2 horas.
- Autorizacion por rol (admin vs cliente) en endpoints sensibles.
- Rate limiting diferenciado: 100 req/15min general, 5 req/15min en login, 10 req/min en compra de tickets.
- Headers de seguridad con Helmet (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).
- CORS restringido a una lista blanca de origenes.
- Validacion de entradas con express-validator en todos los formularios.
- Transacciones de base de datos en la compra de tickets para evitar sobreventa (condiciones de carrera).

Ver detalle completo en `INFORME_SEGURIDAD.md`.

## Despliegue

Ver `GUIA_DESPLIEGUE.md` para el paso a paso de despliegue en Render (backend) y Vercel (frontend).

## Video demostracion

Ver `GUION_VIDEO.md` para la estructura sugerida del video de demostracion (max 10 min).

## Autor

Proyecto desarrollado como entrega del Proyecto Integrador - Semana 16, Desarrollo de Aplicaciones Web II.
