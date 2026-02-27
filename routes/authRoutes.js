const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register → register function run agum
router.post('/register', register);

// POST /api/auth/login → login function run agum
router.post('/login', login);

module.exports = router;