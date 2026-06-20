const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { limiterGeneral } = require('./middleware/rateLimit');
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// --- SEGURIDAD (Unidad 9 - OWASP) ---
// Helmet agrega automaticamente headers como X-Frame-Options,
// X-Content-Type-Options, y una politica CSP basica
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
  })
);

// CORS: lista blanca de origenes permitidos (Unidad 8/14)
const origenesPermitidos = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use(
  cors({
    origin: origenesPermitidos,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// Rate limiting general para toda la API
app.use('/api/', limiterGeneral);

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', mensaje: 'API de gestion de eventos funcionando' });
});

// Manejo centralizado de errores no capturados
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
