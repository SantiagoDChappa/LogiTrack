const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const TypeShiment = sequelize.define('shipmentType', {
    id:          { type: DataTypes.INTEGER, primaryKey: true },
    description: { type: DataTypes.STRING }
},
{ tableName: 'shipmentType', timestamps: false });

const getAll = async () => {
    return await TypeShiment.findAll();
};

module.exports = { TypeShiment, getAll };
