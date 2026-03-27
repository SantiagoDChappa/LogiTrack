const userModel = require('../models/user')

const home = (req, res) => {
    res.render('/login')
}

module.exports = { home }
