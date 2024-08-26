const router = require("express").Router();
const {listarTodasPeliculas, listarUnaPelicula} = require("./controller/peliculasController")
const {peliculasValidationEmpty, peliculasValidationRulesFindMovie} = require("./validators/peliculasValidator")
const {ticketValidationRulesCreation, reservaValidationRulesCreation, boletosValidationRulesFindBoleto, ticketValidationDescuentoAplicado} = require("./validators/boletasValidator")
const {comprarUnBoleto, reservaUnBoleto, cancelarReserva, aplicarDescuento} = require("./controller/boletasController")
const {verificarAsientosDisponibles} = require('./controller/funcionesController')
const {peliculasValidacionEncontrarAsientos} = require("./validators/funcionesValidator")
const {validationCreacionUsuario} = require("./validators/usuariosValidator")
const {crearUsuario} = require("./controller/usuariosController")

router.get("/peliculas/c1", peliculasValidationEmpty(), listarTodasPeliculas);
router.get("/peliculas/c2", peliculasValidationRulesFindMovie(), listarUnaPelicula);
router.post("/peliculas/c3", ticketValidationRulesCreation(), comprarUnBoleto);
router.get("/peliculas/c4", peliculasValidacionEncontrarAsientos(), verificarAsientosDisponibles);
router.post("/peliculas/c5", reservaValidationRulesCreation(), reservaUnBoleto);
router.get("/peliculas/c6", boletosValidationRulesFindBoleto(), cancelarReserva);
router.post("/peliculas/c7", ticketValidationDescuentoAplicado(), aplicarDescuento);
router.post("/peliculas/c9", validationCreacionUsuario(), crearUsuario);

module.exports = router;