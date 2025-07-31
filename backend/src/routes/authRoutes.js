const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Маршрут для регистрации пользователя
router.post('/register', authController.register);

// Маршрут для входа пользователя
router.post('/login', authController.login);

// Маршрут для выхода пользователя
router.post('/logout', authController.logout);

module.exports = router;