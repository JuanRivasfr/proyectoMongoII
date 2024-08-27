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

}