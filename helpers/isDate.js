
const moment = require('moment');

//? si la funcion retorna false da el error de "Fecha de inicio es obligatoria", esto es porque no se mando una fecha correcta
//? si la funcion retorna true todo bien con el validator
const isDate = (value, rest) => { //? para saber mas de estos arg ver en la doc de express-validator

    // console.log(value);
    // console.log(rest);

    if (!value) { //si no existe value retornamos false, esto le diria al validator que la info no esd correcta 
        return false;
    }

    const fecha = moment(value);

    if (fecha.isValid()) { //isValid es propio de moment
        return true
    } else {
        return false
    }

};

module.exports = {
    isDate, //usamos en events (routes) 
}
