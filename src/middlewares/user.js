const { body, validationResult } = require("express-validator");
const userModel = require("../models/user");
const { RoleType } = require("../constants/enums");

const validateUser = [
    body('fullName').notEmpty().trim().withMessage('El nombre y apellido es obligatorio'),
    body('email').isEmail().normalizeEmail().withMessage('El email es inválido'),
    body('document').isInt({ min: 1000000 }).withMessage('El documento es inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    body('roleId').notEmpty().withMessage('El rol es obligatorio'),
];

const handleValidationErrors = async (req, res, next) => {
    const errors = validationResult(req);
    const document = req.body.document;
    const email = req.body.email;

    const errorsArray = errors.array();

    if (!errorsArray.some(e => e.path === 'document') && await userModel.existsByDocument(document)) {
        errorsArray.push({ msg: 'Ya existe un usuario con ese documento' });
    }

    if (!errorsArray.some(e => e.path === 'email') && await userModel.existsByEmail(email)) {
        errorsArray.push({ msg: 'Ya existe un usuario con ese correo electronico' });
    }

    if (errorsArray.length > 0) {
        return res.render('user/new', {
            errors:    errorsArray,
            body:      req.body,
            roleTypes: Object.values(RoleType)
        });
    }

    next();
};

const validateUpdateUser = [
    body('fullName').notEmpty().trim().withMessage('El nombre y apellido es obligatorio'),
    body('email').isEmail().normalizeEmail().withMessage('El email es inválido'),
    body('document').isInt({ min: 1000000 }).withMessage('El documento es inválido'),
    body('roleId').notEmpty().withMessage('El rol es obligatorio'),
];

const handleUpdateValidationErrors = async (req, res, next) => {
    const errors   = validationResult(req);
    const { id }   = req.params;
    const document = req.body.document;
    const email    = req.body.email;

    const errorsArray = errors.array();

    if (!errorsArray.some(e => e.path === 'document') && await userModel.existsByDocumentExcluding(document, id)) {
        errorsArray.push({ msg: 'Ya existe un usuario con ese documento' });
    }

    if (!errorsArray.some(e => e.path === 'email') && await userModel.existsByEmailExcluding(email, id)) {
        errorsArray.push({ msg: 'Ya existe un usuario con ese correo electronico' });
    }

    if (errorsArray.length > 0) {
        const user = { ...req.body, id };
        return res.render('user/update', {
            errors:   errorsArray,
            user,
            RoleType: require('../constants/enums').RoleType
        });
    }

    next();
};

module.exports = { validateUser, handleValidationErrors, validateUpdateUser, handleUpdateValidationErrors };
