import { usuarios } from "./js/modules/usuarios.js";
import { boletas } from "./js/modules/boletas.js";
import { funciones } from "./js/modules/funciones.js";
import { peliculas } from "./js/modules/peliculas.js";
import { salas } from "./js/modules/salas.js";
import { ObjectId } from "mongodb";

let check = new usuarios()
const objUsuario ={
   identificacion: 45612,
   nombre: "Juan",
   apellido: "Rivas",
   nick: "riv356l",
   email: "sebasriurr@gmail.com",
   telefono: ["4561564745"],
   categoria: {
      nombre: "administrador",   
      descuento: 0
   },
   tarjeta: []
}
console.log(await check.validacionUsuario(objUsuario))  