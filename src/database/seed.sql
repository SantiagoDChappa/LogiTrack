-- ============================================================
-- LogiTrack - Seed Data
-- ============================================================

-- statuses
INSERT INTO "logitrack"."status" ("id", "description") VALUES
    (1, 'Pendiente'),
    (2, 'En Transito'),
    (3, 'En Sucursal'),
    (4, 'Entregado'),
    (5, 'Cancelado');

-- personTypes
INSERT INTO "logitrack"."personType" ("id", "description") VALUES
    (1, 'Remitente'),
    (2, 'Destinatario');

-- roleTypes
INSERT INTO "logitrack"."roleType" ("id", "description") VALUES
    (1, 'Supervisor'),
    (2, 'Operador');

-- provinces
INSERT INTO "logitrack"."province" ("id", "description") VALUES
    (1,  'Buenos Aires'),
    (2,  'Catamarca'),
    (3,  'Chaco'),
    (4,  'Chubut'),
    (5,  'Córdoba'),
    (6,  'Corrientes'),
    (7,  'Entre Ríos'),
    (8,  'Formosa'),
    (9,  'Jujuy'),
    (10, 'La Pampa'),
    (11, 'La Rioja'),
    (12, 'Mendoza'),
    (13, 'Misiones'),
    (14, 'Neuquén'),
    (15, 'Río Negro'),
    (16, 'Salta'),
    (17, 'San Juan'),
    (18, 'San Luis'),
    (19, 'Santa Cruz'),
    (20, 'Santa Fe'),
    (21, 'Santiago del Estero'),
    (22, 'Tierra del Fuego'),
    (23, 'Tucumán'),
    (24, 'Ciudad Autónoma de Buenos Aires');
