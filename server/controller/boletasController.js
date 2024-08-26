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

const reservaUnBoleto = async(req, res) => {
    const FuncionesDto = new funcionesDto()
    const UsuariosDto = new usuariosDto()
    const BoletasDto = new boletasDto()
    const objUsuarios = new usuarios()
    const objBoletas = new boletas()
    const objFunciones = new funciones()
    let precioAux
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    req.body.idFuncion = new ObjectId(req.body.idFuncion)
    req.body.idUsuario = new ObjectId(req.body.idUsuario)
    let resModel = await objFunciones.buscarUnaFuncion(req.body.idFuncion)
    let data = (resModel.length) ? FuncionesDto.templatesMostrarFunciones(resModel) : FuncionesDto.templatesErrorFunciones()
    if(data.status === 200){
        resModel = await objUsuarios.buscarUnUsuario(req.body.idUsuario)
        data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorUsuarios()
    }
    else if(data.status === 404){
        return res.status(data.status).json(data);
    }
    if(data.status === 200){
        resModel = await objBoletas.reservarAsientos(req.body)
        let {asientosTotales, precio, asientosOcupados} = resModel[0]
        precioAux = precio
        const asientosDisponibles = asientosTotales.filter(val => {
            return (asientosTotales.includes(val) && !asientosOcupados.includes(val))
        })
        const asientosConflictivos = asientosTotales.filter(val => {
            return (!asientosDisponibles.includes(val) && req.body.asientos.includes(val))
        })
        if(asientosConflictivos.length > 0){
            msg = `Los siguientes asientos estan ocupados: ${asientosConflictivos.join(", ")}`
            data = FuncionesDto.templatesErrorAsientosOcupados(msg)
            return res.status(data.status).json(data);
        }
        const asientosNoExisten = req.body.asientos.filter(val => {
        return (req.body.asientos.includes(val) && !asientosTotales.includes(val))
        })
        if(asientosNoExisten.length > 0){
            msg = `Los siguientes asientos no existen: ${asientosNoExisten.join(", ")}`
            data = FuncionesDto.templatesErrorAsientosOcupados(msg)
            return res.status(data.status).json(data);
        }
        else{
            data = FuncionesDto.templatesMostrarFunciones(resModel)
        }
    }
    if(data.status === 200){
        resModel = await objBoletas.agregarBoletos(req.body.asientos, req.body.idFuncion, req.body.idUsuario, "reserva")
        let totalAsientosComprados = req.body.asientos.length
        let precioTotal = precioAux * totalAsientosComprados
        if(resModel.acknowledged === true){
            let msg = "Se reservaron los boletos de forma exitosa"
            data = BoletasDto.templatesCompraRealizadaBoletas(msg, precioTotal, req.body.idUsuario, req.body.idFuncion, req.body.asientos)
        }
        else{
            data = BoletasDto.templatesErrorBoletas()
        }
    }
    res.status(data.status).json(data);
}

const cancelarReserva = async(req,res) => {
    const BoletasDto = new boletasDto()
    const objBoletas = new boletas()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    req.query.id = new ObjectId(req.query.id)
    let resModel = await objBoletas.buscarUnBoleto(req.query.id)
    let data = (resModel.length) ? BoletasDto.templatesMostrarBoletas(resModel) : BoletasDto.templatesErrorBoleto()
    if(data.status === 200){
        let {_id, asientos, fecha_adquisicion, funcion_id, cliente_id, tipo_compra} = resModel[0]
        if(tipo_compra === "compra"){
            data = BoletasDto.templatesErrorBoletoTipoCompra()
        }
    }
    if(data.status === 200){
        resModel = await objBoletas.eliminarReserva(req.query.id)
        if(resModel.acknowledged === true){
            data = BoletasDto.templatesMostrarBoletas(resModel)
        }
        else{
            data = BoletasDto.templatesErrorEliminarReserva()
        }
    }
    res.status(data.status).json(data);
} 

const aplicarDescuento = async(req, res) => {
    const BoletasDto = new boletasDto()
    const UsuariosDto = new usuariosDto()
    const objUsuarios = new usuarios()
    const objBoletas = new boletas()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    req.body.idUsuario = new ObjectId(req.body.idUsuario)
    let {precioTotal, idUsuario : usuarioId} = req.body;
    let resModel = await objUsuarios.consultarTarjetaUsuarios(usuarioId)
    let data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorUsuarios()
    if(data.status === 200){
        let { categoria, descuento, estadoTarjeta } = resModel[0];
        if (categoria === "VIP") {
            if (estadoTarjeta === "activa") {
                let descuentoAplicado = (precioTotal * (descuento / 100));
                precioTotal = precioTotal - descuentoAplicado;
                data = BoletasDto.templatesDescuentoRealizado(precioTotal, descuentoAplicado)
                console.log(1);
            } 
            else if (estadoTarjeta === undefined) {
                let msg = "El usuario no cuenta con tarjeta"
                data = BoletasDto.templatesError(msg)
            } else {
                let msg = "La tarjeta no esta activa actualmente"
                data = BoletasDto.templatesError(msg)
            }
        } 
        else{
            let msg = "El usuario no es VIP"
            data = BoletasDto.templatesError(msg)
        }
    }
    res.status(data.status).json(data);
    

}

module.exports = {
    comprarUnBoleto,
    reservaUnBoleto,
    cancelarReserva,
    aplicarDescuento
}

