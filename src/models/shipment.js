const { DataTypes, Op } = require('sequelize');
const sequelize = require('../database/connection');
const { Person }  = require('./person');
const { Status }  = require('./status');
const { Address } = require('./address');

const Shipment = sequelize.define('shipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    trackingId:  { type: DataTypes.STRING },
    statusId:    { type: DataTypes.INTEGER },
    createdAt:   { type: DataTypes.DATE },
    senderId:    { type: DataTypes.INTEGER },
    recipientId: { type: DataTypes.INTEGER },
    addressId:   { type: DataTypes.INTEGER }
},
{ timestamps: true, tableName: 'shipment' });

Shipment.belongsTo(Person,  { as: 'sender',    foreignKey: 'senderId'    });
Shipment.belongsTo(Person,  { as: 'recipient', foreignKey: 'recipientId' });
Shipment.belongsTo(Status,  { as: 'status',    foreignKey: 'statusId'    });
Shipment.belongsTo(Address, { as: 'address',   foreignKey: 'addressId'   });

const defaultIncludes = [
    { model: Person,  as: 'sender'    },
    { model: Person,  as: 'recipient' },
    { model: Status,  as: 'status'    },
    { model: Address, as: 'address'   },
]

const getAll = async () => {
    return await Shipment.findAll({ include: defaultIncludes });
}

const getById = async (id) => {
    return await Shipment.findOne({
        where: { id },
        include: defaultIncludes
    });
}

const generateTrackingId = async () => {
    const last = await Shipment.findOne({ order: [['id', 'DESC']] })
    const next = last ? last.id + 1 : 1
    return `ENV-${String(next).padStart(3, '0')}`
}

const create = async (data) => {
    const trackingId = await generateTrackingId()
    return await Shipment.create({
        trackingId,
        statusId:    1,
        senderId:    data.senderId,
        recipientId: data.recipientId,
        addressId:   data.addressId,
        createdAt:   new Date().toISOString().split('T')[0]
    })
}

const search = async ({ trackingId, role, name, document, senderName, senderDocument, recipientName, recipientDocument }) => {
    const shipmentWhere  = {}
    const senderWhere    = {}
    const recipientWhere = {}

    if (trackingId) shipmentWhere.trackingId = { [Op.iLike]: `%${trackingId}%` }

    const isBoth      = !role || role === 'both'
    const isSender    = role === 'sender'
    const isRecipient = role === 'recipient'

    if (isBoth) {
        if (senderName)        senderWhere.fullName    = { [Op.iLike]: `%${senderName}%` }
        if (senderDocument)    senderWhere.document    = senderDocument
        if (recipientName)     recipientWhere.fullName = { [Op.iLike]: `%${recipientName}%` }
        if (recipientDocument) recipientWhere.document = recipientDocument
    } else if (isSender) {
        if (name)     senderWhere.fullName = { [Op.iLike]: `%${name}%` }
        if (document) senderWhere.document = document
    } else if (isRecipient) {
        if (name)     recipientWhere.fullName = { [Op.iLike]: `%${name}%` }
        if (document) recipientWhere.document = document
    }

    return await Shipment.findAll({
        where: shipmentWhere,
        include: [
            {
                model:    Person,
                as:       'sender',
                where:    Object.keys(senderWhere).length    ? senderWhere    : undefined,
                required: Object.keys(senderWhere).length    ? true           : false,
            },
            {
                model:    Person,
                as:       'recipient',
                where:    Object.keys(recipientWhere).length ? recipientWhere : undefined,
                required: Object.keys(recipientWhere).length ? true           : false,
            },
            { model: Status,  as: 'status'  },
            { model: Address, as: 'address' },
        ]
    })
}

const deleteById = async (id) => {
    return await Shipment.destroy({
        where: { id }
    })
}

module.exports = { Shipment, getAll, getById, create, deleteById, search }
