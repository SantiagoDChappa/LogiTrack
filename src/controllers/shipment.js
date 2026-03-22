const shipmentModel = require('../models/shipment')
const path = require('path')
const fs = require('fs')

const provincesPath = path.join(__dirname, '../data/provinces.json')
const getProvinces = () => JSON.parse(fs.readFileSync(provincesPath, 'utf8'))

const getIndex = (req, res) => {
    const shipments = shipmentModel.getAll()
    res.render('shipment/index', { shipments: shipments })
}

const getDetail = (req, res) => {
    res.render('shipment/detail')
}

const getNewShipmentForm = (req, res) => {
    res.render('shipment/new', { errors: [], body: {}, provinces: getProvinces() })
}

const createShipment = (req, res) => {
    shipmentModel.create(req.body)
    res.redirect('/shipments?success=1')
}

module.exports = { getIndex, getDetail, getNewShipmentForm, createShipment }