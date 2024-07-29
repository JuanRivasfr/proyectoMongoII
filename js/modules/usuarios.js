import { connect } from "../../helpers/db/connect.js";

export class usuarios extends connect {
    static instance
    constructor() {
        if (typeof usuarios.instance === "object"){
            return usuarios.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection("usuarios");
        usuarios.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.collection.find({}).toArray()
        return activities
    }

    async validacionUsuario(obj){
        
        let {identificacion, nombre, apellido, nick, email, telefono, categoria, tarjeta} = obj
        
        let res  = await this.collection.find({}).toArray()
        for (let i = 0; i < res.length; i++) {
            if(res[i].identificacion === identificacion){
                return{error: "Ya existe un usuario con esa identificacion"}
            }
            if(res[i].nick === nick){
                return{error: "Ya existe un usuario con ese nick"}
            }
            if(res[i].email === email){
                return{error: "Ya existe un usuario con ese email"}
            }
            if (res[i].telefono && telefono) {
                for (let j = 0; j < res[i].telefono.length; j++) {
                    for (let k = 0; k < telefono.length; k++) {
                        if (res[i].telefono[j] === telefono[k]) {
                            return { error: "El telefono ya esta registrado" };
                        }
                    }
                }
            }
        }

        return(this.crearUsuario(identificacion, nombre, apellido, nick, email, telefono, categoria, tarjeta))

    }

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

        if(res.acknowledged === true){
            return{sucess: "Usuario creado con exito"}
        }
    }

    async crearUsuario(){
        let res = await this.collection.command({
            user: "user1",
            pwd: "password1",
            roles: [
              { role: "readWriteRole", db: "myDatabase" }
            ]
          })
    }

}