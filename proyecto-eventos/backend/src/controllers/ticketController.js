const crypto = require('crypto');
const { Ticket, Evento } = require('../models');
const { sequelize } = require('../models');

// POST /api/tickets/comprar - logica de negocio central del proyecto
async function comprarTicket(req, res) {
  const { evento_id } = req.body;

  // Usamos una transaccion para evitar condiciones de carrera
  // (dos usuarios comprando el ultimo ticket disponible al mismo tiempo)
  const transaccion = await sequelize.transaction();

  try {
    const evento = await Evento.findByPk(evento_id, {
      lock: transaccion.LOCK.UPDATE,
      transaction: transaccion,
    });

    if (!evento) {
      await transaccion.rollback();
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (evento.tickets_vendidos >= evento.capacidad) {
      await transaccion.rollback();
      return res.status(409).json({ error: 'Evento agotado, no hay tickets disponibles' });
    }

    const codigo_unico = crypto.randomBytes(8).toString('hex').toUpperCase();

    // La reserva temporal expira en 10 minutos si no se confirma el pago
    const fecha_expiracion_reserva = new Date(Date.now() + 10 * 60 * 1000);

    const ticket = await Ticket.create(
      {
        usuario_id: req.usuario.id,
        evento_id: evento.id,
        codigo_unico,
        estado: 'reservado',
        fecha_expiracion_reserva,
      },
      { transaction: transaccion }
    );

    evento.tickets_vendidos += 1;
    await evento.save({ transaction: transaccion });

    await transaccion.commit();

    return res.status(201).json({
      mensaje: 'Ticket reservado correctamente, confirma el pago antes de que expire',
      ticket,
    });
  } catch (error) {
    await transaccion.rollback();
    return res.status(500).json({ error: 'Error al comprar ticket', detalle: error.message });
  }
}

// GET /api/tickets/mis-tickets - tickets del usuario autenticado
async function misTickets(req, res) {
  try {
    const tickets = await Ticket.findAll({
      where: { usuario_id: req.usuario.id },
      include: [{ model: Evento, as: 'evento' }],
      order: [['createdAt', 'DESC']],
    });
    return res.json(tickets);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener tickets' });
  }
}

// PUT /api/tickets/:id/confirmar - confirma el pago de un ticket reservado
async function confirmarPago(req, res) {
  try {
    const ticket = await Ticket.findOne({
      where: { id: req.params.id, usuario_id: req.usuario.id },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    if (ticket.estado !== 'reservado') {
      return res.status(409).json({ error: 'El ticket no esta en estado de reserva' });
    }

    if (new Date() > ticket.fecha_expiracion_reserva) {
      ticket.estado = 'cancelado';
      await ticket.save();
      return res.status(410).json({ error: 'La reserva expiro, vuelve a comprar el ticket' });
    }

    ticket.estado = 'pagado';
    await ticket.save();

    return res.json({ mensaje: 'Pago confirmado, ticket activo', ticket });
  } catch (error) {
    return res.status(500).json({ error: 'Error al confirmar pago' });
  }
}

module.exports = { comprarTicket, misTickets, confirmarPago };
