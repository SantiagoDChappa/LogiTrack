const shipmentModel        = require('../models/shipment');
const personModel          = require('../models/person');
const provinceModel        = require('../models/province');
const addressModel         = require('../models/address');
const statusModel          = require('../models/status');
const shipmentHistoryModel = require('../models/shipmentHistory');
const { PersonType } = require('../constants/enums');


const home = (req, res) => {
    res.render('shipment/index', { shipments: [], query: {} });
};

const searchShipments = async (req, res) => {
    const { trackingId, role, name, document, senderName, senderDocument, recipientName, recipientDocument } = req.query;
    const query = {
        trackingId,
        role,
        name:              name?.trim(),
        document:          document?.trim(),
        senderName:        senderName?.trim(),
        senderDocument:    senderDocument?.trim(),
        recipientName:     recipientName?.trim(),
        recipientDocument: recipientDocument?.trim()
    };
    const shipments = await shipmentModel.search(query);
    res.render('shipment/index', { shipments, query });
};

const getDetail = async (req, res) => {
    const { id } = req.params;
    const shipment = await shipmentModel.getById(id);
    res.render('shipment/detail', { shipment });
};

const getNewShipmentForm = async (req, res) => {
    const provinces = await provinceModel.getAll();    
    res.render('shipment/new', { errors: [], body: {}, provinces });
};

const createShipment = async (req, res) => {
  try {
    const body = req.body;
    //Creo el remitente
    const sender = await personModel.create({
        name:         body.senderName,
        document:     body.senderDocument,
        phone:        body.senderPhone,
        email:        body.senderEmail,
        personTypeId: PersonType.SENDER.id
    });

    //Creo el destinatario
    const recipient = await personModel.create({
        name:         body.recipientName,
        document:     body.recipientDocument,
        phone:        body.recipientPhone,
        email:        body.recipientEmail,
        personTypeId: PersonType.RECIPIENT.id
    });
    //Creo la direccion del envio
    const address = await addressModel.create({
        street:         body.street,
        number:         body.number,
        provinceId:     body.province,
        postalCode:     body.postalCode,
        floorApartment: body.floorApartment
    });

    //Creo el envio
    await shipmentModel.create({ senderId: sender.id, recipientId: recipient.id, addressId: address.id });
    
    res.redirect('/shipment?success=1');
  } catch (err) {
    console.error('ERROR createShipment:', err.message);
    res.status(500).send(err.message);
  }
};

const getUpdateShipment = async (req, res) => {
  const { id }    = req.params;
  const provinces = await provinceModel.getAll();
  const statuses  = await statusModel.getAll();
  const shipment  = await shipmentModel.getById(id);
  const history   = await shipmentHistoryModel.getByShipmentId(id);
  res.render('shipment/update', { errors: [], shipment, provinces, statuses, history });
};

const updateShipment = async (req, res) => {
  try {
    const body = req.body;
    await shipmentModel.update(body);

    res.redirect('/shipment?success=2');
  } catch (err) {
    console.error('ERROR updateShipment:', err.message);
    res.status(500).send(err.message);
  }
};

const updateShipmentStatus = async (req, res) => {
  try {
    const { id }                   = req.params;
    const { newStatusId, comment } = req.body;
    const shipment                 = await shipmentModel.getById(id);

    await shipmentHistoryModel.create({
        shipmentId:   id,
        fromStatusId: shipment.statusId,
        toStatusId:   Number(newStatusId),
        comment:      comment || null
    });

    await shipmentModel.updateStatus(id, Number(newStatusId));

    res.redirect(`/shipment/update/${id}`);
  } catch (err) {
    console.error('ERROR updateShipmentStatus:', err.message);
    res.status(500).send(err.message);
  }
};

module.exports = { home, getDetail, getNewShipmentForm, getUpdateShipment, createShipment, updateShipment, updateShipmentStatus, searchShipments };
