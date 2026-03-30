'use strict';

const { Status, PersonType, RoleType } = require('../../src/constants/enums');

describe('Enums', () => {

    describe('Status', () => {
        test('debe tener todos los estados requeridos', () => {
            expect(Status.PENDING).toBeDefined();
            expect(Status.IN_TRANSIT).toBeDefined();
            expect(Status.AT_BRANCH).toBeDefined();
            expect(Status.DELIVERED).toBeDefined();
            expect(Status.CANCELLED).toBeDefined();
        });

        test('debe tener los ids correctos', () => {
            expect(Status.PENDING.id).toBe(1);
            expect(Status.IN_TRANSIT.id).toBe(2);
            expect(Status.AT_BRANCH.id).toBe(3);
            expect(Status.DELIVERED.id).toBe(4);
            expect(Status.CANCELLED.id).toBe(5);
        });

        test('debe tener las descripciones correctas', () => {
            expect(Status.PENDING.description).toBe('Pendiente');
            expect(Status.IN_TRANSIT.description).toBe('En Transito');
            expect(Status.AT_BRANCH.description).toBe('En Sucursal');
            expect(Status.DELIVERED.description).toBe('Entregado');
            expect(Status.CANCELLED.description).toBe('Cancelado');
        });

        test('debe ser inmutable (Object.freeze)', () => {
            expect(Object.isFrozen(Status)).toBe(true);
        });

        test('no debe permitir agregar nuevas propiedades', () => {
            expect(() => { Status.NEW_STATE = { id: 6 }; }).toThrow();
        });
    });

    describe('PersonType', () => {
        test('debe tener SENDER y RECIPIENT', () => {
            expect(PersonType.SENDER).toBeDefined();
            expect(PersonType.RECIPIENT).toBeDefined();
        });

        test('debe tener los ids correctos', () => {
            expect(PersonType.SENDER.id).toBe(1);
            expect(PersonType.RECIPIENT.id).toBe(2);
        });

        test('debe tener las descripciones correctas', () => {
            expect(PersonType.SENDER.description).toBe('Remitente');
            expect(PersonType.RECIPIENT.description).toBe('Destinatario');
        });

        test('debe ser inmutable (Object.freeze)', () => {
            expect(Object.isFrozen(PersonType)).toBe(true);
        });
    });

    describe('RoleType', () => {
        test('debe tener SUPERVISOR y OPERATOR', () => {
            expect(RoleType.SUPERVISOR).toBeDefined();
            expect(RoleType.OPERATOR).toBeDefined();
        });

        test('debe tener los ids correctos', () => {
            expect(RoleType.SUPERVISOR.id).toBe(1);
            expect(RoleType.OPERATOR.id).toBe(2);
        });

        test('debe tener las descripciones correctas', () => {
            expect(RoleType.SUPERVISOR.description).toBe('Supervisor');
            expect(RoleType.OPERATOR.description).toBe('Operador');
        });

        test('debe ser inmutable (Object.freeze)', () => {
            expect(Object.isFrozen(RoleType)).toBe(true);
        });
    });
});
