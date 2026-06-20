const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Evento = require('./Evento');
const Ticket = require('./Ticket');

// RELACIONES (Unidad 7 - ORM)
// Un usuario puede tener muchos tickets
Usuario.hasMany(Ticket, { foreignKey: 'usuario_id', as: 'tickets' });
Ticket.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Un evento puede tener muchos tickets
Evento.hasMany(Ticket, { foreignKey: 'evento_id', as: 'tickets' });
Ticket.belongsTo(Evento, { foreignKey: 'evento_id', as: 'evento' });

module.exports = { sequelize, Usuario, Evento, Ticket };
