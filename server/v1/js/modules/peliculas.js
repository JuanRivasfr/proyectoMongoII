const connect = require("../../helpers/db/connect")
const {ObjectId} = require ("mongodb")

class peliculas extends connect {
    static instance
    constructor() {
        if (typeof peliculas.instance === "object"){
            return peliculas.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("peliculas");
        peliculas.instance = this;
        return this;
    }

    /**
     * Obtiene todos los documentos de la colección.
     * 
     * @async
     * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos que representan todos los documentos en la colección.
     */


    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    /**
     * Obtiene todas las películas que tienen funciones futuras programadas.
     * 
     * @async
     * @returns {Promise<string>} Una promesa que resuelve a una cadena JSON que representa las películas con funciones futuras, excluyendo ciertos campos específicos.
     */

    async getAllMovies(){
        let res = await this.collection.aggregate([
            {
                $lookup: {
                from: "funciones",
                localField: "_id",
                foreignField: "pelicula_id",
                as: "funciones"
                }
            },
            {
                $match: {
                funciones: { $ne: [] }
                }
            },
            {
                $addFields: {
                funciones: {
                    $filter: {
                    input: "$funciones",
                    as: "funcion",
                    cond: { $gte: ["$$funcion.fecha", new Date()] }
                    }
                }
                }
            },
            {
                $project: {
                _id: 0,
                sinopsis: 0,
                "funciones._id": 0,
                "funciones.pelicula_id": 0,
                "funciones.sala_id" : 0
                }
            }
        ]).toArray()
        return(JSON.stringify(res, null, 2))    
    }

    /**
     * Obtiene los detalles de una película específica por su ID.
     * 
     * @async
     * @param {string} idPelicula - El ID de la película que se desea obtener.
     * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene los detalles de la película solicitada, excluyendo ciertos campos específicos.
     */


    async getOneMovie(idPelicula){

        const peliculaExiste = await this.collection.findOne({_id : new ObjectId(idPelicula)})
        if(!peliculaExiste){
            return { error : "La pelicula no existe"}
        }

        let res = await this.collection.aggregate([
            {
                $match: {
                _id: new ObjectId(idPelicula)
                }
            },
            {
                $project: {
                "funciones._id" : 0,
                "funciones.pelicula_id" : 0,
                "funciones.sala_id" : 0
                }
            }
        ]).toArray()
        return res
    }
}

module.exports = peliculas