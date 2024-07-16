//? conectando app node a mongoatlas
const mongoose = require('mongoose');


const dbConnection = async() => {

    try {
        
        await mongoose.connect(process.env.DB_CNN); //'mongodb://127.0.0.1:27017/test' esto venia en la doc, la cambiamos por nuestra var de entorno 

        console.log('DB online');

    } catch (error) { //* ejemplo si la process.env.DB_CNN no funciona o se cambia da error
        console.log(error);
        throw new Error ("error a la hora de inicializar la db")
    }
    
};

module.exports = {
    dbConnection, //lo exportamos al index
}
