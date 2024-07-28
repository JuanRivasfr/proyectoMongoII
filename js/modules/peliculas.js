import { connect } from "../../helpers/db/connect.js";

export class peliculas extends connect {
    static instance
    constructor() {
        if (typeof peliculas.instance === "object"){
            return peliculas.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.colecction = this.db.collection("peliculas");
        peliculas.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.colecction.find({}).toArray()
        return activities
    }
}