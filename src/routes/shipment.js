const express = require('express');
const router = express.Router();
const { getIndex, getDetail, getNewShipmentForm, createShipment } = require('../controllers/shipment.js');
const { validateShipment, handleValidationErrors } = require('../middlewares/shipment.js');

router.get('/', getIndex)
router.get('/detail', getDetail)
router.get('/new', getNewShipmentForm)
router.post('/new', validateShipment, handleValidationErrors, createShipment)

module.exports = router