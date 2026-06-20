# Guion sugerido para el video de demostracion (max 10 min)

Puedes grabar la pantalla con la grabadora de Windows (Win+G), OBS Studio, o Loom (gratis).

## 1. Introduccion (1 min)
- Tu nombre, materia y nombre del proyecto.
- Una frase resumiendo el problema: "Una empresa de eventos necesita una plataforma para vender tickets de forma segura, integrando todo lo aprendido en el curso."

## 2. Arquitectura general (1.5 min)
- Muestra el README.md y la estructura de carpetas (backend/frontend).
- Menciona las tecnologias: Node + Express + Sequelize + PostgreSQL + React + JWT.
- Senala rapidamente los 3 modelos: Usuario, Evento, Ticket y su relacion.

## 3. Demo del backend (2.5 min)
- Abre Postman o Thunder Client y muestra en vivo:
  - POST /api/auth/register (crear usuario)
  - POST /api/auth/login (obtener token JWT, muestra el token en la respuesta)
  - GET /api/eventos (lista publica)
  - POST /api/tickets/comprar (con el token en el header Authorization)
  - Intenta 6 logins fallidos seguidos para mostrar el rate limiting bloqueando el 6to intento.

## 4. Demo del frontend (2.5 min)
- Abre la app en el navegador (local o el link desplegado).
- Registra un usuario nuevo.
- Inicia sesion.
- Compra un ticket de un evento.
- Ve a "Mis Tickets" y confirma el pago.

## 5. Seguridad implementada (1.5 min)
- Abre las DevTools del navegador (pestana Network) y muestra los headers de respuesta (busca `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`).
- Menciona brevemente: hashing de contrasenas, JWT, rate limiting, CORS, validacion de entradas.

## 6. Cierre (0.5 min)
- Menciona el link del repositorio en GitHub y el link de la app desplegada.
- Agradece y cierra.

**Tip:** ensaya una vez antes de grabar para no pasarte de los 10 minutos. Si te quedas corto de tiempo, prioriza los puntos 3 y 4 (son los que mas pesan en la rubrica: API RESTful y autenticacion).
