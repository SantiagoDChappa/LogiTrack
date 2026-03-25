const { body, validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const getProvinces = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../data/provinces.json'), 'utf8'));

const validateShipment = [
    body('remitenteNombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('remitenteEmail').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('remitenteTelefono').isLength({ min: 8, max: 15 }).withMessage('Teléfono del remitente inválido'),
    body('remitenteDocumento').isLength({ min: 7, max: 11 }).withMessage('Documento del remitente inválido'),

    body('destinatarioNombre').notEmpty().trim().withMessage('El nombre del destinatario es obligatorio'),
    body('destinatarioEmail').isEmail().normalizeEmail().withMessage('Email del destinatario inválido'),
    body('destinatarioTelefono').isLength({ min: 8, max: 15 }).withMessage('Teléfono del destinatario inválido'),
    body('destinatarioDocumento').isLength({ min: 7, max: 11 }).withMessage('Documento del destinatario inválido'),

    body('calle').notEmpty().withMessage('La calle es obligatoria'),
    body('numero').notEmpty().withMessage('La numeración es obligatoria'),
    body('provincia').notEmpty().withMessage('La provincia es obligatoria'),
    body('codigoPostal').notEmpty().withMessage('El código postal es obligatorio'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shipments.json'), 'utf8'));

    const docDestinatario = req.body.destinatarioDocumento;
    const docRemitente    = req.body.remitenteDocumento;

    const errorsArray = errors.array();

    if (data.find(s => s.destinatario.documento === docDestinatario)) {
        errorsArray.push({ msg: 'Ya existe un envío con ese documento de destinatario' });
    }
    if (data.find(s => s.remitente.documento === docRemitente)) {
        errorsArray.push({ msg: 'Ya existe un envío con ese documento de remitente' });
    }

    if (errorsArray.length > 0) {
        return res.render('shipment/new', { errors: errorsArray, body: req.body, provinces: getProvinces() });
    }

    next();
};

module.exports = { validateShipment, handleValidationErrors };
