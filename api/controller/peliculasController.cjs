const {validationResult} = require("express-validator");
const peliculas = require("../model/peliculas.cjs");
const peliculasDto = require("../dto/peliculasDto.cjs");

const listarTodasPeliculas = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const PeliculasDto = new peliculasDto()
    const objPeliculas = new peliculas()
    let resModel = await objPeliculas.getAllMovies();
    let data = (resModel.length) ? PeliculasDto.templatesListarPeliculas(resModel) : PeliculasDto.templatesErrorPeliculas()
    res.status(data.status).json(data);
}

const listarUnaPelicula = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const PeliculasDto = new peliculasDto()
    const objPeliculas = new peliculas()
    let resModel = await objPeliculas.getOneMovie(req.query.id);
    let data = (resModel.length) ? PeliculasDto.templatesListarPeliculas(resModel) : PeliculasDto.templatesErrorPeliculas()
    res.status(data.status).json(data);
}

module.exports = {
    listarTodasPeliculas,
    listarUnaPelicula
}