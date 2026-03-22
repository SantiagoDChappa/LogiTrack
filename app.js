const express = require('express');
const path    = require('path');
const app     = express();
const port    = 3000;
const shipmentRoutes = require('./src/routes/shipment')
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/',                 (req, res) => res.render('index.ejs'));
app.get('/dashboard',        (req, res) => res.render('dashboard'));
app.use('/shipments', shipmentRoutes);
app.get('/user/new', (req, res) => res.render('user/new'));

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});
