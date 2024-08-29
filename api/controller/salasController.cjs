const { ObjectId } = require('mongodb');
const {validationResult} = require("express-validator");
const salas = require("../model/salas.cjs")
const salasDto = require("../dto/salasDto.cjs")

const listarSala = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const SalasDto = new salasDto()
    const objSalas = new salas()
    req.query.id = new ObjectId(req.query.id)
    let resModel = await objSalas.obtenerPrecioSalaAsientosTotales(req.query.id);
    let data = (resModel.length) ? SalasDto.templatesMostrarSalas(resModel) : SalasDto.templatesErrorMostrarSalas()
    res.status(data.status).json(data);
}

module.exports = {
    listarSala
}