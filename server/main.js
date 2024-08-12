const Usuarios = require("./js/modules/usuarios")
const Boletas = require("./js/modules/boletas")
const Peliculas = require("./js/modules/peliculas")

const {ObjectId} = require ("mongodb")

const Instance = new Peliculas
Instance.getAllMovies().then(res => {
   console.log(res);
})
