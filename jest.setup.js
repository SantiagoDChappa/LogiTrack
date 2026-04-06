// Setea variables de entorno mínimas para que los módulos carguen en test
// sin necesitar una base de datos real.
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/testdb';
process.env.JWT_SECRET    = process.env.JWT_SECRET   || 'test-secret';
process.env.NODE_ENV      = 'test';
