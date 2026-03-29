const { body, validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const getProvinces = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../data/provinces.json'), 'utf8'));

const validateShipment = [
    body('senderName').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('senderEmail').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('senderPhone').isLength({ min: 8, max: 15 }).withMessage('Teléfono del remitente inválido'),
    body('senderDocument').isLength({ min: 7, max: 11 }).withMessage('Documento del remitente inválido'),

    body('recipientName').notEmpty().trim().withMessage('El nombre del destinatario es obligatorio'),
    body('recipientEmail').isEmail().normalizeEmail().withMessage('Email del destinatario inválido'),
    body('recipientPhone').isLength({ min: 8, max: 15 }).withMessage('Teléfono del destinatario inválido'),
    body('recipientDocument').isLength({ min: 7, max: 11 }).withMessage('Documento del destinatario inválido'),

    body('street').notEmpty().withMessage('La calle es obligatoria'),
    body('number').notEmpty().withMessage('La numeración es obligatoria'),
    body('province').notEmpty().withMessage('La provincia es obligatoria'),
    body('postalCode').notEmpty().withMessage('El código postal es obligatorio'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/shipments.json'), 'utf8'));

    const recipientDoc = req.body.recipientDocument;
    const senderDoc    = req.body.senderDocument;

    const errorsArray = errors.array();

    if (data.find(s => s.recipient.document === recipientDoc)) {
        errorsArray.push({ msg: 'Ya existe un envío con ese documento de destinatario' });
    }
    if (data.find(s => s.sender.document === senderDoc)) {
        errorsArray.push({ msg: 'Ya existe un envío con ese documento de remitente' });
    }

    if (errorsArray.length > 0) {
        return res.render('shipment/new', { errors: errorsArray, body: req.body, provinces: getProvinces() });
    }

    next();
};

module.exports = { validateShipment, handleValidationErrors };
