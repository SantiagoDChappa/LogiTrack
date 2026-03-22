const {body, validationResult} = require("express-validator");
const path = require('path');
const fs = require('fs');

const validateShipment = [
    body('remitente_nombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('remitente_email').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('remitente_telefono').isLength(10).withMessage('Teléfono inválido'),
    body('remitente_documento').isLength(10).withMessage('Teléfono inválido'),

    body('destinatario_nombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('destinatario_email').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('destinatario_telefono').isLength(10).withMessage('Teléfono inválido'),
    body('destinatario_documento').isLength(10).withMessage('Teléfono inválido'),

    body('calle').notEmpty().withMessage('La calle es obligatorio'),
    body('numero').notEmpty().withMessage('La numeracion es obligatorio'),
    body('provincia').notEmpty().withMessage('La provincia es obligatorio'),
    body('codigo_postal').notEmpty().withMessage('El Código postal es obligatorio'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    const dataPath = path.join(__dirname, '../data/shipments.json')
    const data =  JSON.parse(fs.readFileSync(dataPath, 'utf8'));    
    
    // Me obtengo el documento del formulario y verifico que no exista
    const documentoDestinatario = req.body.destinatario_documento;
    const documentoRemitente = req.body.remitente_documento;
    if(data.find(shipment => shipment.destinatario.documento === documentoDestinatario)){
        return res.render('shipment/new', { errors: errors.array(), body: req.body });
    }else if(data.find(shipment => shipment.remitente.documento === documentoRemitente)){
        return res.render('shipment/new', { errors: errors.array(), body: req.body });
    }

    if (!errors.isEmpty()) {
        return res.render('shipment/new', { errors: errors.array(), body: req.body });
    }
    
    
    next();
};

module.exports = { validateShipment, handleValidationErrors };