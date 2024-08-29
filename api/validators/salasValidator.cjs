const { body, query, param } = require("express-validator")

exports.salasValidationRulesEcontrarSalas = () => {
    return [
        query('id', 'El id no se envió').notEmpty().isMongoId().withMessage("El id no es valido")
    ];
};