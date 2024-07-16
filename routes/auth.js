
//*  rutas del auth => host + /api/auth
//! recordar exportar el route

const { Router } = require('express'); //router lo desestructuramos de Express 
const router = Router();
const {check} = require('express-validator'); //chek se encarga de verificar un campo a la vez

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.post( //? new porque es un endpoint para crear un nuevo usuario, post Envía datos al servidor
    '/new',
    [ //middlewares validators checkea (name, email, password) 
        check('name', 'nombre es obligatorio').not().isEmpty(), //* primer arg es el nombre del req.body y el segundo el msg
        check('email', 'email es obligatorio').isEmail(),
        check('password', 'la contrasena debe tener mas de 6 digitos').isLength({min: 6}),
        validarCampos
    ],
    crearUsuario ); 


router.post( //? endpoint de login, post Envía datos al servidor
    '/',
    [
        check('email', 'email es obligatorio').isEmail(),
        check('password', 'la contrasena debe tener mas de 6 digitos').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario); 


router.get('/renew', validarJWT, revalidarToken); //? endpoint que genera un token que permitira mantener autenticados a los usuarios de forma pasiva, get Solicita un recurso del servidor

module.exports = router;
