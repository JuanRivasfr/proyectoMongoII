const connect = require("../helpers/db/connect.cjs")
const {ObjectId} = require ("mongodb")

module.exports = class peliculas extends connect {
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
                    $unwind: "$funciones"    
            },
            {
                $match: {
                    funciones: { $ne: [] }    
                }
            },
            {
                $group: {
                    _id: "$_id",                
                    titulo: { $first: "$titulo" }, 
                    genero: { $first: "$genero" }, 
                    duracion: { $first: "$duracion" }, 
                    sinopsis: { $first: "$sinopsis" }, 
                    funciones: { $push: "$funciones" } ,
                    imagen : {$first: "$imagen"}
                }
            }
        ]).toArray()
        return(res)    
    }

    /**
     * Obtiene los detalles de una película específica por su ID.
     * 
     * @async
     * @param {string} idPelicula - El ID de la película que se desea obtener.
     * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene los detalles de la película solicitada, excluyendo ciertos campos específicos.
     */


    async getOneMovie(idPelicula){

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

