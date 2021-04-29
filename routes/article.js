'use strict'

const express = require('express'); //importar express
var ArticleController = require('../controllers/article'); //importar el controlador article con todos los metodos

var router = express.Router(); //crear  una variable para usar el metodo Router de express

var multipart = require('connect-multiparty'); //importar modulo para subir archivos
var md_upload = multipart({uploadDir: './upload/articles'}); //cear middleware multipart para que se ejecute antes del metodo

//rutas deprueba
router.post('/datos-curso', ArticleController.datosCurso); // crear ruta, la variable ruter que se cereo del metodo express.Router() el metodo http (post,get,put/patch,delete) y como parametro el nombre que tendra la ruta y como segundo parametro la variable que hemos creado para importar el objeto del contolador, seguido del metodo del controlador que deseamos llamar en concreto
router.get('/test-de-controlador', ArticleController.test);

//rutas utiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles); //last? es una delaracion de parametro opcional
router.get('/article/:id', ArticleController.getArticle); // al no tener el ? le decimos que el parametro es obligatorio
router.put('/article/:id', ArticleController.update); 
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload); //le pasamos el middlewar como segundo para metromd_upload, automaicamente ya esta rutava a aceptar los archivos que se envien (va a procesar esos archivos por el protocolo http)
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router; //exportar las rutas
