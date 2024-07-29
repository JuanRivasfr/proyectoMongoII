import { usuarios } from "./js/modules/usuarios.js";
import { boletas } from "./js/modules/boletas.js";
import { funciones } from "./js/modules/funciones.js";
import { peliculas } from "./js/modules/peliculas.js";
import { salas } from "./js/modules/salas.js";
import { ObjectId } from "mongodb";

let check = new peliculas()
//Caso de Uso 1
// console.log(await check.getAllMovies());
//Caso de Uso 2
// let idPelicula = new ObjectId('66a55f092de7f97b635de2c8')
// console.log(await check.getOneMovie(idPelicula));
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
// const objReservaBoletos = {
//     idFuncion : new ObjectId("66a59bcb2de7f97b635de2dc"),
//     asientos: ["D2"],
//     idUsuario: new ObjectId("66a55b542de7f97b635de2c4")
// }
// console.log(await check.reservarAsientos(objReservaBoletos))
//Caso de Uso 6 
// const idBoleto = new ObjectId("66a67d06e73d622e5f052331")
// console.log(await check.validarReserva(idBoleto))
//Caso de uso 7 y 8
//   const objDescuento = {
//       sucess : "Se reservaron los boletos de forma exitosa",
//       precioTotal :   19.5,
//       usuarioId : new ObjectId("66a55b542de7f97b635de2c6")
//       } 
//       console.log(await check.aplicarDescuento(objDescuento)) 
//Caso de uso 9
// const objUsuario ={
//     identificacion: 124567,
//     nombre: "Juan",
//     apellido: "Rivas",
//     nick: "rivoo",
//     email: "sebasriurr@gmail.com",
//     telefono: ["4561564789"],
//     categoria: {
//         nombre: "estandar",
//         descuento: 0
//     },
//     tarjeta: []
// }
// console.log(await check.validacionUsuario(objUsuario)) 
//Caso de uso 10
// let idUsuario = new ObjectId("66a55b542de7f97b635de2c3")
// console.log(await check.consultarUsuario(idUsuario))
//Caso de uso 11
// let objActualizar = {
//     idUsuario : new ObjectId("66a55b542de7f97b635de2c3"),
//     nuevoRol : "estandar"
// }
// console.log(await check.cambiarRolUsuario(objActualizar));
//Caso de uso 12
// let buscarUsuarios = "VIP"
// console.log(await check.consultarUsuariosPorRol(buscarUsuarios));
//Caso de uso 13 y 14
//   const objCompraBoletos = {
//            idPelicula : new ObjectId("66a55f092de7f97b635de2c8"),
//            fechaFuncion : new Date("2024-08-16"),
//            horaInicio: "14:00",
//            asientos: ["D3"], 
//            idUsuario: new ObjectId("66a55b542de7f97b635de2c4")
//        }
//   console.log(await check.compraEnLinea(objCompraBoletos))