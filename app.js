'use stric'

// Cargar modulos de node para crear el servidor 
const express = require('express');
const bodyParser = require('body-parser');

// Ejecutar express (http)
const app = express();

// Cargar ficheros rutas
const article_routes = require('./routes/article'); //importar las rutas (en este caso de article)

// Middlewares
app.use(bodyParser.urlencoded({extended: false})) //cargar body-parser (middlewares que trae el paquete)
app.use(bodyParser.json())

// CORS (permitir peticiones desde el frontend) acceso crusado entre dominios
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// Añadir prefijos a rutas / cargar rutas
app.use('/api', article_routes)  // se cargan las rutas de article. NOTA : se podria usar app.use('/', article_routes) O app.use(article_routes) nosotros decidimos si queremos hacer uso de un prefijo paraa el API o no en este caso si y sera /api

// Ruta o metodo de prueba para el api
/*
app.post('/probando', (req, res) => {
    var hola = req.body.hola;
    console.log('hola mundo')
    return res.status(200).send({
        curso: 'Master en frameworks js',
        modalidad: 'web',
        web: 'udemy',
        //hola
    });
});
*/

// Exportar modulo (fichero actual)
module.exports = app;