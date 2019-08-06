const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

const Proyectos = db.define('proyectos',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: Sequelize.STRING
    },
    descripcion:{
        type: Sequelize.STRING
    },
    url:{
        type: Sequelize.STRING
    },
    usuarioId:{
        type: Sequelize.INTEGER,
    }
}, {
    hooks: {
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLocaleLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
});

module.exports = Proyectos;