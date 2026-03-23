const express = require('express');
const path    = require('path');
const app     = express();
const port    = 3000;

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/',                 (req, res) => res.render('index'));
app.get('/dashboard',        (req, res) => res.render('dashboard'));
app.get('/shipments',        (req, res) => res.render('shipment/index'));
app.get('/shipments/new',    (req, res) => res.render('shipment/new'));
app.get('/shipments/detail', (req, res) => res.render('shipment/detail'));
app.get('/users/new',        (req, res) => res.render('user/new'));

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});
