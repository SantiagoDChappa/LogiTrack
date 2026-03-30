const express = require('express');
const router = express.Router();
const { getLogin, login } = require('../controllers/auth.js');

router.get('/login', getLogin);
router.post('/login', login);

module.exports = router;