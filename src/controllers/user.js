const shipmentHistoryModel = require('../models/shipmentHistory')
const { RoleType } = require('../constants/enums')

const getIndex = (req, res) => {
    res.render('user/index', { shipments: [], query: {} })
}

const getCreateUserForm = (req, res) => {
    res.render('user/new', { shipments: [], query: {} })
}

// const createShipment = async (req, res) => {
//   try {
//     const body = req.body;

//     await shipmentModel.create({ senderId: sender.id, recipientId: recipient.id, addressId: address.id })
    
//     res.redirect('/user?success=1')
//   } catch (err) {
//     console.error('ERROR createShipment:', err.message)
//     res.status(500).send(err.message)
//   }
// }

// const getUpdateShipment = async (req, res) => {
//   const { id }    = req.params
//   const provinces = await provinceModel.getAll()
//   const statuses  = await statusModel.getAll()
//   const shipment  = await shipmentModel.getById(id)
//   const history   = await shipmentHistoryModel.getByShipmentId(id)
//   res.render('shipment/update', { errors: [], shipment, provinces, statuses, history })
// }

// const updateShipment = async (req, res) => {
//   try {
//     const body = req.body;
//     //Creo el envio
//     await shipmentModel.update({ senderId: sender.id, recipientId: recipient.id, addressId: address.id })
    
//     res.redirect('/shipment?success=2')
//   } catch (err) {
//     console.error('ERROR updateShipment:', err.message)
//     res.status(500).send(err.message)
//   }
// }

// const deleteShipment = async (req, res) => {
//   try {
//     const { id } = req.params
//     await shipmentModel.deleteById(id)
    
//     res.redirect('/shipment?success=3')
//   } catch (err) {
//     console.error('ERROR eliminar envio:', err.message)
//     res.status(500).send(err.message)
//   }
// }

// const updateShipmentStatus = async (req, res) => {
//   try {
//     const { id }                   = req.params
//     const { newStatusId, comment } = req.body
//     const shipment                 = await shipmentModel.getById(id)

//     await shipmentHistoryModel.create({
//         shipmentId:   id,
//         fromStatusId: shipment.statusId,
//         toStatusId:   Number(newStatusId),
//         comment:      comment || null
//     });

//     await shipmentModel.updateStatus(id, Number(newStatusId));

//     res.redirect(`/shipment/update/${id}`)
//   } catch (err) {
//     console.error('ERROR updateShipmentStatus:', err.message)
//     res.status(500).send(err.message)
//   }
// }

module.exports = { getIndex, getCreateUserForm }
