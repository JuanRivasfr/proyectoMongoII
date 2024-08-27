module.exports = class peliculasDto{
    templatesListarPeliculas(arg){
        return {
            status: 200,
            data: arg
        }
    }

    templatesErrorPeliculas(){
        return {
            status: 404,
            message: "No se encontro la/s pelicula/s"
        }
    }

}