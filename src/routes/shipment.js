const express = require('express');
const router = express.Router();
const { home, getDetail, getNewShipmentForm, createShipment, searchShipments } = require('../controllers/shipment.js')
const { validateShipment, handleValidationErrors } = require('../middlewares/shipment.js')

router.get('/',           home)
router.get('/search',     searchShipments)
router.get('/new',        getNewShipmentForm)
router.post('/new',       validateShipment, handleValidationErrors, createShipment)
router.get('/detail/:id', getDetail)

module.exports = router
