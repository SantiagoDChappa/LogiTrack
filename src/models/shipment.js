const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/shipments.json')

const getAll = () => {
    const data =  JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return data;
}

const getById = (id) => {
    return getAll().find(shipment => shipment.id === id)
}

const generateId = (shipments) => {
    const nums = shipments
        .map(s => parseInt(s.id?.replace('ENV-', '')) || 0)
        .filter(n => !isNaN(n))
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
    return `ENV-${String(next).padStart(3, '0')}`
}

const create = (data) => {
    const shipments = getAll();
    const newShipment = {
        id: generateId(shipments),
        estado: 'Pendiente',
        remitente: {
            nombre: data.remitente_nombre,
            documento: data.remitente_documento,
            telefono: data.remitente_telefono,
            email: data.remitente_email
        },
        destinatario: {
            nombre: data.destinatario_nombre,
            documento: data.destinatario_documento,
            telefono: data.destinatario_telefono,
            email: data.destinatario_email
        },
         direccion: {
            calle: data.calle,
            numero: data.numero,
            piso_depto: data.piso_depto,
            provincia: data.provincia,
            codigo_postal: data.codigo_postal
        },
        fechaCreacion: new Date().toISOString().split('T'), 
    };
    shipments.push(newShipment);
    fs.writeFileSync(dataPath, JSON.stringify(shipments, null, 4));
    return newShipment;
}

const deleteFromId = (id) => {
    let shipment = getAll().find(shipment => shipment.id === id)
}

const search = ({ trackingId, nombre, documento, rol }) => {
    const hasFilter = (trackingId || nombre || documento)
    if (!hasFilter) return getAll()

    const checkRemitente = !rol || rol === 'ambos' || rol === 'remitente'
    const checkDestinatario = !rol || rol === 'ambos' || rol === 'destinatario'

    return getAll().filter(s => {
        if (!s.remitente || !s.destinatario) return false

        if (trackingId && !s.id.toLowerCase().includes(trackingId.toLowerCase())) return false

        if (documento) {
            const matchDoc = (checkRemitente && s.remitente.documento.includes(documento)) ||
                             (checkDestinatario && s.destinatario.documento.includes(documento))
            if (!matchDoc) return false
        }

        if (nombre) {
            const n = nombre.toLowerCase()
            const matchNombre = (checkRemitente && s.remitente.nombre.toLowerCase().includes(n)) ||
                                (checkDestinatario && s.destinatario.nombre.toLowerCase().includes(n))
            if (!matchNombre) return false
        }

        return true
    })
}

module.exports = { getAll, getById, create, search }