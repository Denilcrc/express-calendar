//! controllers para los endpoints

const {response} = require('express'); //* esto lo hacemos para poder tener ayuda con el tipado
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => { //? endpoint para crear un nuevo usuario

    // console.log(req.body); //para verlo hay que hacer una peticion (ya sea en postman o donde sea)
    const {email, password} = req.body;
    
    //* try catch porque interactiamos con la db y puede fallar
    try {

        let usuario = await Usuario.findOne({email: email}); //findOne es de mongo
        //console.log(usuario); //* si tenemos un null significa que no hay nadie copn ese user, si retorna un objeto es que hay usuario cpn ese email
        //* condicion para validacion de users
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese correo',
            });
        }

        usuario = new Usuario(req.body); // instancia de Usuario.js

        //? encriptando contra
        const salt = bcrypt.genSaltSync(); // Number of rounds to use, defaults to 10 if omitted
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save(); //*guarda en la Data Base (mern_calendar) ya con la contrasena encriptada y ya habiendo encontrnado si es un email repetido
    
        //* generando jwt
        const token = await generarJWT(usuario.id, usuario.name); //*probar el token generado en https://jwt.io/ 

        res.status(201).json({ //para ver este objeto en postman o el navegador (localhost:4000/api/auth)
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con un admin'
        })
    }

    //! ojo con no hacer ningun return despues del catch

};

const loginUsuario = async(req, res = response) => { //? endpoint de login

    const {email, password} = req.body;

    //* try catch porque interactiamos con la db y puede fallar
    try {
     
        const usuario = await Usuario.findOne({email: email}); //findOne es de mongo
        //console.log(usuario); //* si tenemos un null significa que no hay nadie copn ese user, si retorna un objeto es que hay usuario cpn ese email

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email', //otra opcion seria 'usuario o contrasena no son correctos'
            });
        }

        //? confirmando password (probar en postman)
        const validPassword = bcrypt.compareSync(password, usuario.password); //* compara la password del req.body con la de usuario.password

        if (!validPassword) {
            return res.status(400).json ({
                ok: false,
                msg: 'Contrasena incorrecta',
            })  
        }

         //* generando jwt
        const token = await generarJWT(usuario.id, usuario.name); //*probar el token generado en https://jwt.io/ 

        res.status(200).json({ //para ver este objeto en postman o el navegador (localhost:4000/api/auth)
            ok: true,
            uid: usuario.id,
            name: usuario.name, 
            token
        });
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con un admin'
        })
    }

    //! ojo con no hacer ningun return despues del catch
    
};

const revalidarToken = async(req, res = response) => { //? endpoint que genera un token que permitira mantener autenticados a los usuarios de forma pasiva 

    const uid = req.uid; // la rques ya tiene el uid porque eso lo hacemos en el validar-swt
    const name = req.name

    // generando un NUEVO jwt (esto por si pasan las dos horas)
    const token = await generarJWT(uid, name);

    res.json({ //para ver este objeto en postman o el navegador (localhost:4000/api/auth)
        ok: true,
        msg: 're-new',
        token,
    })

};


module.exports = {
    crearUsuario, 
    loginUsuario, 
    revalidarToken,
};


    //? ejemplo pequena validacion
    // if (name.length < 2) {
    //     //! ojo con el teturn, ya que por endopoint se debe UNICAMENTE mandaer un res.json
    //     return res.status(400).json({ //status 400 (bad request) porque no se mando bien la info
    //         ok: false,
    //         msg: 'nombre debe de tener mas de 2 letras',
    //     });
    // };
