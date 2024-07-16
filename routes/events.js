//*  rutas del auth => host + /api/events


const { Router } = require('express');
const router = Router();
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { isDate } = require('../helpers/isDate');


//? con esta instruccion todas las rutas llevar el validarJWT por defecto
router.use(validarJWT);

// todas tienen que pasar por la validacion de jwt (MIDDLEWARE)
// *obtener eventos 
router.get('/', getEventos); //* no necesita body raw

//* crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(), //asi porque necesitamos que siempre tenga info
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),//dentro de custom(), enviamos una funcion callback(isDate), probamos es postman
        check('end', 'Fecha de finalizacion es obligatoria "end"').custom( isDate ),
        validarCampos
    ],
    crearEvento); //* no necesita body raw

//* actualizar evento
router.put('/:id',
    [
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalización es obligatoria').custom( isDate ),
    validarCampos
    ],
    actualizarEvento);

//* eliminar evento
router.delete('/:id', eliminarEvento);

module.exports = router;
