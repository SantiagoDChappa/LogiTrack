const express = require('express');
const router = express.Router();
const { getIndex } = require('../controllers/user.js');

router.get('/', getIndex)

module.exports = router
