const Sequelize = require('sequelize');
//Valores de variables ENV
require('dotenv').config({path:'variables.env'})
const db = new Sequelize(process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    define:{
        timestamps: false
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 1000
    }
});

module.exports = db;