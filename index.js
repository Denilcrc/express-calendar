// console.log('Hola mundo'); //node index.js para ejecutar en la terminal
const express = require('express'); //esto es un import
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

// console.log(process.env); // imprimiendo procesos del enviroment

//* crear el servidor de express 
const app = express(); 

//* base de datos
dbConnection();

//* CORS
app.use(cors())

//* directorio publico
//use es un middleware (funcion que se ejecuta caundo se hace peticion al servidor)
app.use(express.static('public')); //entre oarentesis va el path (asi mostramos la carpeta index)

//* lectura y parseo del body para que se pueda leer el json
app.use(express.json());


//* rutas 
//routes del auth 
app.use('/api/auth', require('./routes/auth')); //tod lo del file './routes/auth', lo habilita en la ruta '/api/auth'
app.use('/api/events', require('./routes/events'));

//* escuchar peticiones (verificar en postman con un get localhost:4000/)
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en ${process.env.PORT} `);
});
