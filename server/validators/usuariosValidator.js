const { body, query, param } = require("express-validator")

exports.usuarioValidationEmpty = () => {
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
  
exports.validationCreacionUsuario = () => {
    return [
        body('identificacion')
        .notEmpty().withMessage('La identificación es obligatoria')
        .isInt({ min: 1 }).withMessage('La identificación debe ser un número entero positivo'),
        
        body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto'),
        
        body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser una cadena de texto'),
    
        body('nick')
        .notEmpty().withMessage('El nick es obligatorio')
        .isString().withMessage('El nick debe ser una cadena de texto'),
        
        body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email debe ser válido'),
        
        body('telefono')
        .isArray({ min: 1 }).withMessage('El teléfono debe ser un array con al menos un elemento')
        .custom((value) => {
        return value.every(num => typeof num === 'string');
        }).withMessage('Cada teléfono debe ser una cadena de texto')
        .notEmpty().withMessage('El teléfono no puede estar vacío'),
        
        body('categoria')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isObject().withMessage('La categoría debe ser un objeto')
        .custom((value) => {
        return value.nombre && typeof value.nombre === 'string' && value.descuento !== undefined && typeof value.descuento === 'number';
        }).withMessage('La categoría debe tener un nombre (string) y un descuento (number)'),
        
        body('tarjeta')
        .isArray().withMessage('La tarjeta debe ser un array')
    ]
};

