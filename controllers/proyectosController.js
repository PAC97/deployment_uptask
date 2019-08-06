const Proyectos = require('../models/proyectos');
const Tareas = require('../models/tareas');

exports.proyectoHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId : usuarioId}});
    res.render("index", {
      nombrePagina: 'Proyectos',
      proyectos
    });
  }

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId : usuarioId}});
    res.render("nuevoProyecto", {
      nombrePagina: 'Nuevo Proyecto',
      proyectos
    });
  }

  exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId : usuarioId}});
    //Enviar a consola respuesta del formulario
    /* console.log(req.body); */

    //Validar input

    const{ nombre, descripcion } = req.body;

    let errores = [];

    if(!nombre){
      errores.push({'texto': 'Agrega nombre al proyecto'})
    }

    //Si hay errores
    if(errores.length > 0){
      res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        errores,
        proyectos
      })
    }else{
      //No hay errores insertar en la base de datos
      const usuarioId = res.locals.usuario.id;
      await Proyectos.create({nombre, descripcion, usuarioId});
      res.redirect('/');

    }

  }
  exports.proyectoPorUrl = async (req, res, next) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where: {usuarioId : usuarioId}});

    const proyectoPromise = Proyectos.findOne({
      where:{
        url: req.params.url,
        usuarioId : usuarioId
      }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    //Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
      where: {
        proyectoId: proyecto.id
      },
     /*  include:[
        {model: Proyectos}
      ] */
    });

    if(!proyecto) return next();

    //Render a la vista
    res.render('tareas', {
      nombrePagina: 'Tareas del Poyecto',
      proyecto,
      proyectos,
      tareas
    })
  }

  exports.formularioEditar = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where: {usuarioId : usuarioId}});

    const proyectoPromise = Proyectos.findOne({
      where:{
        id: req.params.id,
        usuarioId : usuarioId
      }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

//Render a la vista
    res.render('nuevoProyecto', {
      nombrePagina: 'Editar Proyecto',
      proyectos,
      proyecto
    });
  }

  exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectoPromise =  Proyectos.findAll({where: {usuarioId : usuarioId}});
    //Enviar a consola respuesta del formulario
    /* console.log(req.body); */

    //Validar input

    const{ nombre, descripcion } = req.body;
    const pro = req.body;
    console.log(pro);
    let errores = [];

    if(!nombre){
      errores.push({'texto': 'Agrega nombre al proyecto'})
    }

    //Si hay errores
    if(errores.length > 0){
      res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        errores,
        proyectos
      })
    }else{
      //No hay errores insertar en la base de datos

      await Proyectos.update(
        {
          nombre: nombre,
          descripcion: descripcion
        },
        
        {where: {id: req.params.id}}
      );
      res.redirect('/');

    }

  }

  exports.eliminarProyecto = async (req, res, next) =>{
    //req, query o params
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});
    
    if(!resultado){
      return next();
    }

    res.status(200).send('Proyecto eliminado correctamente')
  }
