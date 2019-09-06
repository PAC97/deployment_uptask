const Usuarios = require('../models/usuarios');
const enviarEmail = require('../handlers/email');
exports.formCrearCuenta = (req, res) =>{
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) =>{
    const {error} = res.locals.mensajes;
    req.flash('alert-success', error)
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en UpTask'
    })
}

exports.crearCuenta = async (req, res) => {
    //Leer los datos
    const {nombre, apellido, email, password} = req.body;

    try {
        await  Usuarios.create({
            nombre,
            apellido,
            email,
            password
        });

        //Crear URL para confirmar cuenta
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //Crear objeto de usuario
        const usuario = {
            email
        }
        //Eviar email
        enviarEmail.enviar({
            usuario : usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl : confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        //Redirigir al usuario
        req.flash('alert-success', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {
         req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }

}

exports.formReestablecer = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña',
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //Si no existe el usuario 
    if(!usuario){
        req.flash('alert-danger', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('alert-success', 'Cuenta activada');
    res.redirect('/iniciar-sesion');
}