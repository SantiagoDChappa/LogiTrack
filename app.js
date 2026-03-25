require('dotenv').config();
const express = require('express');
const path    = require('path');
const app     = express();
const port    = process.env.PORT || 3000;
const homeRoutes = require('./src/routes/home')
const shipmentRoutes = require('./src/routes/shipment')

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRoutes);
app.use('/shipments', shipmentRoutes);

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});
