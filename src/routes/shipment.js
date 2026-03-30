const express = require('express');
const router = express.Router();
const { home, getDetail, getNewShipmentForm, createShipment, getUpdateShipment, updateShipment, updateShipmentStatus, searchShipments } = require('../controllers/shipment.js');
const { validateShipment, handleValidationErrors } = require('../middlewares/shipment.js');

router.get('/', home);
router.get('/search', searchShipments);
router.get('/new', getNewShipmentForm);
router.post('/new', validateShipment, handleValidationErrors, createShipment);
router.get('/detail/:id', getDetail);
router.get('/update/:id', getUpdateShipment);
router.post('/update/:id', updateShipment);
router.post('/update/:id/status', updateShipmentStatus);

module.exports = router;
