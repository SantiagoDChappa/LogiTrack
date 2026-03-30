const express = require('express');
const router = express.Router();
const { getIndex, searchUsers, getCreateUserForm, createUser } = require('../controllers/user.js');
const { validateUser, handleValidationErrors } = require('../middlewares/user.js');

router.get('/',       getIndex)
router.get('/search', searchUsers)
router.get('/new',    getCreateUserForm)
router.post('/new',    validateUser, handleValidationErrors, createUser)

module.exports = router
