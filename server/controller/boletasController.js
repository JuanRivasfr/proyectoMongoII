const {validationResult} = require("express-validator");
const peliculas = require("../model/peliculas")
const boletas = require("../model/boletas");
const usuarios = require("../model/usuarios")
const boletasDto = require("../dto/boletasDto");
const peliculasDto = require("../dto/peliculasDto")
const { ObjectId } = require('mongodb');

const comprarUnBoleto = async(req, res) => {
    const BoletasDto = new boletasDto()
    const PeliculasDto = new peliculasDto()
    const objPeliculas = new peliculas()
    const objBoletas = new boletas()
    const objUsuarios = new usuarios()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    req.body.idPelicula = new ObjectId(req.body.idPelicula)
    req.body.fechaFuncion = new Date(req.body.fechaFuncion)
    req.body.idUsuario = new ObjectId(req.body.idUsuario)
    let resModel = await objPeliculas.getOneMovie(req.body.idPelicula);
    let data = (resModel.length) ? PeliculasDto.templatesListarPeliculas(resModel) : PeliculasDto.templatesErrorPeliculas()
    if(data.status === 404){
        return res.status(data.status).json(data);
    }
    if(data.status === 200){
        resModel = await objUsuarios.buscarUnUsuario(req.body.idUsuario)
        data = (resModel.length) ? PeliculasDto.templatesListarPeliculas(resModel) : PeliculasDto.templatesErrorPeliculas()
    }

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