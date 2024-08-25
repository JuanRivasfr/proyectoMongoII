module.exports = class usuariosDto{
    templatesListarUsuarios(arg){
        return {
            status: 200,
            data: arg
        }
    }

    templatesErrorUsuarios(){
        return {
            status: 404,
            message: "No se encontro el usuario"
        }
    }

}