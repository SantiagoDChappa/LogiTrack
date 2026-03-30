const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const userModel = require('../models/user');

const getLogin = async (req, res) => {
    return res.render('login',);
};

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await userModel.findByEmail(email);
    if(!user){
        return res.render('login', { error: 'Email o contraseña incorrectos'});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.render('login', { error: 'Email o contraseña incorrectos'});
    }

    const token = JWT.sign(
        {id: user.id, email: user.email, roleId: user.roleId, fullName: user.fullName},
        process.env.JWT_SECRET,
        {expiresIn: '8h'}
    );

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 8*60*60*1000 // 8HS
    });

    res.redirect('/');
};

module.exports = { getLogin, login };