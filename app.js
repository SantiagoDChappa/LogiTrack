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

const shipments = [
    { trackingId: 'ABC123', destinatario: 'Juan Perez', estado: 'Pendiente' },
    { trackingId: 'DEF456', destinatario: 'Maria Lopez', estado: 'En tránsito' },
    { trackingId: 'GHI789', destinatario: 'Carlos Gomez', estado: 'Entregado' },
    { trackingId: 'JKL999', destinatario: 'Ana Torres', estado: 'Cancelado' }
];

app.get('/',                 (req, res) => res.render('index'));
app.get('/dashboard',        (req, res) => res.render('dashboard'));
app.get('/shipments', (req, res) => {
    const search = req.query.search;
    const byTracking = req.query.byTracking;
    const byDestinatario = req.query.byDestinatario;

    let useTracking = byTracking === 'on';
    let useDestinatario = byDestinatario === 'on';

    // Si no selecciona nada → usar ambos
    if (!useTracking && !useDestinatario) {
        useTracking = true;
        useDestinatario = true;
    }

    let results = shipments;

    if (search) {
        const searchLower = search.toLowerCase();

        results = shipments.filter(s => {
            const matchTracking = useTracking &&
                s.trackingId.toLowerCase().includes(searchLower);

            const matchDestinatario = useDestinatario &&
                s.destinatario.toLowerCase().includes(searchLower);

            return matchTracking || matchDestinatario;
        });
    }

    res.render('shipment/index', { 
        shipments: results, 
        search,
        useTracking,
        useDestinatario
    });
});
// app.get('/shipments', (req, res) => {
//     const search = req.query.search;

//     let results = shipments;

//     if (search) {
//     results = shipments.filter(s =>
//         s.trackingId.toLowerCase().includes(search.toLowerCase()) ||
//         s.destinatario.toLowerCase().includes(search.toLowerCase())
//     );
//     }

//     res.render('shipment/index', { shipments: results, search });
// });
app.get('/shipments/new',    (req, res) => res.render('shipment/new'));
app.get('/shipments/detail', (req, res) => res.render('shipment/detail'));
app.get('/users/new',        (req, res) => res.render('user/new'));

app.listen(port, () => {
    console.log(`LogiTrack running at http://localhost:${port}`);
});
