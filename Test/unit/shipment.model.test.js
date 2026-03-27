'use strict';

/**
 * Mocks del módulo de conexión a la BD.
 * Se crean instancias de modelos separadas para cada nombre de tabla,
 * accesibles después vía db.__getInstance(name).
 */
jest.mock('../../src/database/connection', () => {
    const instances = {};

    return {
        define: jest.fn((name) => {
            instances[name] = {
                findOne:  jest.fn(),
                findAll:  jest.fn(),
                create:   jest.fn(),
                update:   jest.fn(),
                destroy:  jest.fn(),
                belongsTo: jest.fn(),
            };
            return instances[name];
        }),
        // Permite acceder a la instancia mock de cada modelo desde los tests
        __getInstance: (name) => instances[name],
        sync: jest.fn().mockResolvedValue(null),
    };
});

const db = require('../../src/database/connection');
// Al requerir shipment, se registran también person, status y address
const shipmentModel = require('../../src/models/shipment');

describe('Modelo Shipment - funciones', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ── create ─────────────────────────────────────────────────────────────

    describe('create()', () => {
        test('debe generar trackingId ENV-001 cuando no existen envíos previos', async () => {
            db.__getInstance('shipment').findOne.mockResolvedValue(null);
            db.__getInstance('shipment').create.mockResolvedValue({ id: 1, trackingId: 'ENV-001' });

            await shipmentModel.create({ senderId: 1, recipientId: 2, addressId: 3 });

            expect(db.__getInstance('shipment').create).toHaveBeenCalledWith(
                expect.objectContaining({ trackingId: 'ENV-001', statusId: 1 })
            );
        });

        test('debe incrementar el trackingId basándose en el último id', async () => {
            db.__getInstance('shipment').findOne.mockResolvedValue({ id: 9 });
            db.__getInstance('shipment').create.mockResolvedValue({ id: 10, trackingId: 'ENV-010' });

            await shipmentModel.create({ senderId: 1, recipientId: 2, addressId: 3 });

            expect(db.__getInstance('shipment').create).toHaveBeenCalledWith(
                expect.objectContaining({ trackingId: 'ENV-010' })
            );
        });

        test('debe asignar statusId 1 (Pendiente) al crear un envío', async () => {
            db.__getInstance('shipment').findOne.mockResolvedValue(null);
            db.__getInstance('shipment').create.mockResolvedValue({ id: 1 });

            await shipmentModel.create({ senderId: 5, recipientId: 6, addressId: 7 });

            expect(db.__getInstance('shipment').create).toHaveBeenCalledWith(
                expect.objectContaining({ statusId: 1, senderId: 5, recipientId: 6, addressId: 7 })
            );
        });
    });

    // ── existsByDocument ────────────────────────────────────────────────────

    describe('existsByDocument()', () => {
        test('debe retornar false cuando el documento es null', async () => {
            const result = await shipmentModel.existsByDocument(null);
            expect(result).toBe(false);
            expect(db.__getInstance('person').findOne).not.toHaveBeenCalled();
        });

        test('debe retornar false cuando el documento es undefined', async () => {
            const result = await shipmentModel.existsByDocument(undefined);
            expect(result).toBe(false);
        });

        test('debe retornar false cuando la persona no existe en la BD', async () => {
            db.__getInstance('person').findOne.mockResolvedValue(null);

            const result = await shipmentModel.existsByDocument('12345678');

            expect(result).toBe(false);
            expect(db.__getInstance('shipment').findOne).not.toHaveBeenCalled();
        });

        test('debe retornar false cuando la persona existe pero no tiene envíos', async () => {
            db.__getInstance('person').findOne.mockResolvedValue({ id: 1 });
            db.__getInstance('shipment').findOne.mockResolvedValue(null);

            const result = await shipmentModel.existsByDocument('12345678');

            expect(result).toBe(false);
        });

        test('debe retornar true cuando la persona tiene un envío asociado', async () => {
            db.__getInstance('person').findOne.mockResolvedValue({ id: 1 });
            db.__getInstance('shipment').findOne.mockResolvedValue({ id: 10 });

            const result = await shipmentModel.existsByDocument('12345678');

            expect(result).toBe(true);
        });
    });

    // ── updateStatus ────────────────────────────────────────────────────────

    describe('updateStatus()', () => {
        test('debe llamar a Shipment.update con el nuevo estado y el id', async () => {
            db.__getInstance('shipment').update.mockResolvedValue([1]);

            await shipmentModel.updateStatus(5, 3);

            expect(db.__getInstance('shipment').update).toHaveBeenCalledWith(
                { statusId: 3 },
                { where: { id: 5 } }
            );
        });
    });

    // ── deleteById ──────────────────────────────────────────────────────────

    describe('deleteById()', () => {
        test('debe llamar a Shipment.destroy con el id correcto', async () => {
            db.__getInstance('shipment').destroy.mockResolvedValue(1);

            await shipmentModel.deleteById(7);

            expect(db.__getInstance('shipment').destroy).toHaveBeenCalledWith(
                { where: { id: 7 } }
            );
        });
    });

    // ── getAll / getById ────────────────────────────────────────────────────

    describe('getAll()', () => {
        test('debe retornar todos los envíos devueltos por Sequelize', async () => {
            const mockShipments = [{ id: 1 }, { id: 2 }];
            db.__getInstance('shipment').findAll.mockResolvedValue(mockShipments);

            const result = await shipmentModel.getAll();

            expect(result).toEqual(mockShipments);
            expect(db.__getInstance('shipment').findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getById()', () => {
        test('debe retornar el envío correspondiente al id', async () => {
            const mockShipment = { id: 3, trackingId: 'ENV-003' };
            db.__getInstance('shipment').findOne.mockResolvedValue(mockShipment);

            const result = await shipmentModel.getById(3);

            expect(result).toEqual(mockShipment);
        });

        test('debe retornar null cuando el envío no existe', async () => {
            db.__getInstance('shipment').findOne.mockResolvedValue(null);

            const result = await shipmentModel.getById(999);

            expect(result).toBeNull();
        });
    });
});
