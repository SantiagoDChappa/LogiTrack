const shipmentModel = require('../models/shipment')

const getIndex = (req, res) => {
    const shipments = shipmentModel.getAll()

    const estadoNorm = (s) => s.estado.toLowerCase().replace(/\s/g, '_')

    const enviosActivos  = shipments.filter(s => estadoNorm(s) === 'en_transito').length
    const entregasHoy    = shipments.filter(s => estadoNorm(s) === 'entregado').length
    const alertasDemora  = shipments.filter(s => estadoNorm(s) === 'retrasado').length
    const registrosNuevos = shipments.length

    const ultimaActividad = shipments.slice(-5).reverse()

    res.render('dashboard', { enviosActivos, entregasHoy, alertasDemora, registrosNuevos, ultimaActividad })
}

module.exports = { getIndex }