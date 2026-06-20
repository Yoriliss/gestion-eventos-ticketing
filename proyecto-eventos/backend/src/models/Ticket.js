const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo_unico: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  estado: {
    type: DataTypes.ENUM('reservado', 'pagado', 'cancelado', 'usado'),
    defaultValue: 'reservado',
  },
  fecha_compra: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_expiracion_reserva: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'tickets',
  timestamps: true,
});

module.exports = Ticket;
