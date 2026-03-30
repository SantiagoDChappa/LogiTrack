'use strict';

/**
 * Tests de integración para las rutas de /shipment.
 * Se mockean todos los modelos para evitar acceso a la BD.
 */

jest.mock('../../src/models/shipment', () => ({
    Shipment: {},
    getAll:           jest.fn(),
    getById:          jest.fn(),
    create:           jest.fn(),

    search:           jest.fn(),
    existsByDocument: jest.fn().mockResolvedValue(false),
    updateStatus:     jest.fn(),
}));

jest.mock('../../src/models/person', () => ({
    Person: {},
    getAll:  jest.fn(),
    create:  jest.fn(),
    search:  jest.fn(),
}));

jest.mock('../../src/models/province', () => ({
    Province: {},
    getAll: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/models/address', () => ({
    Address: {},
    create:  jest.fn(),
}));

jest.mock('../../src/models/status', () => ({
    Status: {},
    getAll: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/models/shipmentHistory', () => ({
    ShipmentHistory: {},
    create:            jest.fn(),
    getByShipmentId:   jest.fn().mockResolvedValue([]),
}));

const request  = require('supertest');
const express  = require('express');
const path     = require('path');

const shipmentModel        = require('../../src/models/shipment');
const personModel          = require('../../src/models/person');
const addressModel         = require('../../src/models/address');
const shipmentHistoryModel = require('../../src/models/shipmentHistory');

function buildApp() {
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.resolve(__dirname, '../../src/views'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/shipment', require('../../src/routes/shipment'));
    return app;
}

// Envío mock completo para las vistas que necesitan datos estructurados
const mockShipment = {
    id:         1,
    trackingId: 'ENV-001',
    statusId:   1,
    createdAt:  new Date('2024-01-15'),
    status:    { id: 1, description: 'Pendiente' },
    sender:    {
        id: 1, fullName: 'Juan Perez', document: '12345678',
        phone: '1234567890', email: 'juan@test.com',
    },
    recipient: {
        id: 2, fullName: 'Maria Lopez', document: '87654321',
        phone: '0987654321', email: 'maria@test.com',
    },
    address: {
        id: 1, street: 'Av. Corrientes', number: '1000',
        postalCode: '1000', floorApartment: '',
        province: { id: 1, name: 'Buenos Aires' },
    },
};

describe('Rutas /shipment', () => {
    let app;

    beforeAll(() => { app = buildApp(); });

    beforeEach(() => {
        jest.clearAllMocks();
        shipmentModel.existsByDocument.mockResolvedValue(false);
    });

    // ── GET /shipment ──────────────────────────────────────────────────────

    describe('GET /shipment', () => {
        test('responde 200 y renderiza la vista index', async () => {
            const res = await request(app).get('/shipment');
            expect(res.status).toBe(200);
        });
    });

    // ── GET /shipment/search ───────────────────────────────────────────────

    describe('GET /shipment/search', () => {
        test('responde 200 con resultados vacíos', async () => {
            shipmentModel.search.mockResolvedValue([]);

            const res = await request(app).get('/shipment/search');

            expect(res.status).toBe(200);
            expect(shipmentModel.search).toHaveBeenCalledTimes(1);
        });

        test('llama a search con los parámetros del query', async () => {
            shipmentModel.search.mockResolvedValue([]);

            await request(app).get('/shipment/search?trackingId=ENV-001&role=sender');

            expect(shipmentModel.search).toHaveBeenCalledWith(
                expect.objectContaining({ trackingId: 'ENV-001', role: 'sender' })
            );
        });

        test('responde 200 con envíos encontrados', async () => {
            shipmentModel.search.mockResolvedValue([mockShipment]);

            const res = await request(app).get('/shipment/search?trackingId=ENV-001');

            expect(res.status).toBe(200);
        });
    });

    // ── GET /shipment/new ──────────────────────────────────────────────────

    describe('GET /shipment/new', () => {
        test('responde 200 y carga las provincias', async () => {
            const { getAll } = require('../../src/models/province');
            getAll.mockResolvedValue([{ id: 1, name: 'Buenos Aires' }]);

            const res = await request(app).get('/shipment/new');

            expect(res.status).toBe(200);
            expect(getAll).toHaveBeenCalledTimes(1);
        });
    });

    // ── POST /shipment/new ─────────────────────────────────────────────────

    describe('POST /shipment/new', () => {
        const validBody = {
            senderName:        'Juan Perez',
            senderEmail:       'juan@test.com',
            senderPhone:       '1234567890',
            senderDocument:    '12345678',
            recipientName:     'Maria Lopez',
            recipientEmail:    'maria@test.com',
            recipientPhone:    '0987654321',
            recipientDocument: '87654321',
            street:            'Av. Corrientes',
            number:            '1000',
            province:          '1',
            postalCode:        '1000',
        };

        test('redirige a /shipment?success=1 con datos válidos', async () => {
            personModel.create
                .mockResolvedValueOnce({ id: 1 }) // sender
                .mockResolvedValueOnce({ id: 2 }); // recipient
            addressModel.create.mockResolvedValue({ id: 1 });
            shipmentModel.create.mockResolvedValue({ id: 1, trackingId: 'ENV-001' });

            const res = await request(app).post('/shipment/new').send(validBody);

            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/shipment?success=1');
        });

        test('vuelve a renderizar el formulario con errores de validación', async () => {
            const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
                this.status(422).json({ errors: data.errors });
            });

            const res = await request(app)
                .post('/shipment/new')
                .send({ ...validBody, senderEmail: 'no-es-email' });

            expect(res.status).toBe(422);
            spy.mockRestore();
        });

        test('no crea el envío cuando hay errores de validación', async () => {
            const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
                this.status(422).json({ errors: data.errors });
            });

            await request(app)
                .post('/shipment/new')
                .send({ ...validBody, senderDocument: '123' }); // demasiado corto

            expect(shipmentModel.create).not.toHaveBeenCalled();
            spy.mockRestore();
        });
    });

    // ── GET /shipment/detail/:id ───────────────────────────────────────────

    describe('GET /shipment/detail/:id', () => {
        test('responde 200 cuando el envío existe', async () => {
            shipmentModel.getById.mockResolvedValue(mockShipment);

            const res = await request(app).get('/shipment/detail/1');

            expect(res.status).toBe(200);
            expect(shipmentModel.getById).toHaveBeenCalledWith('1');
        });
    });

    // ── GET /shipment/update/:id ───────────────────────────────────────────

    describe('GET /shipment/update/:id', () => {
        test('responde 200 y carga los datos del envío', async () => {
            const { getAll: provinceGetAll } = require('../../src/models/province');
            const { getAll: statusGetAll }   = require('../../src/models/status');

            shipmentModel.getById.mockResolvedValue(mockShipment);
            provinceGetAll.mockResolvedValue([]);
            statusGetAll.mockResolvedValue([]);
            shipmentHistoryModel.getByShipmentId.mockResolvedValue([]);

            const res = await request(app).get('/shipment/update/1');

            expect(res.status).toBe(200);
        });
    });

    // ── POST /shipment/update/:id/status ──────────────────────────────────

    describe('POST /shipment/update/:id/status', () => {
        test('actualiza el estado y redirige al formulario de edición', async () => {
            shipmentModel.getById.mockResolvedValue(mockShipment);
            shipmentHistoryModel.create.mockResolvedValue({});
            shipmentModel.updateStatus.mockResolvedValue([1]);

            const res = await request(app)
                .post('/shipment/update/1/status')
                .send({ newStatusId: '2', comment: 'En camino' });

            expect(res.status).toBe(302);
            expect(res.headers.location).toBe('/shipment/update/1');
            expect(shipmentModel.updateStatus).toHaveBeenCalledWith('1', 2);
        });
    });


});
