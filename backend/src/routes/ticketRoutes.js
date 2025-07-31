const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Маршрут для получения списка заявок
router.get('/', ticketController.getTickets);

// Маршрут для создания новой заявки
router.post('/', ticketController.createTicket);

// Маршрут для получения заявки по ID
router.get('/:id', ticketController.getTicketById);

// Маршрут для обновления заявки
router.put('/:id', ticketController.updateTicket);

// Маршрут для удаления заявки
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;