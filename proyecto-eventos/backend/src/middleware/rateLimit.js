const rateLimit = require('express-rate-limit');

// Limite general para toda la API publica: 100 peticiones cada 15 min
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo en unos minutos' },
});

// Limite estricto para login: previene ataques de fuerza bruta
const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesion, intenta mas tarde' },
});

// Limite para compra de tickets: evita bots comprando en masa
const limiterCompra = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes de compra, espera un momento' },
});

module.exports = { limiterGeneral, limiterLogin, limiterCompra };
