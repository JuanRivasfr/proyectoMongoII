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

const crearUsuario = async(req, res) => {
    const UsuariosDto = new usuariosDto()
    const objUsuarios = new usuarios()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    let resModel = await objUsuarios.getAllMatch()
    let data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorConsultarUsuarios()
    let {identificacion, nombre, apellido, nick, email, telefono, categoria, tarjeta} = req.body
    for (let i = 0; i < resModel.length; i++) {
        if(resModel[i].identificacion === identificacion){
            let msg = "Ya existe un usuario con esa identificacion"
            data = UsuariosDto.templatesErrorUsuarios(msg)
            return res.status(data.status).json(data);
        }
        if(resModel[i].nick === nick){
            let msg = "Ya existe un usuario con ese nick"
            data = UsuariosDto.templatesErrorUsuarios(msg)
            return res.status(data.status).json(data);
        }
        if(resModel[i].email === email){
            let msg = "Ya existe un usuario con ese email"
            data = UsuariosDto.templatesErrorUsuarios(msg)
            return res.status(data.status).json(data);
        }
        if (resModel[i].telefono && telefono) {
            for (let j = 0; j < resModel[i].telefono.length; j++) {
                for (let k = 0; k < telefono.length; k++) {
                    if (resModel[i].telefono[j] === telefono[k]) {
                        let msg = "El telefono ya esta registrado"
                        data = UsuariosDto.templatesErrorUsuarios(msg)
                        return res.status(data.status).json(data);
                    }
                }
            }
        }
    }
    if(data.status === 200){
        resModel = await objUsuarios.crearUsuario(identificacion, nombre, apellido, nick, email, telefono, categoria, tarjeta)
        if(resModel.acknowledged === true){
            data = UsuariosDto.templatesListarUsuarios(resModel)
        }
        else{
            let msg = ("Ocurrio un error al crear el usuario")
            data = UsuariosDto.templatesErrorUsuarios(msg)
            return  res.status(data.status).json(data);
        }
    }
    if(data.status === 200){
        let rol = "default"
        
        if(categoria.nombre === "VIP"){
            rol = "usuarioVip"
        }
        if(categoria.nombre === "estandar"){ 
            rol = "usuarioEstandar" 
        }
        if(categoria.nombre === "administrador"){
            rol = "adminCine"
        }
        let pwd = identificacion.toString()
        resModel =  await objUsuarios.crearUsuarioMongo(nick, pwd, rol)
        if(resModel.ok){
            data = UsuariosDto.templatesUsuarioCreado(nick, pwd)
        }
        else{
            let msg = "Ocurrio un error al crear el usuario en la base de datos"
            data = UsuariosDto.templatesErrorUsuarios(msg)
        }
    }
    res.status(data.status).json(data); 
}

const encontrarUnUsuario = async(req, res) => {
    const UsuarioDto = new usuariosDto()
    const objUsuarios = new usuarios()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    let resModel = await objUsuarios.buscarUnUsuario(req.query.id)
    console.log(resModel);
    let data = (resModel.length) ? UsuarioDto.templatesListarUsuarios(resModel) : UsuarioDto.templatesErrorUsuariosNoEncontrado()
    res.status(data.status).json(data);
}

const cambiarRol = async(req, res) => {
    const objUsuarios = new usuarios()
    const UsuariosDto = new usuariosDto()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    req.body.idUsuario = new ObjectId(req.body.idUsuario)
    let resModel = await objUsuarios.buscarUnUsuario(req.body.idUsuario)
    let data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorUsuariosNoEncontrado()
    let {idUsuario, nuevoRol} = req.body
    if(data.status === 200){
        if(resModel[0].categoria.nombre === nuevoRol){
            let msg = "El usuario ya cuenta con ese rol"
            data = UsuariosDto.templatesErrorUsuarios(msg)
            return res.status(data.status).json(data);
        }
    }
    if(data.status === 200){
        resModel = await objUsuarios.cambiarRolUsuario(idUsuario, nuevoRol)
        if(resModel.acknowledged === true){
            let msg = "Cambio realizado con exito"
            data = UsuariosDto.templatesListarUsuarios(msg)
        }
        else{
            data = UsuariosDto.templatesErrorConsultarUsuarios()
            return res.status(data.status).json(data);
        }
    }
    res.status(data.status).json(data);
}

const consultarPorRol = async(req, res) => {
    let resModel
    let data
    const objUsuarios = new usuarios()
    const UsuariosDto = new usuariosDto()
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    if(req.query.rol === "null"){
        req.query.rol = null
    }
    if(req.query.rol === null){
        resModel = await objUsuarios.getAllMatch() 
        data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorConsultarUsuarios()
    }
    if(req.query.rol === "VIP" || req.query.rol === "administrador" || req.query.rol === "estandar"){
        resModel = await objUsuarios.consultarUsuariosPorRol(req.query.rol)
        data = (resModel.length) ? UsuariosDto.templatesListarUsuarios(resModel) : UsuariosDto.templatesErrorConsultarUsuarios()
    }
    res.status(data.status).json(data);
}

module.exports = {
    crearUsuario,
    encontrarUnUsuario,
    cambiarRol,
    consultarPorRol
}