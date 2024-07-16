//? seguimos documentacion de mongoose https://mongoosejs.com/

const {Schema, model} = require('mongoose'); // desestructuramos de mongoose

const UsuarioSchema = new Schema({ //? new para que el intelicense ayude con los metodos a la hora de exportar

    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//! ojo que le llmamamos Usuario y en la db sale user_mern => mern_calendar => usuarios (mongoose le llama automaticamente usuarios *agrega la s*)
module.exports = model('Usuario', UsuarioSchema); // usamos al auth (routes)

