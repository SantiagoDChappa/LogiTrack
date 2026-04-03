require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const app     = express();
const port    = process.env.PORT || 3000;

const sequelize = require('./src/database/connection');
const swaggerSpec = require('./src/docs/swagger');
const { requireAuth, requireSupervisor } = require('./src/middlewares/auth');

const homeRoutes        = require('./src/routes/home');
const shipmentRoutes    = require('./src/routes/shipment');
const userRoutes        = require('./src/routes/user');
const apiShipmentRoutes = require('./src/routes/api/shipments');
const apiHealthRoutes = require('./src/routes/api/health');
const authRoutes = require('./src/routes/auth');

// Conecto la base de datos con el sistema
sequelize.sync({ alter: true }) 
    .then(() => console.log('Base de datos conectada y sincronizada'))
    .catch(err => console.error('Error de DB:', err));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rutas Publicas
app.use('/', authRoutes);


app.use(apiHealthRoutes);

// Rutas Protegidas
app.use('/', requireAuth, homeRoutes);
app.use('/user', requireAuth, requireSupervisor, userRoutes);
app.use('/shipment',  requireAuth, shipmentRoutes);
app.use('/api/shipments',  requireAuth, requireSupervisor, apiShipmentRoutes);
app.use('/api-docs',  requireAuth, requireSupervisor, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
            return res.redirect('/');
        } catch {
            res.clearCookie('token');
        }
    }
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});

module.exports = app;
