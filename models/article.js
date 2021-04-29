'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema; //importar el esquema

var ArticleSchema = Schema({ //crear el squema
    title: String,
    content: String,
    date: {type:Date, default: Date.now},
    image: String
});

module.exports = mongoose.model('Article', ArticleSchema) //le damos nombre al modelo y tambien pasamos el modelo que tendra ese nombre
// articles --> guarda documentos de este tipo y estructura dentro dentro de la coleccion