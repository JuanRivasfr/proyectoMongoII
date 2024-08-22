const {validationResult} = require("express-validator");
const boletas = require("../model/boletas");
const boletasDto = require("../dto/boletasDto");
const { ObjectId } = require('mongodb');

const comprarUnBoleto = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const BoletasDto = new boletasDto()
    const obj = new boletas()
    req.body.idPelicula = new ObjectId(req.body.idPelicula)
    req.body.fechaFuncion = new Date(req.body.fechaFuncion)
    req.body.idUsuario = new ObjectId(req.body.idUsuario)
    let resModel = await obj.comprarBoletos(req.body);
    console.log(">:(", resModel);

    let data = (resModel.length) ? BoletasDto.templatesMostrarBoletas(resModel) : BoletasDto.templatesErrorBoletas()
    res.status(data.status).json(data);
}

// const crearUsuario = async (req, res) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()) return res.status(400).json({errors: errors.array() });
//     const usuarioDTO = new UsuarioDTO();
//     const obj = new Usuario();
//     let resModel = await obj.findOneClienteByNickOrEmail(req.body);
//     let data = (resModel) ? usuarioDTO.templateExistUser(resModel) : usuarioDTO.templateNotUsers();
//     if(data.status == 200) return res.status(data.status).json(data);
//     if(data.status == 404) resModel = await obj.saveUsuario(req.body);
//     data = (resModel.acknowledged) ? usuarioDTO.templateUserSaved(req.body) : usuarioDTO.templateUserError(resModel);
//     if(data.status == 500) return res.status(data.status).json(data);
//     if(data.status == 201) data = usuarioDTO.typeToRole(req.body);
//     if(data.tipo == "Administrador"){resModel = await obj.createUsuarioAdmin(data)} else{resModel = await obj.createUsuarioCliente(data)};
//     data = (resModel.ok) ? usuarioDTO.templateUserSaved(req.body) : usuarioDTO.templateUserError(resModel);
//     if(data.status == 500) return res.status(data.status).json(data);
//     return res.status(data.status).json(data);
// }

module.exports = {
    comprarUnBoleto
}