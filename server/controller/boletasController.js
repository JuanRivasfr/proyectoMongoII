const peliculas = require("../model/peliculas")
const boletas = require("../model/boletas");
const usuarios = require("../model/usuarios")
const salas = require("../model/salas")
const funciones = require("../model/funciones")
const boletasDto = require("../dto/boletasDto");
const peliculasDto = require("../dto/peliculasDto")
const usuariosDto = require("../dto/usuariosDto")
const salasDto = require("../dto/salasDto")
const funcionesDto = require("../dto/funcionesDto")
const { ObjectId } = require('mongodb');
const {validationResult} = require("express-validator");

const comprarUnBoleto = async(req, res) => {
    const BoletasDto = new boletasDto()
    const PeliculasDto = new peliculasDto()
    const UsuariosDto = new usuariosDto()
    const FuncionesDto = new funcionesDto()
    const SalasDto = new salasDto()
    const objPeliculas = new peliculas()
    const objBoletas = new boletas()
    const objSalas = new salas()
    const objUsuarios = new usuarios()
    const objFunciones = new funciones()
    const errors = validationResult(req);
    //Se crea la variable q contendra la data
    let data
    //Se crea la variable q contendra el id de la funcion
    let idFuncion
    //se crea la vaiable q contendra el id de la sala
    let idSalaAux
    //Se crea la variable q contendra el precio de la sala
    let precioSalaAux
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    req.body.idPelicula = new ObjectId(req.body.idPelicula)
    req.body.fechaFuncion = new Date(req.body.fechaFuncion)
    req.body.idUsuario = new ObjectId(req.body.idUsuario)
    if(req.body.fechaFuncion.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)){
        data = FuncionesDto.templatesErrorFechaFuncion()
        return res.status(data.status).json(data);
    }
    let resModel = await objPeliculas.getOneMovie(req.body.idPelicula);
    data = (resModel.length) ? PeliculasDto.templatesListarPeliculas(resModel) : PeliculasDto.templatesErrorPeliculas()
    //Devuelve error si no existe la pelicula
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    //Sigue con el proceso y consulta usuarios
    if(data.status === 200){
        resModel = await objUsuarios.buscarUnUsuario(req.body.idUsuario)
        data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorUsuarios()
    }
    //Devuelve error si no existe el usuario
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    //Sigue con el proceso y consulta las funciones
    if(data.status === 200){
        resModel = await objBoletas.comprarBoletos(req.body)
        data = (resModel.length) ? FuncionesDto.templatesMostrarFunciones(resModel) : FuncionesDto.templatesErrorNoHayFunciones()
    }
    //Devuelve error si no hay funciones disponibles
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    //Sigue con el proceso y consulta las funciones
    if(data.status === 200){
        let funciones = resModel[0].funciones
        let banderaFunciones = false
        let banderaFuncionesHora = false
        for (let i = 0; i < funciones.length; i++) {
            if(funciones[i].fecha.setHours(0, 0, 0, 0) === req.body.fechaFuncion.setHours(0, 0, 0, 0)){
                banderaFunciones = true
                if(funciones[i].hora_inicio === req.body.horaInicio){
                    banderaFuncionesHora = true
                    idFuncion = funciones[i]._id
                }
            }
        }
        let banderaFechayHora = true
        while(banderaFechayHora){
            if(banderaFunciones && banderaFuncionesHora){
                data = FuncionesDto.templatesMostrarFunciones(resModel)
                banderaFechayHora = false
            }
            else if(!banderaFunciones){
                data = FuncionesDto.templatesErrorNoHayFuncionesFecha()
                banderaFechayHora = false
            }
            else if(!banderaFuncionesHora){
                data = FuncionesDto.templatesErrorNoHayFuncionesHora()
                banderaFechayHora = false
            }
        } 
    }
    //Devuelv error si no hay funciones en la hora o fecha estipuladas
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    //Sigue con el proceso y valida que los asientos esten disponibles
    if(data.status === 200){
        resModel = await objBoletas.disponibilidadAsientosCompraBoletos(idFuncion)
        let {asientosOcupados, idSala} = resModel[0]
        idSalaAux = idSala
        if(asientosOcupados.length > 0){
            const asientosConflictivos = req.body.asientos.filter(val => asientosOcupados.includes(val))
            if(asientosConflictivos.length > 0){
                let message = `Los siguientes asientos ya están ocupados: ${asientosConflictivos.join(", ")}`
                data =  FuncionesDto.templatesErrorAsientosOcupados(message)
            }
            else{
                data =  FuncionesDto.templatesMostrarFunciones()
            }
        }
        else{
            data =  FuncionesDto.templatesMostrarFunciones()
        }
    }
    //Devuelve error si los asientos no estan disponibles
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    //Sigue con el proceso y valida si los asientos existen
    if(data.status === 200){
        resModel = await objSalas.obtenerPrecioSalaAsientosTotales(idSalaAux)
        let {precio : precioSala, asientos: asientosTotales} = resModel[0]
        precioSalaAux = precioSala
        console.log(precioSalaAux);
        const asientosNoExisten =   req.body.asientos.filter(val => !asientosTotales.includes(val))
        if(asientosNoExisten.length > 0){
            let msg =  `Los siguientes asientos no existen: ${asientosNoExisten.join(", ")}`
            data = SalasDto.templatesErrorAsientosExistentes(msg)
        }
        else{
            data = SalasDto.templatesMostrarSalas()
        }
    }
    //Devuelve error si no existen los asientos
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    if(data.status === 200){
        resModel = await objBoletas.agregarBoletos(req.body.asientos, idFuncion, req.body.idUsuario, "compra")
        let totalAsientosComprados = req.body.asientos.length
        let precioTotal = precioSalaAux * totalAsientosComprados
        if(resModel.acknowledged === true){
            let msg = "Se compraron los boletos de forma exitosa"
            data = BoletasDto.templatesCompraRealizadaBoletas(msg, precioTotal, req.body.idUsuario, idFuncion, req.body.asientos)
        }
        else{
            data = BoletasDto.templatesErrorBoletas()
        }
    }
    res.status(data.status).json(data);
}

module.exports = {
    comprarUnBoleto
}