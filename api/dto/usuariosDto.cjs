module.exports = class usuariosDto{
    templatesListarUsuarios(arg){
        return {
            status: 200,
            data: arg
        }
    }

    templatesErrorUsuariosNoEncontrado(){
        return {
            status: 404,
            message: "No se encontro el usuario"
        }
    }

    templatesErrorConsultarUsuarios(){
        return {
            status: 404,
            message: "Ocurrio un error"
        }
    }

    templatesErrorUsuarios(msg){
        return {
            status: 404,
            message: msg
        }
    }

    templatesUsuarioCreado(usuario, psw){
        return {
            status: 200,
            message: "El usuario se creo exitosamente",
            usuario: usuario,
            pdw: psw
        }
    }

}