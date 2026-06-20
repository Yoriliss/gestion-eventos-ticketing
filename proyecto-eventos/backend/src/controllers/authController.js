const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /api/auth/register
async function registrar(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ error: 'El email ya esta registrado' });
    }

    // Nunca se guarda la contrasena en texto plano (OWASP - Unidad 9)
    const password_hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password_hash,
      rol: 'cliente',
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      mensaje: 'Inicio de sesion exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar sesion', detalle: error.message });
  }
}

// GET /api/auth/profile (ruta protegida)
async function perfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id', 'nombre', 'email', 'rol'],
    });
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
}

// POST /api/auth/promover-admin (endpoint temporal protegido por clave secreta,
// util para el primer despliegue cuando no se tiene acceso a Shell)
async function promoverAdmin(req, res) {
  try {
    const { email, clave } = req.body;

    if (clave !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ error: 'Clave invalida' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.rol = 'admin';
    await usuario.save();

    return res.json({ mensaje: `Usuario ${email} ahora es admin` });
  } catch (error) {
    return res.status(500).json({ error: 'Error al promover usuario' });
  }
}

module.exports = { registrar, login, perfil, promoverAdmin };
