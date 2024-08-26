const Connect = require("../helpers/db/connect")
const {ObjectId} = require ("mongodb")

module.exports = class Usuarios extends Connect {
    static instance
    constructor() {
        if (typeof Usuarios.instance === "object"){
            return Usuarios.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("usuarios");
        Usuarios.instance = this;
        return this;
    }

    /**
     * Obtiene todas las actividades de la colección.
     * 
     * @async
     * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos, donde cada objeto representa una actividad en la colección.
     */

    async getAllMatch() {
        let res  = await this.collection.find({}).toArray()
        return res
    }

    async buscarUnUsuario(idUsuario){

        let res = await this.collection.aggregate([
            {
                $match: {
                  _id : idUsuario
                }
            }
        ]).toArray()
        return res

    }

    /**
     * Crea un nuevo usuario en la base de datos.
     * 
     * @async
     * @param {string} identificacion - Identificación del nuevo usuario.
     * @param {string} nombre - Nombre del nuevo usuario.
     * @param {string} apellido - Apellido del nuevo usuario.
     * @param {string} nick - Nick del nuevo usuario.
     * @param {string} email - Email del nuevo usuario.
     * @param {Array<string>} telefono - Lista de números de teléfono del nuevo usuario.
     * @param {string} categoria - Categoría del nuevo usuario.
     * @param {Array<Object>} tarjeta - Información de la tarjeta del nuevo usuario.
     * @returns {Promise<Object>} Una promesa que resuelve a un objeto que indica el éxito de la creación del usuario.
     */

    async crearUsuario(identificacion, nombre, apellido, nick, email, telefono, categoria, tarjeta){
        
        let res = await this.collection.insertOne({
            identificacion: identificacion,
            nombre: nombre,
            apellido: apellido,
            nick: nick,
            email: email,  
            telefono: telefono,
            categoria: categoria,
            tarjeta: tarjeta
        })

        return res
    }

    /**
     * Consulta un usuario en la base de datos por su ID.
     * 
     * @async
     * @param {string} idUsuario - ID del usuario a consultar.
     * @returns {Promise<Object|null>} Una promesa que resuelve a un objeto que representa al usuario, o `null` si el usuario no existe.
     */

    async consultarUsuario(idUsuario){

        let res = await this.collection.findOne({_id : idUsuario})
        return res
    }

    /**
     * Cambia el rol de un usuario en la base de datos.
     * 
     * @async
     * @param {Object} obj - Objeto que contiene la información para el cambio de rol.
     * @param {string} obj.idUsuario - ID del usuario cuyo rol se desea cambiar.
     * @param {string} obj.nuevoRol - El nuevo rol que se desea asignar al usuario. Debe ser "VIP" o "estandar".
     * @returns {Promise<Object>} Una promesa que resuelve a un objeto que indica el resultado del cambio de rol.
     * - Si el cambio fue exitoso: `{ success: "Cambio realizado con exito" }`
     * - Si hubo un error: `{ error: "mensaje de error" }`
     */

    async cambiarRolUsuario(idUsuario, nuevoRol){

        const actualizarUsuario = await this.collection.updateOne(
            { _id: idUsuario },
            { $set: { 'categoria.nombre': nuevoRol }}
        );

        return actualizarUsuario

    }

    /**
     * Consulta los usuarios en la base de datos según el rol especificado.
     * 
     * @async
     * @param {string|null} rol - El rol de los usuarios a consultar. Puede ser "VIP", "estandar", "administrador", o `null` para consultar todos los usuarios.
     * @returns {Promise<Object[]>|Promise<Object>} Una promesa que resuelve a un array de objetos que representan los usuarios con el rol especificado o todos los usuarios si `rol` es `null`. 
     * - Si el rol no es válido: `{ error: "El rol a consultar debe ser VIP, estandar, administrador o null" }`
     */

    async consultarUsuariosPorRol(rol){
        
        let res = await this.collection.aggregate(
        [
            {
                $match: {
                "categoria.nombre" : rol
                }
            }
            ]
        ).toArray()

        return res
        
    }

    /**
     * Crea un nuevo usuario en MongoDB con el rol correspondiente según la categoría.
     * 
     * @async
     * @param {string} nick - El nombre de usuario.
     * @param {string} pwd - La contraseña del usuario.
     * @param {string} categoria - La categoría del usuario, puede ser "VIP" o "estandar".
     * @returns {Promise<Object>} Una promesa que resuelve a un objeto con el nombre de usuario y la contraseña.
     */

    async crearUsuarioMongo(nick, pwd, rol){

        const newUser = await this.db.command({
            createUser: nick,
            pwd: pwd, 
            roles: [
                { role: rol, db: this.getDbName}
            ]
        })

        return newUser
    }

    async consultarTarjetaUsuarios(usuarioId){
        let res = await this.collection.aggregate(
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

        return res
    }
}
