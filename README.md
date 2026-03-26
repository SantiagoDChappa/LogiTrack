# LogiTrack

Sistema de gestión de envíos enfocado en la automatización y agilización del proceso logístico.

---

## Tecnologías utilizadas

| Tecnología | Rol |
|---|---|
| Node.js + Express | Servidor web y routing |
| EJS | Motor de plantillas para las vistas |
| PostgreSQL + Sequelize | Base de datos relacional y ORM |
| express-validator | Validación de formularios server-side |
| bcryptjs + jsonwebtoken | Base para autenticación (en desarrollo) |
| helmet + cors | Seguridad HTTP |
| morgan | Logging de requests |
| SweetAlert2 | Alertas y feedback visual al usuario |
| nodemon | Reinicio automático en desarrollo |

---

## Requisitos previos

- Node.js >= 18
- PostgreSQL instalado y corriendo

---

## Instalación

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/SantiagoDChappa/LogiTrack.git
cd LogiTrack
npm install
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo y completar con los datos de la base de datos:

```bash
cp .env.example .env
```

Editar `.env`:

```
DATABASE_URL=postgresql://postgres:TU_CONTRASENIA@localhost:5432/logitrack
PORT=3000
```

### 3. Crear la base de datos en PostgreSQL

Conectarse a PostgreSQL y ejecutar:

```sql
CREATE DATABASE logitrack;
```

### 4. Crear las tablas y cargar datos iniciales

```bash
npm run db:setup
```

Este comando ejecuta automáticamente:
- `schema.sql` — crea el schema y todas las tablas
- `seed.sql` — carga los datos de provincias, estados, tipos de persona y roles

### 5. Iniciar el proyecto

```bash
# Producción
npm start

# Desarrollo (con reinicio automático)
npm run dev
```

El servidor queda disponible en `http://localhost:3000`

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia el servidor con nodemon |
| `npm run db:setup` | Crea las tablas y carga datos iniciales |

---

## Arquitectura

El proyecto sigue el patrón **MVC**:

```
src/
├── constants/       # Enums y constantes (estados, tipos de persona, roles)
├── controllers/     # Coordinación de requests y respuestas
├── models/          # Acceso a la base de datos (Sequelize)
├── middlewares/     # Validaciones de formularios
├── routes/          # Definición de rutas Express
├── views/           # Plantillas EJS
│   ├── partials/    # Componentes reutilizables (head, header)
│   └── shipment/    # Vistas del módulo de envíos
└── database/
    ├── connection.js  # Conexión Sequelize
    ├── schema.sql     # Definición de tablas
    ├── seed.sql       # Datos iniciales
    └── setup.js       # Script de inicialización
```

---

## Funcionalidades implementadas

### Alta de envío
- Formulario con datos de remitente, destinatario y dirección de entrega.
- Selector de provincia cargado desde la base de datos.
- Validaciones server-side con `express-validator`.
- Feedback visual mediante SweetAlert2.

### Listado y búsqueda de envíos
- Tabla con todos los envíos (Tracking ID, Remitente, Destinatario, Estado).
- Buscador con filtro por Tracking ID, nombre y documento de remitente/destinatario.
- Búsqueda parcial case-insensitive.

### Eliminación de envíos
- Botón de eliminar por envío con confirmación visual.

---

## Equipo

- Santiago Chappa
- Luca Corigliano
- Maximo Flores
