import { connect } from "../../helpers/db/connect.js";

export class boletas extends connect {
    static instance
    constructor() {
        if (typeof boletas.instance === "object"){
            return boletas.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.colecction = this.db.collection("boletas");
        boletas.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.colecction.find({}).toArray()
        return activities
    }
}