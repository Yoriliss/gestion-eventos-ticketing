const { Evento } = require('../models');

// GET /api/eventos - publico, lista todos los eventos disponibles
async function listarEventos(req, res) {
  try {
    const eventos = await Evento.findAll({ order: [['fecha', 'ASC']] });
    return res.json(eventos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar eventos' });
  }
}

// GET /api/eventos/:id - detalle de un evento
async function obtenerEvento(req, res) {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    return res.json(evento);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener evento' });
  }
}

// POST /api/eventos - solo admin
async function crearEvento(req, res) {
  try {
    const { nombre, descripcion, fecha, lugar, capacidad, precio } = req.body;
    const evento = await Evento.create({ nombre, descripcion, fecha, lugar, capacidad, precio });
    return res.status(201).json({ mensaje: 'Evento creado', evento });
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear evento', detalle: error.message });
  }
}

// PUT /api/eventos/:id - solo admin
async function actualizarEvento(req, res) {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    await evento.update(req.body);
    return res.json({ mensaje: 'Evento actualizado', evento });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar evento', detalle: error.message });
  }
}

// DELETE /api/eventos/:id - solo admin
async function eliminarEvento(req, res) {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    if (evento.tickets_vendidos > 0) {
      return res.status(409).json({ error: 'No se puede eliminar un evento con tickets vendidos' });
    }
    await evento.destroy();
    return res.json({ mensaje: 'Evento eliminado' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar evento' });
  }
}

module.exports = { listarEventos, obtenerEvento, crearEvento, actualizarEvento, eliminarEvento };
