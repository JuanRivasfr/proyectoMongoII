const {MongoClient} = require("mongodb");
require('dotenv').config();

module.exports = class Connect {
    static instance;
    user;
    port;
    #pass;
    #host;
    #cluster;
    #dbName
    constructor() {
        this.user = process.env.VITE_USER
        this.port = process.env.VITE_PORT
        this.setPass = process.env.VITE_PASS
        this.setHost = process.env.VITE_MONGO_HOST
        this.setCluster = process.env.VITE_CLUSTER
        this.setDbName = process.env.VITE_DBNAME
        this.#open();
        this.db = this.conexion.db(this.getDbName);
    }
    set setPass(pass) {
        this.#pass = pass;
    }
    set setHost(host) {
        this.#host = host;
    }
    set setCluster(cluster) {
        this.#cluster = cluster;
    }
    set setDbName(dbName) {
        this.#dbName = dbName;
    }
    get getPass(){
        return this.#pass
    }
    get getHost(){
        return this.#host
    }
    get getCluster(){
        return this.#cluster
    }
    get getDbName(){
        return this.#dbName
    }
    async #open () {
        this.conexion = new MongoClient(`${this.getHost}${this.user}:${this.getPass}@${this.getCluster}:${this.port}/${this.#dbName}`)
        this.conexion.connect();
    }
    async reconnect(){
        await this.#open();
    }
    async close(){
        await this.conexion.close();
    }
}