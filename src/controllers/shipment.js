const shipmentModel = require('../models/shipment')

const getIndex = (req, res) => {
    const shipments = shipmentModel.getAll()
    res.render('shipment/index', { shipments: shipments })
}

const getDetail = (req, res) => {
    res.render('shipment/detail')
}

const getNewShipmentForm = (req, res) => {
    res.render('shipment/new', { errors: [] })
}

const createShipment = (req, res) => {
    shipmentModel.create(req.body)
    res.redirect('/shipments')
}

module.exports = { getIndex, getDetail, getNewShipmentForm, createShipment }