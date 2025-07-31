const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Маршрут для получения списка пользователей
router.get('/', userController.getUsers);

// Маршрут для получения пользователя по ID
router.get('/:id', userController.getUserById);

// Маршрут для обновления пользователя
router.put('/:id', userController.updateUser);

// Маршрут для удаления пользователя
router.delete('/:id', userController.deleteUser);

module.exports = router;