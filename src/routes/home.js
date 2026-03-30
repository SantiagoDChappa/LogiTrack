const express = require('express');
const router = express.Router();
const { getIndex, getLogin } = require('../controllers/home.js');

router.get('/', getIndex);
router.get('/login', getLogin);

module.exports = router;
