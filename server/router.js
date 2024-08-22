const router = require("express").Router();
const {listarTodasPeliculas, listarUnaPelicula} = require("./controller/peliculasController")
const {peliculasValidationEmpty, peliculasValidationRulesFindMovie} = require("./validators/peliculasValidator")
const {ticketValidationRulesCreation} = require("./validators/boletasValidator")
const {comprarUnBoleto} = require("./controller/boletasController")

router.get("/peliculas/c1", peliculasValidationEmpty(), listarTodasPeliculas);
router.get("/peliculas/c2", peliculasValidationRulesFindMovie(), listarUnaPelicula);
router.post("/peliculas/c3", ticketValidationRulesCreation(), comprarUnBoleto)

module.exports = router;