const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const dataPath = path.join(__dirname, '../data/shipments.json')

const getAll = () => {
    const data =  JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return data;
}

const getById = (id) => {
    return getAll().find(shipment => shipment.id === id)
}

const create = (data) => {
    const shipments = getAll();
    const newShipment = { 
        id: uuid.v4(),
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

module.exports = {getAll, getById, create}