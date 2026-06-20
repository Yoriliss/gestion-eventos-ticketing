const express = require('express');
const router = express.Router();

const {
  listarEventos,
  obtenerEvento,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/eventoController');
const { verificarToken, soloAdmin } = require('../middleware/auth');
const { validarEvento, manejarErroresValidacion } = require('../middleware/validators');

// Rutas publicas
router.get('/', listarEventos);
router.get('/:id', obtenerEvento);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, soloAdmin, validarEvento, manejarErroresValidacion, crearEvento);
router.put('/:id', verificarToken, soloAdmin, actualizarEvento);
router.delete('/:id', verificarToken, soloAdmin, eliminarEvento);

module.exports = router;
