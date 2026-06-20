const express = require('express');
const router = express.Router();

const { comprarTicket, misTickets, confirmarPago } = require('../controllers/ticketController');
const { verificarToken } = require('../middleware/auth');
const { limiterCompra } = require('../middleware/rateLimit');

router.post('/comprar', verificarToken, limiterCompra, comprarTicket);
router.get('/mis-tickets', verificarToken, misTickets);
router.put('/:id/confirmar', verificarToken, confirmarPago);

module.exports = router;
