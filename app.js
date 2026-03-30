require('dotenv').config();
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;
const sequelize = require('./src/database/connection');

const homeRoutes = require('./src/routes/home')
const shipmentRoutes = require('./src/routes/shipment')

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
app.use('/shipment', shipmentRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});
