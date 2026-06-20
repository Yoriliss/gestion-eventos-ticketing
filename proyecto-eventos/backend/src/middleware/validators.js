const { body, validationResult } = require('express-validator');

// Reglas de validacion para registro de usuario
const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Email invalido'),
  body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener minimo 6 caracteres'),
];

// Reglas de validacion para login
const validarLogin = [
  body('email').isEmail().withMessage('Email invalido'),
  body('password').notEmpty().withMessage('La contrasena es obligatoria'),
];

// Reglas de validacion para crear evento
const validarEvento = [
  body('nombre').trim().notEmpty().withMessage('El nombre del evento es obligatorio'),
  body('fecha').isISO8601().withMessage('La fecha debe tener formato valido (YYYY-MM-DD)'),
  body('lugar').trim().notEmpty().withMessage('El lugar es obligatorio'),
  body('capacidad').isInt({ min: 1 }).withMessage('La capacidad debe ser un numero entero mayor a 0'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un numero positivo'),
];

// Middleware que revisa si hubo errores de validacion y corta la peticion
function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}

module.exports = { validarRegistro, validarLogin, validarEvento, manejarErroresValidacion };
