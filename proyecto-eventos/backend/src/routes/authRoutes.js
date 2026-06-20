const express = require('express');
const router = express.Router();

const { registrar, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');
const { limiterLogin } = require('../middleware/rateLimit');
const { validarRegistro, validarLogin, manejarErroresValidacion } = require('../middleware/validators');

router.post('/register', validarRegistro, manejarErroresValidacion, registrar);
router.post('/login', limiterLogin, validarLogin, manejarErroresValidacion, login);
router.get('/profile', verificarToken, perfil);

module.exports = router;
