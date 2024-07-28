import { connect } from "../../helpers/db/connect.js";

export class usuarios extends connect {
    static instance
    constructor() {
        if (typeof usuarios.instance === "object"){
            return usuarios.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.colecction = this.db.collection("usuarios");
        usuarios.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.colecction.find({}).toArray()
        return activities
    }
}