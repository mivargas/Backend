'use strict'

const mongoose = require('mongoose'); //capa de abstracion para la base de datos previamente instalada atraves del gestor de paquetes de node (npm)
const app = require('./app') //importar el modulo app.js s usa ./ poeeque no es un modulo de node_modules sino es un podulo personalizado
const port = 3900 //puerto para la aplicacion

mongoose.set('useFindAndModify', false) //desactivar la forma de trabajar antigua con algunos metodos de la base de datos, forzar a algunos metodos a que se desactiven
mongoose.Promise = global.Promise; //esto es a nivel de funcionamiento interno de mongoose
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_blog', { useNewUrlParser: true,  useUnifiedTopology: true }) //conexion a base de datos mongo la base de datos se crea desde aqui al especificar el nombre luegodel puerto
    .then(()=>{
        console.log('la conexion a la base de datos se ha realizado exitosamente!!!');

        //crear servidor y  escuhar peticiones http
        app.listen(port, () => {
            console.log('servidor corriendo http://loacalhost:'+port);
        })
    })