const express = require('express');
const path    = require('path');
const app     = express();
const port    = 3000;

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/',              (req, res) => res.render('index'));
app.get('/dashboard',     (req, res) => res.render('dashboard'));
app.get('/envios/alta',   (req, res) => res.render('envio/alta'));
app.get('/envios/detalle',(req, res) => res.render('envio/detalle'));
app.get('/envios/listado',     (req, res) => res.render('envio/listado'));

app.listen(port, () => {
    console.log(`LogiTrack corriendo en http://localhost:${port}`);
});
