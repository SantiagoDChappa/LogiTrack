'use strict';

/**
 * Tests de integración para las rutas del dashboard (/).
 * Se mockea el modelo de shipment para evitar acceso a la BD.
 */

jest.mock('../../src/models/shipment', () => ({
    Shipment: {},
    getAll:           jest.fn(),
    getById:          jest.fn(),
    create:           jest.fn(),

    search:           jest.fn(),
    existsByDocument: jest.fn(),
    updateStatus:     jest.fn(),
}));

const request   = require('supertest');
const express   = require('express');
const path      = require('path');
const shipmentModel = require('../../src/models/shipment');

function buildApp() {
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.resolve(__dirname, '../../src/views'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
        res.locals.currentUser = { id: 1, fullName: 'Test User', email: 'test@test.com', roleId: 1 };
        next();
    });
    app.use('/', require('../../src/routes/home'));
    return app;
}

// Fábrica de envío mock con la forma que espera el dashboard
function makeMockShipment(statusDescription = 'Pendiente') {
    return {
        id:         1,
        trackingId: 'ENV-001',
        createdAt:  new Date(),
        status:    { id: 1, description: statusDescription },
        sender:    { fullName: 'Juan Perez',  document: '12345678' },
        recipient: { fullName: 'Maria Lopez', document: '87654321' },
        address:   { street: 'Av. Corrientes', number: '1000' },
    };
}

describe('GET /', () => {
    let app;

    beforeAll(() => { app = buildApp(); });

    beforeEach(() => { jest.clearAllMocks(); });

    test('responde 200 con lista vacía de envíos', async () => {
        shipmentModel.getAll.mockResolvedValue([]);

        const res = await request(app).get('/');

        expect(res.status).toBe(200);
    });

    test('responde 200 con envíos activos en tránsito', async () => {
        shipmentModel.getAll.mockResolvedValue([
            makeMockShipment('En Transito'),
            makeMockShipment('En Transito'),
            makeMockShipment('Entregado'),
        ]);

        const res = await request(app).get('/');

        expect(res.status).toBe(200);
    });

    test('llama a shipmentModel.getAll exactamente una vez', async () => {
        shipmentModel.getAll.mockResolvedValue([]);

        await request(app).get('/');

        expect(shipmentModel.getAll).toHaveBeenCalledTimes(1);
    });

    test('responde 500 cuando el modelo lanza un error', async () => {
        shipmentModel.getAll.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/');

        expect(res.status).toBe(500);
    });
});
