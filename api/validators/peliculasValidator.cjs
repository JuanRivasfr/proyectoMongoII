const { body, query, param } = require("express-validator")

exports.peliculasValidationEmpty = () => {
    return [
        body().custom((value, { req }) => {
            if (!(Object.keys(req.body).length === 0)) {
                throw new Error('No envíe nada en el cuerpo');
            }
            return true;
        }),
        query().custom((value, { req }) => {
            if (!(Object.keys(req.query).length === 0)) {
                throw new Error('No envíe nada en la url');
            }
            return true;
        })
    ];
}; 

exports.peliculasValidationRulesFindMovie = () => {
    return [
        query('id', 'El id no se envió').notEmpty().isMongoId().withMessage("El id no es valido")
    ];
};