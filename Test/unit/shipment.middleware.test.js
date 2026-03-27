'use strict';

/**
 * Tests unitarios para el middleware de validación de envíos.
 * Se mockean los modelos para evitar conexiones a la BD.
 */

jest.mock('../../src/models/province', () => ({
    Province: {},
    getAll: jest.fn().mockResolvedValue([
        { id: 1, name: 'Buenos Aires' },
        { id: 2, name: 'Córdoba' },
    ]),
}));

jest.mock('../../src/models/shipment', () => ({
    Shipment: {},
    getAll:           jest.fn(),
    getById:          jest.fn(),
    create:           jest.fn(),
    deleteById:       jest.fn(),
    search:           jest.fn(),
    existsByDocument: jest.fn().mockResolvedValue(false),
    updateStatus:     jest.fn(),
}));

const express = require('express');
const request = require('supertest');
const { validateShipment, handleValidationErrors } = require('../../src/middlewares/shipment');
const shipmentModel = require('../../src/models/shipment');

// App mínima para correr el middleware bajo prueba
function buildApp() {
    const app = express();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.post('/test', validateShipment, handleValidationErrors, (req, res) => {
        res.status(200).json({ ok: true });
    });
    // El middleware renderiza shipment/new en caso de errores, lo reemplazamos
    app.set('view engine', 'ejs');
    app.use((err, req, res, next) => res.status(500).json({ error: err.message }));
    return app;
}

// Cuerpo mínimo válido para crear un envío
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
    number:            '1234',
    province:          '1',
    postalCode:        '1000',
};

describe('Middleware validateShipment', () => {
    let app;

    beforeAll(() => { app = buildApp(); });

    beforeEach(() => {
        jest.clearAllMocks();
        shipmentModel.existsByDocument.mockResolvedValue(false);
    });

    test('pasa la validación con datos correctos', async () => {
        const res = await request(app).post('/test').send(validBody);
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    test('rechaza cuando falta senderName', async () => {
        const body = { ...validBody, senderName: '' };
        // handleValidationErrors llama res.render; interceptamos con un listener de error 500
        // Lo importante es que el handler final (ok:true) NO se ejecute
        const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
            this.status(422).json({ errors: data.errors });
        });

        const res = await request(app).post('/test').send(body);
        expect(res.status).not.toBe(200);
        spy.mockRestore();
    });

    test('rechaza email de remitente inválido', async () => {
        const body = { ...validBody, senderEmail: 'no-es-un-email' };
        const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
            this.status(422).json({ errors: data.errors });
        });

        const res = await request(app).post('/test').send(body);
        expect(res.status).toBe(422);
        const msgs = res.body.errors.map(e => e.msg);
        expect(msgs).toContain('Email del remitente inválido');
        spy.mockRestore();
    });

    test('rechaza teléfono de destinatario demasiado corto', async () => {
        const body = { ...validBody, recipientPhone: '123' };
        const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
            this.status(422).json({ errors: data.errors });
        });

        const res = await request(app).post('/test').send(body);
        expect(res.status).toBe(422);
        const msgs = res.body.errors.map(e => e.msg);
        expect(msgs).toContain('Teléfono del destinatario inválido');
        spy.mockRestore();
    });

    test('rechaza documento de remitente con menos de 7 caracteres', async () => {
        const body = { ...validBody, senderDocument: '123' };
        const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
            this.status(422).json({ errors: data.errors });
        });

        const res = await request(app).post('/test').send(body);
        expect(res.status).toBe(422);
        spy.mockRestore();
    });

    test('rechaza cuando ya existe un envío con ese documento de destinatario', async () => {
        shipmentModel.existsByDocument.mockImplementation(async (doc) => {
            return doc === validBody.recipientDocument;
        });

        const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
            this.status(422).json({ errors: data.errors });
        });

        const res = await request(app).post('/test').send(validBody);
        expect(res.status).toBe(422);
        const msgs = res.body.errors.map(e => e.msg);
        expect(msgs).toContain('Ya existe un envío con ese documento de destinatario');
        spy.mockRestore();
    });

    test('rechaza cuando ya existe un envío con ese documento de remitente', async () => {
        shipmentModel.existsByDocument.mockImplementation(async (doc) => {
            return doc === validBody.senderDocument;
        });

        const spy = jest.spyOn(express.response, 'render').mockImplementation(function (view, data) {
            this.status(422).json({ errors: data.errors });
        });

        const res = await request(app).post('/test').send(validBody);
        expect(res.status).toBe(422);
        const msgs = res.body.errors.map(e => e.msg);
        expect(msgs).toContain('Ya existe un envío con ese documento de remitente');
        spy.mockRestore();
    });
});
