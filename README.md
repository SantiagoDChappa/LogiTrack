# LogiTrack

Sistema de gestión de envíos enfocado en la automatización y agilización del proceso logístico.

---

## Tecnologías utilizadas

| Tecnología | Rol |
|---|---|
| Node.js + Express | Servidor web y routing |
| EJS | Motor de plantillas para las vistas |
| express-validator | Validación de formularios server-side |
| uuid | Generación de IDs únicos por envío |
| bcryptjs + jsonwebtoken | Base para autenticación (en desarrollo) |
| helmet + cors | Seguridad HTTP |
| morgan | Logging de requests |
| SweetAlert2 | Alertas y feedback visual al usuario |
| nodemon | Reinicio automático en desarrollo |
| JSON files | Persistencia de datos (shipments.json, provinces.json) |

---

## Arquitectura

El proyecto sigue el patrón **MVC**:

```
src/
├── controllers/     # Lógica de negocio y manejo de requests
├── models/          # Acceso y persistencia de datos (JSON)
├── middlewares/     # Validaciones de formularios
├── routes/          # Definición de rutas Express
├── views/           # Plantillas EJS
│   ├── partials/    # Componentes reutilizables (head, header)
│   └── shipment/    # Vistas del módulo de envíos
└── data/            # Archivos JSON de datos
    ├── shipments.json
    └── provinces.json
```

---

## Instalación y ejecución

```bash
npm install
npm start
```

El servidor inicia con `nodemon` y escucha en el puerto configurado.

---

## Funcionalidades implementadas

### Alta de envío (SCRUM-80)
- Formulario para registrar un nuevo envío con datos de remitente, destinatario y dirección de entrega.
- Selector de provincia cargado dinámicamente desde `provinces.json`.
- Validaciones server-side con `express-validator`:
  - Campos obligatorios (nombre, email, teléfono, documento, calle, número, provincia, código postal).
  - Formato de email válido.
  - Control de duplicados: no se permite crear un envío si ya existe uno con el mismo documento de remitente o destinatario.
- Feedback visual de errores mediante SweetAlert2.
- Persistencia del envío en `shipments.json` con UUID autogenerado y estado inicial `Pendiente`.

### Listado y búsqueda de envíos (SCRUM-91 / US-07)
- Tabla con todos los envíos registrados (Tracking ID, Destinatario, Estado).
- Buscador con filtro por **Tracking ID** y/o **Destinatario** mediante checkboxes.
- Búsqueda case-insensitive con substring matching.
- Si no hay resultados, se muestra el mensaje "No se encontraron resultados".

---

## Equipo

- Santiago Chappa
- Luca Corigliano
- Maximo Flores
