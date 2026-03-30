const JWT = require('jsonwebtoken');
const userModel = require('../models/user');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.redirect('/login');
    }

    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        res.locals.currentUser = await userModel.getById(payload.id);
        res.setHeader('Cache-Control', 'no-store');
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

module.exports = { requireAuth };
