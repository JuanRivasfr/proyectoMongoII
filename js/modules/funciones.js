import { connect } from "../../helpers/db/connect.js";

export class funciones extends connect {
    static instance
    constructor() {
        if (typeof funciones.instance === "object"){
            return funciones.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.colecction = this.db.collection("funciones");
        funciones.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.colecction.find({}).toArray()
        return activities
    }
}