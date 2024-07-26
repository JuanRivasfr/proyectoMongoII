import { connect } from "../../helpers/db/connect.js";

export class example extends connect {
    static instance
    constructor() {
        if (typeof example.instance === "object"){
            return example.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.colecction = this.db.collection("usuarios");
        example.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.colecction.find({}).toArray()
        return activities
    }
}