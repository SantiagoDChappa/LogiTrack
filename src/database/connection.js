const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    define: {
        schema: "logitrack",
        timestamps: false,
    },
    dialectOptions: process.env.NODE_ENV === "production"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
});

module.exports = sequelize;
