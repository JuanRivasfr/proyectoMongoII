const connect = require("../../../helpers/db/connect.js")

module.exports = class salas extends connect {
    static instance
    constructor() {
        if (typeof salas.instance === "object"){
            return salas.instance
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.colecction = this.db.collection("salas");
        salas.instance = this;
        return this;
    }

    async getAllMatch() {
        let activities  = await this.colecction.find({}).toArray()
        return activities
    }
}
