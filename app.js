require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/docs/swagger');
const app     = express();
const port    = process.env.PORT || 3000;
const sequelize = require('./src/database/connection');

const homeRoutes        = require('./src/routes/home');
const shipmentRoutes    = require('./src/routes/shipment');
const userRoutes        = require('./src/routes/user');
const apiShipmentRoutes = require('./src/routes/api/shipments');

// Conecto la base de datos con el sistema
sequelize.sync({ alter: true }) 
    .then(() => console.log('Base de datos conectada y sincronizada'))
    .catch(err => console.error('Error de DB:', err));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/shipment', shipmentRoutes);
app.use('/api/shipments', apiShipmentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});
