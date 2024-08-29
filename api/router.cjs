const router = require("express").Router();
const {listarTodasPeliculas, listarUnaPelicula} = require("./controller/peliculasController.cjs")
const {peliculasValidationEmpty, peliculasValidationRulesFindMovie} = require("./validators/peliculasValidator.cjs")
const {ticketValidationRulesCreation, reservaValidationRulesCreation, boletosValidationRulesFindBoleto, ticketValidationDescuentoAplicado} = require("./validators/boletasValidator.cjs")
const {comprarUnBoleto, reservaUnBoleto, cancelarReserva, aplicarDescuento} = require("./controller/boletasController.cjs")
const {verificarAsientosDisponibles, buscarUnaFuncion} = require('./controller/funcionesController.cjs')
const {peliculasValidacionEncontrarAsientos, peliculasValidacionEncontrarUnaFuncion} = require("./validators/funcionesValidator.cjs")
const {validationCreacionUsuario, usuariosValidationReglasEncotrarUsuario, usuariosValidacionCambiarRol, usuariosValidationReglasEncontrarPorRol} = require("./validators/usuariosValidator.cjs")
const {crearUsuario, encontrarUnUsuario, cambiarRol, consultarPorRol} = require("./controller/usuariosController.cjs")
const {listarSala} = require("./controller/salasController.cjs")
const {salasValidationRulesEcontrarSalas} = require("./validators/salasValidator.cjs")


router.get("/peliculas/c1", peliculasValidationEmpty(), listarTodasPeliculas);
router.get("/peliculas/c2", peliculasValidationRulesFindMovie(), listarUnaPelicula);
router.post("/peliculas/c3", ticketValidationRulesCreation(), comprarUnBoleto);
router.get("/peliculas/c4", peliculasValidacionEncontrarAsientos(), verificarAsientosDisponibles);
router.post("/peliculas/c5", reservaValidationRulesCreation(), reservaUnBoleto);
router.get("/peliculas/c6", boletosValidationRulesFindBoleto(), cancelarReserva);
router.post("/peliculas/c7", ticketValidationDescuentoAplicado(), aplicarDescuento);
router.post("/peliculas/c9", validationCreacionUsuario(), crearUsuario);
router.get("/peliculas/c10", usuariosValidationReglasEncotrarUsuario(), encontrarUnUsuario);
router.post("/peliculas/c11", usuariosValidacionCambiarRol(), cambiarRol);
router.get("/peliculas/c12", usuariosValidationReglasEncontrarPorRol(), consultarPorRol);
router.get("/peliculas/c13", salasValidationRulesEcontrarSalas(), listarSala);
router.get("/peliculas/c14", peliculasValidacionEncontrarUnaFuncion(), buscarUnaFuncion);


module.exports = router;