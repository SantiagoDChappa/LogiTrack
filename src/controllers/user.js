const userModel = require('../models/user')
const { RoleType } = require('../constants/enums')

const ROLE_LABELS = {
    [RoleType.SUPERVISOR.id]: RoleType.SUPERVISOR.description,
    [RoleType.OPERATOR.id]:   RoleType.OPERATOR.description,
}

const getIndex = (req, res) => {
    res.render('user/index', { users: [], query: {}, roleLabels: ROLE_LABELS, roleTypes: Object.values(RoleType) })
}

const createUser = async (req, res) => {
  try {
    const body = req.body;

    //Creo el envio
    await userModel.create(body)
    
    res.redirect('/user?success=1')
  } catch (err) {
    console.error('ERROR createUser:', err.message)
    res.status(500).send(err.message)
  }
}

const searchUsers = async (req, res) => {
    try {
        const { fullName, document, email, roleId } = req.query
        const users = await userModel.search({
            fullName: fullName || '',
            document: document || '',
            email:    email    || '',
            roleId:   roleId   || ''
        })
        res.render('user/index', {
            users,
            query:      req.query,
            roleLabels: ROLE_LABELS,
            roleTypes:  Object.values(RoleType)
        })
    } catch (err) {
        console.error('ERROR searchUsers:', err.message)
        res.status(500).send(err.message)
    }
}

const getCreateUserForm = (req, res) => {
    res.render('user/new', { body: {}, errors: [], roleTypes: Object.values(RoleType) })
}

module.exports = { getIndex, searchUsers, getCreateUserForm, createUser }
