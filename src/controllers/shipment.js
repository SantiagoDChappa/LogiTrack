const shipmentModel = require('../models/shipment')
const path = require('path')
const fs = require('fs')

const provincesPath = path.join(__dirname, '../data/provinces.json')
const getProvinces = () => JSON.parse(fs.readFileSync(provincesPath, 'utf8'))

const home = (req, res) => {
    res.render('shipment/index', { shipments: [], query: {} })
}

const searchShipments = (req, res) => {
    const { trackingId, rol, nombre, documento, nombreRemitente, documentoRemitente, nombreDestinatario, documentoDestinatario } = req.query
    const query = {
        trackingId:           trackingId?.trim(),
        rol,
        nombre:               nombre?.trim(),
        documento:            documento?.trim(),
        nombreRemitente:      nombreRemitente?.trim(),
        documentoRemitente:   documentoRemitente?.trim(),
        nombreDestinatario:   nombreDestinatario?.trim(),
        documentoDestinatario: documentoDestinatario?.trim()
    }
    const shipments = shipmentModel.search(query)
    res.render('shipment/index', { shipments, query })
}

const getDetail = (req, res) => {
    const { id } = req.query
    const shipment = shipmentModel.getById(id)
    res.render('shipment/detail', { shipment })
}

const getNewShipmentForm = (req, res) => {
    res.render('shipment/new', { errors: [], body: {}, provinces: getProvinces() })
}

const createShipment = (req, res) => {
    shipmentModel.create(req.body)
    res.redirect('/shipments?success=1')
}

module.exports = { home, getDetail, getNewShipmentForm, createShipment, searchShipments }
