const {body, validationResult} = require("express-validator");

const validateShipment = [
    body('remitente_nombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('remitente_email').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('remitente_telefono').isLength(10).withMessage('Teléfono inválido'),

    body('destinatario_nombre').notEmpty().trim().withMessage('El nombre del remitente es obligatorio'),
    body('destinatario_email').isEmail().normalizeEmail().withMessage('Email del remitente inválido'),
    body('destinatario_telefono').isLength(10).withMessage('Teléfono inválido'),

    body('calle').notEmpty().withMessage('La calle es obligatorio'),
    body('numero').notEmpty().withMessage('La numeracion es obligatorio'),
    body('provincia').notEmpty().withMessage('La provincia es obligatorio'),
    body('codigo_postal').notEmpty().withMessage('El Código postal es obligatorio'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('shipment/new', { errors: errors.array() });
    }
    next();
};

module.exports = { validateShipment, handleValidationErrors };