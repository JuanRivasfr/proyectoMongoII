const { ObjectId } = require('mongodb');
const {validationResult} = require("express-validator");
const funciones = require("../model/funciones")
const funcionesDto = require("../dto/funcionesDto")

const verificarAsientosDisponibles = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const FuncionesDto = new funcionesDto()
    const objFunciones = new funciones()
    req.query.id = new ObjectId(req.query.id)
    //Hace la consulta
    let resModel = await objFunciones.buscarUnaFuncion(req.query.id);
    //Se asigna el status segun la data
    let data = (resModel.length) ? FuncionesDto.templatesMostrarFunciones(resModel) : FuncionesDto.templatesErrorFunciones()    
    //Continua y consulta los asientos disponibles
    if(data.status === 200){
        resModel = await objFunciones.disponibilidadAsientos(req.query.id);
        data = (resModel.length) ? FuncionesDto.templatesMostrarFunciones() : FuncionesDto.templatesErrorFunciones()
        let {asientosSala, asientosOcupados} = resModel[0]
        const asientosCombinados = [...asientosSala, ...asientosOcupados]
        const asientosDisponibles = asientosCombinados.filter(val => {
            return (asientosSala.includes(val) && !asientosOcupados.includes(val))
        })
        if (asientosDisponibles.length > 0) {
            data = FuncionesDto.templatesMostrarFunciones(asientosDisponibles)
        } else {
            let msg = "No hay asientos disponibles para la funcion"
            data = FuncionesDto.templatesErrorAsientosOcupados(msg)
        }
    }
    res.status(data.status).json(data);
}

module.exports = {
    verificarAsientosDisponibles
}