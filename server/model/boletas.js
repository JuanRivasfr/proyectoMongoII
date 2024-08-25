const connect = require("../helpers/db/connect")
const {ObjectId} = require("mongodb")

module.exports = class boletas extends connect {
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

    /**
   * Obtiene todas las boletas de la colección.
   * 
   * @async
   * @returns {Promise<Array>} Una promesa que resuelve a un array de todas las boletas.
   */

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    /**
   * Compra boletos para una función de película.
   * 
   * @async
   * @param {Object} obj - El objeto que contiene los detalles de la compra.
   * @param {string} obj.idPelicula - El ID de la película.
   * @param {Date} obj.fechaFuncion - La fecha de la función.
   * @param {string} obj.horaInicio - La hora de inicio de la función.
   * @param {Array<string>} obj.asientos - Los asientos seleccionados.
   * @param {string} obj.idUsuario - El ID del usuario.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene el resultado de la compra o un mensaje de error.
   */

    async comprarBoletos(obj){
        
        let {idPelicula, fechaFuncion, horaInicio, asientos, idUsuario} = obj

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

        return res
    }
    
    async agregarBoletos(asientos, funcionId, usuarioId, tipo_compra){
        let res = await this.collection.insertOne({
            asientos : asientos,
            fecha_adquisicion : new Date(),
            funcion_id : funcionId,
            cliente_id : usuarioId,
            tipo_compra : tipo_compra
        })
        return res
    }

    /**
   * Agrega boletos para una función de película.
   * 
   * @async
   * @param {Array<string>} asientos - Los asientos seleccionados.
   * @param {string} funcionId - El ID de la función.
   * @param {string} usuarioId - El ID del usuario.
   * @param {string} tipo_compra - El tipo de compra (compra o reserva).
   * @param {number} precioSala - El precio de la sala.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene el resultado de la operación y los detalles de la compra/reserva.
   */

    async reservarAsientos(obj){
      let {idFuncion, asientos, idUsuario} = obj

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

      return res

    }

    /**
   * Valida una reserva de boleto.
   * 
   * @async
   * @param {string} idBoleto - El ID del boleto.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene el resultado de la operación o un error si la validación falla.
   */

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

    /**
   * Elimina una reserva de boleto.
   * 
   * @async
   * @param {string} idBoleto - El ID del boleto a eliminar.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene el resultado de la operación o un error si la eliminación falla.
   */

    async eliminarReserva(idBoleto){
      let res = await this.collection.deleteOne({
        _id : idBoleto
      })

      if(res.acknowledged === true){
        return {sucess: "La reserva se ha eliminado de forma correcta"}
      }
      
    }

    /**
   * Aplica un descuento al precio total de una compra si el usuario es VIP y tiene una tarjeta activa.
   * 
   * @async
   * @param {Object} objeto - Objeto que contiene los datos de la compra.
   * @param {string} objeto.sucess - Estado de la compra.
   * @param {number} objeto.precioTotal - Precio total de la compra antes del descuento.
   * @param {string} objeto.usuarioId - ID del usuario que realiza la compra.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene el resultado de la operación o un error si el descuento no puede aplicarse.
   */

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

    /**
   * Procesa una compra en línea, incluyendo la aplicación de descuentos si es aplicable.
   * 
   * @async
   * @param {Object} obj - Objeto que contiene la información de la compra.
   * @param {string} obj.idPelicula - ID de la película para la que se compran los boletos.
   * @param {Date} obj.fechaFuncion - Fecha de la función de la película.
   * @param {string} obj.horaInicio - Hora de inicio de la función.
   * @param {Array<string>} obj.asientos - Lista de asientos que se quieren comprar.
   * @param {string} obj.idUsuario - ID del usuario que realiza la compra.
   * @returns {Promise<Object>} Una promesa que resuelve a un objeto que contiene el resultado de la compra, incluyendo detalles sobre el descuento aplicado, si corresponde.
   */

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

    async disponibilidadAsientosCompraBoletos(idFuncion){
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
      return asientosRes

    }

}
