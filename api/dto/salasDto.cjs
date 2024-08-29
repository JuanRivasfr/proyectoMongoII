module.exports = class salasDto{
    templatesMostrarSalas(arg){
        return {
            status: 200,
            data: arg
        }
    }

    templatesErrorAsientosExistentes(msg){
        return {
            status: 404,
            message: msg
        }
    }

    templatesErrorMostrarSalas(){
        return {
            status: 404,
            data: "Ocurrio un error"
        }
    }

}