//? recordar que los middlewares en express son simples funcionas

const {response} = require('express');
const {validationResult} = require('express-validator');

const validarCampos = (req, res = response, next) => { //next es un callback, que hace que si un middelware termina pase al siguiente si lo hay

    const errors = validationResult( req );
    console.log(errors);
    // probar si funciona en postman
    if( !errors.isEmpty() ) { //? si los errores no estan empty retorno el json
        return res.status(400).json({
            ok: false,
            errors: errors.mapped(),
        }) 
    };

    next();
};

module.exports = {
    validarCampos,
}

