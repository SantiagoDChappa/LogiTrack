const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/shipments.json')

const getAll = () => {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

const getById = (id) => {
    return getAll().find(s => s.id === id)
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
            nombre: data.remitenteNombre,
            documento: data.remitenteDocumento,
            telefono: data.remitenteTelefono,
            email: data.remitenteEmail
        },
        destinatario: {
            nombre: data.destinatarioNombre,
            documento: data.destinatarioDocumento,
            telefono: data.destinatarioTelefono,
            email: data.destinatarioEmail
        },
        direccion: {
            calle: data.calle,
            numero: data.numero,
            pisoDepto: data.pisoDepto,
            provincia: data.provincia,
            codigoPostal: data.codigoPostal
        },
        fechaCreacion: new Date().toISOString().split('T')[0],
    };
    shipments.push(newShipment);
    fs.writeFileSync(dataPath, JSON.stringify(shipments, null, 4));
    return newShipment;
}

const search = ({ trackingId, rol, nombre, documento, nombreRemitente, documentoRemitente, nombreDestinatario, documentoDestinatario }) => {
    const hasFilter = trackingId || nombre || documento || nombreRemitente || documentoRemitente || nombreDestinatario || documentoDestinatario
    if (!hasFilter) return getAll()

    const isAmbos        = !rol || rol === 'ambos'
    const isRemitente    = rol === 'remitente'
    const isDestinatario = rol === 'destinatario'

    return getAll().filter(s => {
        if (!s.remitente || !s.destinatario) return false

        if (trackingId && !s.id.toLowerCase().includes(trackingId.toLowerCase())) return false

        if (isAmbos) {
            if (nombreRemitente    && !s.remitente.nombre.toLowerCase().includes(nombreRemitente.toLowerCase()))       return false
            if (documentoRemitente && !s.remitente.documento.includes(documentoRemitente))                            return false
            if (nombreDestinatario && !s.destinatario.nombre.toLowerCase().includes(nombreDestinatario.toLowerCase())) return false
            if (documentoDestinatario && !s.destinatario.documento.includes(documentoDestinatario))                   return false
        } else if (isRemitente) {
            if (nombre    && !s.remitente.nombre.toLowerCase().includes(nombre.toLowerCase())) return false
            if (documento && !s.remitente.documento.includes(documento))                       return false
        } else if (isDestinatario) {
            if (nombre    && !s.destinatario.nombre.toLowerCase().includes(nombre.toLowerCase())) return false
            if (documento && !s.destinatario.documento.includes(documento))                       return false
        }

        return true
    })
}

module.exports = { getAll, getById, create, search }
