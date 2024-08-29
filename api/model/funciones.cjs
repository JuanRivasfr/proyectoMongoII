const connect = require("../helpers/db/connect.cjs")
const {ObjectId} = require ("mongodb")

module.exports = class funciones extends connect {
    static instance
    constructor() {
        if (typeof funciones.instance === "object"){
            return funciones.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("funciones");
        funciones.instance = this;
        return this;
    }

    /**
   * Recupera todos los documentos de la colección.
   * 
   * @async
   * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos que representan todos los documentos en la colección.
   */

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    /**
   * Verifica la disponibilidad de asientos para una función específica.
   * 
   * @async
   * @param {string} idFuncion - ID de la función para la que se verifica la disponibilidad de asientos.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que indica si hay asientos disponibles y proporciona una lista de asientos disponibles, si corresponde.
   * @returns {Object} - En caso de éxito, el objeto contiene una propiedad `success` con un mensaje y una lista de `asientosDisponibles`. En caso de error, el objeto contiene una propiedad `error` con un mensaje de error.
   */

    async disponibilidadAsientos(idFuncion){

        let res = await this.collection.aggregate(
            [
                {  
                  $match: {
                    _id: idFuncion
                  }
                },
                {
                  $lookup: {
                    from: "boletas",
                    localField: "_id",
                    foreignField: "funcion_id",
                    as: "boletos"
                  }
                },
                {
                  $lookup: {
                    from: "salas",
                    localField: "sala_id",
                    foreignField: "_id",
                    as: "salas"
                  }
                },
                {
                  $unwind: "$salas"
                },
                {
                  $unwind: "$boletos"
                },
                {
                  $group: {
                    _id: "$_id",
                    asientosOcupados: {
                      $push: "$boletos.asientos"
                    },
                    asientosSala: { $first: "$salas.asientos" }
                  }
                },
                {
                  $project: {
                    asientosOcupados: {
                      $reduce: {
                        input: "$asientosOcupados",
                        initialValue: [],
                        in: {
                          $concatArrays: ["$$value", "$$this"]
                        }
                      }
                    },
                    asientosSala: 1,
                    _id: 0
                  }
                }
              ]
        ).toArray()
        return res
    }

    async buscarUnaFuncion(idFuncion){

      let res = await this.collection.aggregate([
          {
              $match: {
                _id : idFuncion
              }
          }
      ]).toArray()
      return res

  }
}