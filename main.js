import { usuarios } from "./js/modules/usuarios.js";
import { boletas } from "./js/modules/boletas.js";
import { funciones } from "./js/modules/funciones.js";
import { peliculas } from "./js/modules/peliculas.js";
import { salas } from "./js/modules/salas.js";

let check = new peliculas()
console.log(await check.getAllMovies())  