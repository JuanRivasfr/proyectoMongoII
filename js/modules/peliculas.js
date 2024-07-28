import { connect } from "../../helpers/db/connect.js";

export class peliculas extends connect {
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

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    //Caso de uso #1
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
}