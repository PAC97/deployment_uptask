const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const {expressValidator, check} = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//importar variables de entorno
require('dotenv').config({path:'variables.env'})

//Crear aplicacion de express
//Helpers
const helpers = require('./helpers');
//Crear conexion a la base de datos

const db = require('./config/db');
//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch((error => console.log(error)));

const app = express();

//Referencia para cargar archivos estaticos

app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');
//Habilitar body parser, libreria para leer respuesta del cliente
app.use(bodyParser.urlencoded({extended: true}));

//Agregamos express validator
/* app.use(expressValidator());  */


//Carpeta de vistas
app.set('views', path.join(__dirname, './views'))

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar el vardump

app.use((req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    console.log(res.locals.usuario);
    next();
});




app.use('/', routes() );


//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, ()=>{
    console.log('El servidor esta funcionando');
});

require('./handlers/email');