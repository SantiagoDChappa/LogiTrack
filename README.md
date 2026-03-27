# LogiTrack

> Sistema de gestión de envíos orientado al registro y seguimiento de paquetes.

---

## Visión del proyecto

LogiTrack es un sistema de gestión de envíos orientado al registro y seguimiento de paquetes dentro de una organización. El sistema busca centralizar la información relacionada con los envíos y su estado a lo largo del proceso de distribución, permitiendo mejorar la visibilidad y el control sobre cada envío desde su registro hasta su entrega. Además, el proyecto contempla el desarrollo de un prototipo de Machine Learning que permita analizar datos logísticos a partir de un dataset y evaluar su desempeño mediante métricas de precisión.

---

## ¿Cómo acceder al sistema?

No es necesario instalar nada. El sistema está disponible en línea:

**[https://logitrack.onrender.com](https://logitrack.onrender.com)**

Simplemente abrí el enlace desde cualquier navegador web.

---

## ¿Qué podés hacer en LogiTrack?

### Registrar un nuevo envío

Desde el menú principal accedé a **Nuevo envío** e ingresá los datos del remitente, el destinatario y la dirección de entrega. Al completar el formulario el sistema genera automáticamente un **Tracking ID** (ej: `ENV-001`) y registra el envío con estado inicial *Pendiente*.

### Buscar y consultar envíos

Desde la sección **Envíos** podés buscar por:

- Tracking ID (búsqueda parcial, sin distinguir mayúsculas)
- Nombre o documento del remitente
- Nombre o documento del destinatario

Los resultados muestran el Tracking ID, remitente, destinatario y estado actual del envío. Haciendo clic en un envío se accede al detalle completo.

### Ver el detalle de un envío

El detalle muestra toda la información del envío: datos del remitente, del destinatario, dirección de entrega, estado actual e historial de cambios de estado con fecha y comentarios.

### Modificar el estado de un envío

Desde la pantalla de edición se puede avanzar el estado del envío a través del flujo:

```
Pendiente → En Tránsito → En Sucursal → Entregado
                                       → Cancelado
```

Cada cambio de estado queda registrado en el historial con la fecha y un comentario opcional.

### Eliminar un envío

Desde el listado es posible eliminar un envío con confirmación visual.

### Dashboard

La pantalla de inicio muestra un resumen general: cantidad de envíos activos, entregas del día y alertas de retraso.

---

## Equipo

- Santiago Chappa
- Luca Corigliano
- Maximo Flores

---

## Para desarrolladores

<details>
<summary>Ver información técnica del proyecto</summary>

### Tecnologías

| Tecnología | Rol |
|---|---|
| Node.js + Express | Servidor web y routing |
| EJS | Motor de plantillas |
| PostgreSQL + Sequelize | Base de datos y ORM |
| express-validator | Validación server-side |
| Jest + Supertest | Testing unitario e integración |
| bcryptjs + jsonwebtoken | Autenticación (en desarrollo) |
| helmet + cors | Seguridad HTTP |

### Arquitectura (MVC)

```
src/
├── constants/       # Enums: estados, tipos de persona, roles
├── controllers/     # Lógica de negocio y respuestas HTTP
├── models/          # Acceso a datos con Sequelize
├── middlewares/     # Validación de formularios
├── routes/          # Rutas Express
├── views/           # Plantillas EJS
└── database/        # Conexión, schema SQL y seed
Test/
├── unit/            # Tests de modelos, enums y middlewares
└── integration/     # Tests de rutas HTTP con Supertest
```

### Instalación local

```bash
git clone https://github.com/SantiagoDChappa/LogiTrack.git
cd LogiTrack
npm install
cp .env.example .env   # completar DATABASE_URL
npm run db:setup       # crea schema y carga datos iniciales
npm run dev            # inicia en http://localhost:3000
```

### Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia con nodemon (recarga automática) |
| `npm run db:setup` | Crea tablas y carga datos iniciales |
| `npm test` | Ejecuta los tests (Jest) |

</details>
