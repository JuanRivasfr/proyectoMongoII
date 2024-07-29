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
          if(tipo_compra === "compra"){
            return{sucess : "Se compraron los boletos de forma exitosa",
              precioTotal : precioTotal,
              idUsuario : usuarioId,
              funcionId : funcionId,
              asientos : asientos
            }
          }
          if(tipo_compra === "reserva"){
            return{sucess : "Se reservaron los boletos de forma exitosa",
              precioTotal : precioTotal
            } 
          }
        }
        console.log(res);
        
    }

    async reservarAsientos(obj){
      let {idFuncion, asientos, idUsuario} = obj

      const funcionExiste = await this.db.collection("funciones").findOne({_id : idFuncion})
        if(!funcionExiste){
            return { error : "La funcion no existe"}
        }

      const usuarioExiste = await this.db.collection("usuarios").findOne({_id : idUsuario})
      if(!usuarioExiste){
          return { error : "El usuario no existe"}
      } 

      let res = await this.db.collection("funciones").aggregate(
        [
          {
              $match: {
                  _id: new ObjectId("66a59bcb2de7f97b635de2dc")
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
              $lookup: {
                  from: "boletas",
                  localField: "_id",
                  foreignField: "funcion_id",
                  as: "boletas"
              }
          },
          {
              $group: {
                  _id: "$_id",
                  fieldN: {
                      $push: "$boletas.asientos"
                  },
                  asientosTotales: {
                      $first: "$salas.asientos"
                  },
                  precio: { $first: "$salas.precio" }
              }
          },
          {
              $unwind: "$fieldN"
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
                  asientosTotales: 1,
                  precio: 1,
                  _id: 0
              }
          }
        ]
      ).toArray()
      
      let {asientosTotales, precio, asientosOcupados} = res[0]

      const asientosCombinados = [...asientosTotales, ...asientosOcupados]

      const asientosDisponibles = asientosTotales.filter(val => {
          return (asientosTotales.includes(val) && !asientosOcupados.includes(val))
      })

      const asientosConflictivos = asientosTotales.filter(val => {
        return (!asientosDisponibles.includes(val) && asientos.includes(val))
      })
      
      if(asientosConflictivos.length > 0){
        return{ error : `Los siguientes asientos estan ocupados: ${asientosConflictivos.join(", ")}`}
      }

      const asientosNoExisten = asientos.filter(val => {
        return (asientos.includes(val) && !asientosTotales.includes(val))
      })

      if(asientosNoExisten.length > 0){
        return{ error : `Los siguientes asientos no existen: ${asientosNoExisten.join(", ")}`}
      }

      return(this.agregarBoletos(asientos, idFuncion, idUsuario, "reserva", precio))

    }

    async validarReserva(idBoleto){
      const boletoExiste = await this.collection.findOne({_id : new ObjectId(idBoleto)})
        if(!boletoExiste){
            return { error : "El boleto no existe"}
      }
      
      let {_id, asientos, fecha_adquisicion, funcion_id, cliente_id, tipo_compra} = boletoExiste
      

      if(tipo_compra === "compra"){
        return{ error : "Los boletos deben ser una reserva no una compra"}
      }

      return this.eliminarReserva(idBoleto)
    }

    async eliminarReserva(idBoleto){
      let res = await this.collection.deleteOne({
        _id : idBoleto
      })

      if(res.acknowledged === true){
        return {sucess: "La reserva se ha eliminado de forma correcta"}
      }
      
    }

    async aplicarDescuento(objeto){
      
      let {sucess, precioTotal, usuarioId} = objeto;
      
      let res = await this.db.collection("usuarios").aggregate(
        [
          {
            $match: {
              _id: usuarioId
            }
          },
          {
            $project: {
              "categoria": "$categoria.nombre",
              "descuento": "$categoria.descuento",
              _id: 0,
              "estadoTarjeta": {
                $ifNull: [
                  { $arrayElemAt: ["$tarjeta.estado", 0] },
                  []
                ]
              }
            }
          },
          {
            $unwind: {
              path: "$estadoTarjeta",
              preserveNullAndEmptyArrays: true 
            }
          }
        ]
      ).toArray();
    
      if (res.length === 0) {
        return { error: "Usuario no encontrado" };
      }
    
      let { categoria, descuento, estadoTarjeta } = res[0];
      if (categoria === "VIP") {
        if (estadoTarjeta === "activa") {
          let descuentoAplicado = (precioTotal * (descuento / 100));
          precioTotal = precioTotal - descuentoAplicado;
          return {
            sucess: "Descuento aplicado con exito",
            precioTotal: precioTotal,
            descuentoAplicado: descuentoAplicado
          };
        } else if (estadoTarjeta === undefined) {
          return { error: "El usuario no cuenta con tarjeta" };
        } else {
          return { error: "La tarjeta no esta activa actualmente" };
        }
      } else {
        return { error: "El usuario no es VIP" };
      }
    }

    async compraEnLinea(obj){
      let res = await this.comprarBoletos(obj)
      if(res.sucess){ 
        let {sucess, precioTotal, idUsuario : usuarioId, funcionId, asientos} = res
        const objDescuento = {
          sucess : sucess,
          precioTotal: precioTotal,
          usuarioId: usuarioId
        }
        let resDescuento = await this.aplicarDescuento(objDescuento)   
        if(resDescuento.sucess){
          return{
            sucess : "Boletos comprados con exito",
            funcion: funcionId,
            asientos: asientos,
            precioTotal: resDescuento.precioTotal,
            descuentoAplicado: resDescuento.descuentoAplicado
          }
        }
        if(!resDescuento.sucess){
          return{ 
            sucess : "Boletos comprados con exito", 
            funcion: funcionId,
            asientos: asientos,
            precioTotal: precioTotal
          }
        }
      }
      else{
        return res
      }
      
    }
}