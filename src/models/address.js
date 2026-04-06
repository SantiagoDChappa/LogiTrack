const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const { Province } = require('./province');

const Address = sequelize.define('address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    street:         { type: DataTypes.STRING },
    number:         { type: DataTypes.INTEGER },
    provinceId:     { type: DataTypes.INTEGER },
    postalCode:     { type: DataTypes.INTEGER },
    floorApartment: { type: DataTypes.STRING },
},
{ tableName: 'address' });

Address.belongsTo(Province, { as: 'province', foreignKey: 'provinceId' });

const create = async (data) => {
    return await Address.create({
        street:         data.street,
        number:         data.number,
        provinceId:     data.provinceId,
        postalCode:     data.postalCode,
        floorApartment: data.floorApartment
    });
};

module.exports = { Address, create };
