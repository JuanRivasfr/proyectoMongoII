const connect = require("../helpers/db/connect.js")
const {ObjectId} = require("mongodb")

module.exports = class salas extends connect {
    static instance
    constructor() {
        if (typeof salas.instance === "object"){
            return salas.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("salas");
        salas.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    async obtenerPrecioSalaAsientosTotales(idSalaAux){
        let salaRes = await this.collection.aggregate(
            [
                {
                  $match: {
                    _id : idSalaAux
                  }
                },
                {
                  $project: {
                    _id: 0,
                    asientos: 1,
                    precio: 1
                  }
                }
            ]
        ).toArray()
        return salaRes
    }
}
