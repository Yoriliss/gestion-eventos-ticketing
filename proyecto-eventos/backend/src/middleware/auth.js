const jwt = require('jsonwebtoken');

// Verifica que la peticion traiga un token JWT valido (Unidad 8 - APIs)
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, email, rol }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
}

// Verifica que el usuario autenticado tenga rol admin
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
