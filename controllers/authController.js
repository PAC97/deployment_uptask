const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion'
}), function(req, res){
    req.flash('alert-danger', 'badRequestMessage')
};

//Funcion para verificar si el usuario esta autenticado o no
exports.usuarioAutenticado = (req, res, next) =>{
    //si el usuario esta autenticado adelante
    if(req.isAuthenticated()){
        return next();
    }
    //si no estad autenticado redirigir al formulario
    return res.redirect('/iniciar-sesion');
}
exports.noAutenticado = (req, res, next)=>{
    if(!req.isAuthenticated()){
        return next();
    }

    return res.redirect('/');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    })
}
//Generar un token si el usuario es valido

exports.enviarToken = async (req, res) => {
    //verificar que existe el usuario
    const usuario = await Usuarios.findOne({where: {email : req.body.email}});

    //Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer')
    }

    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 360000;

    //Guardar en la base de datos
    await usuario.save();
    //Url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    //Eviar correo con el token
     enviarEmail.enviar({
        usuario : usuario,
        subject: 'Password Reset',
        resetUrl : resetUrl,
        archivo: 'reestablecerPassword'
    });
    //Terminar ejecucion
    req.flash('alert-success', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });
    //Si no encuentra el usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer Contraseña'
    })
}
//Actualizar password
exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion:{
                [Op.gte] : Date.now()
            }
        }
    });
    //Verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //Hashear password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); 
    console.log(usuario.password);
    usuario.token = null;
    usuario.expiracion = null;

    //Guardamos el nuevo password
    await usuario.save();
    req.flash('alert-success', 'Tu password ha sido reestablecido');
    res.redirect('/iniciar-sesion');
}