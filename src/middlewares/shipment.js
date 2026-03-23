const {body, validationResult} = require("express-validator");
const path = require('path');
const fs = require('fs');
const getProvinces = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../data/provinces.json'), 'utf8'));

const validateShipment = [
    body('remitente_nombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('remitente_email').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('remitente_telefono').isLength(10).withMessage('Teléfono del remitente inválido'),
    body('remitente_documento').isLength(10).withMessage('Documento del remitente inválido'),

    body('destinatario_nombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('destinatario_email').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('destinatario_telefono').isLength(10).withMessage('Teléfono del remitente inválido'),
    body('destinatario_documento').isLength(10).withMessage('Documento del destinatario inválido'),

    body('calle').notEmpty().withMessage('La calle es obligatorio'),
    body('numero').notEmpty().withMessage('La numeracion es obligatorio'),
    body('provincia').notEmpty().withMessage('La provincia es obligatorio'),
    body('codigo_postal').notEmpty().withMessage('El Código postal es obligatorio'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shipments.json'), 'utf8'));

    const documentoDestinatario = req.body.destinatario_documento;
    const documentoRemitente = req.body.remitente_documento;

    const errorsArray = errors.array();

    if (data.find(shipment => shipment.destinatario.documento === documentoDestinatario)) {
        errorsArray.push({ msg: 'Ya existe un envío con ese documento de destinatario' });
    }
    if (data.find(shipment => shipment.remitente.documento === documentoRemitente)) {
        errorsArray.push({ msg: 'Ya existe un envío con ese documento de remitente' });
    }

    if (errorsArray.length > 0) {
        return res.render('shipment/new', { errors: errorsArray, body: req.body, provinces: getProvinces() });
    }

    next();
};

module.exports = { validateShipment, handleValidationErrors };