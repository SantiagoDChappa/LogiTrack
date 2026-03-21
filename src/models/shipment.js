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
    const newShipment = { id: uuid(), fechaCreacion: new Date().toISOString.split('T'), ...data};
    shipments.push(newShipment);
    fs.writeFileSync(dataPath, JSON.stringify(shipments, null, 4));
    return newShipment;
}

module.exports = {getAll, getById, create}