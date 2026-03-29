const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Status = sequelize.define('status', {
    id:          { type: DataTypes.INTEGER, primaryKey: true },
    description: { type: DataTypes.STRING }
},
{ tableName: 'status', timestamps: false });

module.exports = { Status }
