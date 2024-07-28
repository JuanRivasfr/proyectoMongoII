import { connect } from "../../helpers/db/connect.js";
import { ObjectId } from "mongodb";
import { salas } from "./salas.js";

export class boletas extends connect {
    static instance
    constructor() {
        if (typeof boletas.instance === "object"){
            return boletas.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("boletas");
        boletas.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    async comprarBoletos(obj){
        
        let {idPelicula, fechaFuncion, horaInicio, asientos, idUsuario} = obj

        //Validar si existe la pelicula
        const peliculaExiste = await this.db.collection("peliculas").findOne({_id : new ObjectId(idPelicula)})
        if(!peliculaExiste){
            return { error : "La pelicula no existe"}
        }

        //Validar si existe el usuario
        const usuarioExiste = await this.db.collection("usuarios").findOne({_id : new ObjectId(idUsuario)})
        if(!usuarioExiste){
            return { error : "El usuario no existe"}
        }
        
        //Validar que la fecha sea actual o futura
        if(fechaFuncion.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)){
            return {error: "La fecha debe ser la actual o futura"}
        }

        let res = await this.db.collection("peliculas").aggregate(
            [
                {
                  $match: {
                    _id: idPelicula
                  }
                },
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
                  $project: {
                    "funciones.pelicula_id" : 0,
                    "funciones.sala_id" : 0
                  }
                }
            ]
        ).toArray()

        if(res.length === 0){
            return({ error: "La pelicula no tiene funciones disponibles"})
        }

        let funciones = res[0].funciones
        let banderaFunciones = false
        let banderaFuncionesHora = false
        let idFuncion = null
        for (let i = 0; i < funciones.length; i++) {
            if(funciones[i].fecha.setHours(0, 0, 0, 0) === fechaFuncion.setHours(0, 0, 0, 0)){
                banderaFunciones = true
                if(funciones[i].hora_inicio === horaInicio){
                    banderaFuncionesHora = true
                    idFuncion = funciones[i]._id
                }
            }
        }

        if(!banderaFunciones){
            return{error: "No hay funciones para la pelicula estipulada en esa fecha"}
        }

        if(!banderaFuncionesHora){
            return{error: "No hay funciones en esa hora en esa fecha para la pelicula estipulada"}
        }
        
        let asientosRes = await this.collection.aggregate(
            [
                {
                  $lookup: {
                    from: "funciones",
                    localField: "funcion_id",
                    foreignField: "_id",
                    as: "funciones"
                  }
                },
                {
                  $match: {
                    "funciones._id" : new ObjectId(idFuncion)
                  }
                },
                {
                  $group: {
                    _id: "$funciones.sala_id",
                    fieldN: {
                      $push: "$asientos"
                    }
                  }
                },
                {
                  $unwind: "$_id"
                },
                {
                  $project: {
                    asientosOcupados: {
                      $reduce: {
                        input: "$fieldN",
                        initialValue: [],
                        in: {
                          $concatArrays: ["$$value", "$$this"]
                        }
                      }
                    },
                    idSala: "$_id",
                    _id: 0,
                  }
                }
              ]
        ).toArray()
        let {asientosOcupados, idSala, precio} = asientosRes[0]
        
        
        if(asientosOcupados.length > 0){
            const asientosConflictivos = asientos.filter(val => asientosOcupados.includes(val))
            if(asientosConflictivos.length > 0){
                return{ error : `Los siguientes asientos ya están ocupados: ${asientosConflictivos.join(", ")}`}
            }
        }
        
        let salaRes = await this.db.collection("salas").aggregate(
            [
                {
                  $match: {
                    _id : new ObjectId('66a59a792de7f97b635de2d7')
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
        
        let {precio : precioSala, asientos: asientosTotales} = salaRes[0]
        
        const asientosNoExisten =   asientos.filter(val => !asientosTotales.includes(val))
        if(asientosNoExisten.length > 0){
            return{ error : `Los siguientes asientos no existen: ${asientosNoExisten.join(", ")}`}
        }

        return(this.agregarBoletos(asientos, idFuncion, idUsuario, "compra", precioSala))

    }
    
    async agregarBoletos(asientos, funcionId, usuarioId, tipo_compra, precioSala){
        let res = await this.collection.insertOne({
            asientos : asientos,
            fecha_adquisicion : new Date(),
            funcion_id : funcionId,
            cliente_id : usuarioId,
            tipo_compra : tipo_compra
        })
        let totalAsientosComprados = asientos.length
        let precioTotal = precioSala * totalAsientosComprados
        
        if(res.acknowledged === true){
            return{sucess : "Se compraron los boletos de forma exitosa",
                    precioTotal : precioTotal
            }
        }
        console.log(res);
        
    }

    async reservarAsientos(){
        
    }
}