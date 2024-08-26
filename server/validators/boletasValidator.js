const { body, query, param } = require("express-validator")

exports.boletosValidationEmpty = () => {
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

exports.ticketValidationRulesCreation = () => {
        return [
            body('idPelicula').notEmpty().isMongoId().withMessage('El id es obligatorio'),
            body('fechaFuncion').notEmpty().isDate().withMessage('La fecha de la funcion es obligatoria'),
            body('horaInicio').notEmpty().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora es obligatoria y debe estar en formato "HH:mm'),
            body('asientos').notEmpty().isArray().withMessage('El campo debe ser un array').custom((array) => {
                return array.every(elemento => /^[A-Z]\d{1,2}$/.test(elemento))
            }).withMessage('Cada elemento del array debe ser una letra mayúscula seguida de uno o dos números.'),
            body('idUsuario').notEmpty().isMongoId().withMessage('El idUsuario es obligatorio')
        ]
};

exports.reservaValidationRulesCreation = () => {
    return [
        body('idFuncion').notEmpty().isMongoId().withMessage('El id es obligatorio'),
        body('asientos').notEmpty().isArray().withMessage('El campo debe ser un array').custom((array) => {
            return array.every(elemento => /^[A-Z]\d{1,2}$/.test(elemento))
        }).withMessage('Cada elemento del array debe ser una letra mayúscula seguida de uno o dos números.'),
        body('idUsuario').notEmpty().isMongoId().withMessage('El idUsuario es obligatorio')
    ]
};

exports.boletosValidationRulesFindBoleto = () => {
    return [
        query('id', 'El id no se envió').notEmpty().isMongoId().withMessage("El id no es valido")
    ];
};

exports.ticketValidationDescuentoAplicado = () => {
    return [
        body('precioTotal').notEmpty().withMessage('El precioTotal es obligatorio').isFloat({ min: 0 }).withMessage('El precio total debe ser un número válido'),
        body('idUsuario').notEmpty().isMongoId().withMessage('El id es obligatorio')
    ]
};