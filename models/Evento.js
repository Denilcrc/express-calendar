//? seguimos documentacion de mongoose https://mongoosejs.com/

const {Schema, model} = require('mongoose'); // desestructuramos de mongoose

const EventSchema = new Schema({ //? new para que el intelicense ayude con los metodos a la hora de exportar

    title: {
        type: String,
        required: true,
    },

    notes: {
        type: String,
    },

    start: {
        type: Date,
        required: true,
    },

    end: {
        type: Date,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //nombre del otro schema (model)
        required: true,
    }

});

EventSchema.method('toJSON', function () {
    const {_id, __v, ...object} = this.toObject(); //con this.toObject accedemos ala info que retorna el evento (title, notes, start, end, _uid. etc)
    object.id = _id;
    return object;
})


//! ojo que le llmamamos Evento y en la db sale user_mern => mern_calendar => eventos (mongoose le llama automaticamente usuarios *agrega la s*)
module.exports = model('Evento', EventSchema); // usamos al events (routes)

