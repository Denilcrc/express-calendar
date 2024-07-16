//? recordar que los middlewares en express son simples funcionas

const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => { //? validar el token puede ser importante por ejemplo para crear un nuevo evento en el calendar
    //*recibiendo el jwt (x-token en los headers)
    const token = req.header('x-token'); // el req es de express
    // console.log(token); //para que sew imprima primero debemos enviar la peticion mediante postman

    if (!token) {
        return res.status(401).json({ //sacando al ususario porque no hay token
            ok: false,
            msg: 'No hay token en la peticion'
        })
    };

    try {
        //* por esto la secret debe ser seguro y secreto, porque con esta info se puede firmar o autenticar los tokens 
        const payload = jwt.verify( //extrayendo el payload
            token,
            process.env.SECRET_JWT_SEED, 
        );
        // console.log(payload);

        //cualquier funcion que vaya despues del next() tendra el req actualizados con los valores del paylad
        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) { //solo se dispara si la validacion del token falla
        
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })

    }

    next(); //funcion se llama si el token es correcto

};

module.exports = {
    validarJWT, //exportamos a auth (routes)
}
