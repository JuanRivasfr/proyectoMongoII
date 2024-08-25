module.exports = class funcionesDto{
    templatesMostrarFunciones(arg){
        return {
            status: 200,
            data: arg
        }
    }

    templatesErrorFechaFuncion(){
        return {
            status: 404,
            message: "La fecha de la funcion debe ser actual o futura"
        }
    }

    templatesErrorNoHayFunciones(){
        return {
            status: 404,
            message: "No hay funciones disponibles para la pelicula"
        }
    }

    templatesErrorNoHayFuncionesHora(){
        return {
            status: 404,
            message: "No hay funciones disponibles para la pelicula en esa hora"
        }
    }

    templatesErrorNoHayFuncionesFecha(){
        return {
            status: 404,
            message: "No hay funciones disponibles para la pelicula en esa fecha"
        }
    }

    templatesErrorAsientosOcupados(msg){
        return {
            status: 404,
            message: msg
        }
    }

}