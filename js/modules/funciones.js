import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";

export class funciones extends connect {
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

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    async disponibilidadAsientos(idFuncion){

        //Validar si existe la funcion
        const funcionExiste = await this.collection.findOne({_id : new ObjectId(idFuncion)})
        if(!funcionExiste){
            return { error : "La funcion no existe"}
        }

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
        let {asientosSala, asientosOcupados} = res[0]

        const asientosCombinados = [...asientosSala, ...asientosOcupados]

        const asientosDisponibles = asientosCombinados.filter(val => {
            return (asientosSala.includes(val) && !asientosOcupados.includes(val))
        })

        if (asientosDisponibles.length > 0) {
            return {
                success: "Hay asientos disponibles",
                asientosDisponibles: asientosDisponibles
            };
        } else {
            return { error: "No hay asientos disponibles" };
        }
    }
}