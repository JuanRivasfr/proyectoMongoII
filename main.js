import { usuarios } from "./js/modules/usuarios.js";
import { boletas } from "./js/modules/boletas.js";
import { funciones } from "./js/modules/funciones.js";
import { peliculas } from "./js/modules/peliculas.js";
import { salas } from "./js/modules/salas.js";
import { ObjectId } from "mongodb";

let check = new boletas()
//Caso de Uso 3
// const objCompraBoletos = {
//     idPelicula : new ObjectId("66a55f092de7f97b635de2c8"),
//     fechaFuncion : new Date("2024-08-16"),
//     horaInicio: "14:00",
//     asientos: ["C3", "C4"],
//     idUsuario: new ObjectId("66a55b542de7f97b635de2c4")
// }
// console.log(await check.comprarBoletos(objCompraBoletos))
//Caso de Uso 4
// const idFuncion = new ObjectId("66a59bcb2de7f97b635de2dc")
// console.log(await check.disponibilidadAsientos(idFuncion));
//Caso de Uso 5
const objReservaBoletos = {
    idFuncion : new ObjectId("66a55f092de7f97b635de2c8"),
    horaInicio: "14:00",
    asientos: ["C3", "C4"],
    idUsuario: new ObjectId("66a55b542de7f97b635de2c4")
}
console.log(await check.reservarAsientos(objReservaBoletos))