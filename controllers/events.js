const { response, request } = require("express");
const Evento = require("../models/Evento");


const getEventos = async(req, res = response) => {

    //* obteniendo eventos de la db
    const eventos = await Evento.find().populate('user', 'name'); //populate es para obtener la info dentro de lo que se le manda 'user', solo pedimos 'name'
    res.status(200).json({
        ok: true,
        eventos,
    })

}

const crearEvento = async(req, res = response) => {

    //? verificando que haya evento
    // console.log(req.body); //aqui si es necesario mandar el body del evento (probamos es postman al hacer peticion lo vemos en clg)

    const evento = new Evento (req.body);

    //*guardando en base de datos (mern_calendar => eventos en mongo compass),try catch porque interactiamos con la db y puede fallar
    try {
        
        //* dandole al user el uid del req
        evento.user = req.uid; //este uid viene actualizado porque lo actualizamos a la hora de revalidar el jwt

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardado,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con algun administrador',
        })
    }

}

const actualizarEvento = async(req, res = response) => { //12345 como id para llamar el evento
 
    //*obteniendo el id del evento
    const eventoId = req.params.id; //localhost:4000/api/events/*este id*
    const uid = req.uid;

    //* try catch porque interactiamos con la db y puede fallar
    try {
        
        const evento = await Evento.findById(eventoId);

        if (!evento) { //si no hay evento en la db
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== uid){//* verificando que el que lo creo sea el mismo que lo va a editar
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar este evento'
            })
        }

        //? post verificacion de user
        const nuevoEvento = {
            ...req.body,
            user: uid, // user igual a uid porque el user no viene en la peticion de actualizar (put)
        };

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true}); //https://mongoosejs.com/docs/api/model.html

        res.json({
            ok: true,
            evento: eventoActualizado,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con algun administrador',
        })
    }

}

const eliminarEvento = async(req, res = response) => { //12345 como id para llamar el evento
 
    //*obteniendo el id del evento
    const eventoId = req.params.id; //localhost:4000/api/events/*este id*
    const uid = req.uid;

    //* try catch porque interactiamos con la db y puede fallar
    try {
        
        const evento = await Evento.findById(eventoId);

        if (!evento) { //si no hay evento en la db
            return res.status(404).json({
                ok: false,
                msg: 'Evento con ese id no existe'
            });
        }

        if (evento.user.toString() !== uid){//* verificando que el que lo creo sea el mismo que lo va a editar
            return res.status(401).json({
                ok: false,
                msg: 'No puede eliminar este evento'
            })
        }

        //? post verificacion de user
        await Evento.findByIdAndDelete(eventoId); //https://mongoosejs.com/docs/api/model.html

        res.json({ok: true});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contactar con algun administrador',
        })
    }


}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}

