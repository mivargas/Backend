'use strict'

var validator = require('validator'); //importar el validador
const fs = require('fs'); //modula necesario para borrar archivos fs (filesystem)
const path = require('path'); //sacar la ruta de un archivo, archivo dentro de un servidor

var Article = require('../models/article'); // importar el modelo article

var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en frameworks js',
            modalidad: 'web',
            web: 'udemy',
            //hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'soy la acción test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        // recoger parametros por post
        const params = req.body;
        console.log(params)

        // validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title) // cuando no este vacio params.title
            var validate_content = !validator.isEmpty(params.content)
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            /*return res.status(200).send({
                mens: 'validacion correcta',
                article: params
            });*/

            // creear objeto a guardar
            var article = new Article();

            // asignar valores al objeto
            article.title = params.title;
            article.content = params.content;
            if(params.image){ //esto es para poder validar que llegue una imagen
                article.image = params.image;
            }else{
                article.image = null
            }

            //guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }
                //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    getArticles: (req, res) => {
        //find
        let query = Article.find({}); //si no llega el parametro opcional se usara este query junto al sort de abajo

        let last = req.params.last // recogemos en una variable el valor que nos llega por el parametro de la ruta. NOTA: a los parametros se acceden por req.params y el req.body es para acceder a datos que se reciben del cuerpo de un objeto json
        //console.log(last)

        if (last || last != undefined) { // si  llega el parametro opcional se añade esto al query para optener solo 5 registros en en este caso los 5 ultimos porque la consulta sort esta en desc
            query.limit(5);
        }

        query.sort('-_id').exec((err, articles) => { //.sort('-_id') es opcional es un order by en este caso es desc
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver el articulo'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });

    },

    getArticle: (req, res) => {
        //Recoger el id
        let articleId = req.params.id;

        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            //devolverlo en json 
            return res.status(200).send({
                status: 'success',
                article
            });
        });


    },

    update: (req, res) => {
        //recoger el id de articulo por la url
        let articleId = req.params.id;

        //recoger los datos que llegan por put
        let params = req.body;

        //validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title); // cuando no este vacio params.title
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {
            // find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => { //new:true devuelve el objeto que he actualizado. params son los datos que estoy pasando por body
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el ariculo!!!'
                    });
                }
                //devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });

        } else {
            return res.status(500).send({
                status: 'error',
                message: 'La validación no es correcta!!!'
            });
        }
    },

    delete: (req, res) => {
        //recoger id
        var articleId = req.params.id;

        //find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleDeleted) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error al borrar'
                });
            }

            if (!articleDeleted) {
                return res.status(404).send({
                    message: 'No se ha podido borrar el articulo posiblemente no existe!!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleDeleted
            });

        });
    },

    upload: (req, res) => {
        //configurar el modulo del conect multiparty router/article.js

        //recoger el fichero de la peticion
        var file_name = 'imagen no subida...'; //darle valor por defecto

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //conseguir el nombre y la extension del archivo 
        var file_path = req.files.file0.path; //por convensiones de otras librerias a usar se sujiere usar el nombre de file file0 y no uno personalizado como 'image' para evitar conflictos mas a delante
        var file_split = file_path.split('/') //(linux o mac) en windows seria file_split = file_path.split('\\')

        //nombre del archivo
        var file_name = file_split[2];

        //extension
        var extension_split = file_name.split('.');
        var file_ext = extension_split[1];

        //comprobar la extension, solo imagenes y si no es valida la exxtension borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //borrar archivo subido
            fs.unlink(file_path, (err) => { // usar el modulo fs con el metodo unlink con el parametro que contiene la ruta para borrar el archivo de no ser una extension valida
                return res.status(500).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });

        } else {
            //si todo es valido, sacando id de la url
            var articleId = req.params.id;

            if (articleId) {
                //buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUdpated) => { //el segundo parametro es el un objeto con el dato del docuento que solo queremos actualizar (en este caso image) en la coleccion arcicle. NOTA new:true es para que en la respuesta devuelva el articulo actualizado y no el viejo
                    if (err || !articleUdpated) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar la imagen del articulo'
                        });
                    }
                    return res.status(200).send({
                        status: 'succes',
                        article: articleUdpated
                    });
                });
                /* PODER PROBAR DATOS QUE LLEGAN POR EL FILE
                return res.status(200).send({
                    fichero: req.files,
                    split: file_split,
                    extension:file_ext
                    
                });*/
            } else {
                return res.status(200).send({
                    status: 'succes',
                    image: file_name
                });

            }
        }
    },

    getImage: (req, res) => {
        //sacar la imagen del fichero que nos llega por la url (EFOnPcbynLOhDKOkW27sCmQN.png ejmeplo)
        var file = req.params.image;
        const path_file = './upload/articles/' + file;

        //comprobar que el fichero existe
        fs.access(path_file, (err) => { //metodo para validar si existe (nota METODO fs.exist esta objoleto)

            if (err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            } else {
                return res.sendFile(path.resolve(path_file)); //aqui hacemos uso del modulo path impotado al inicio
            }
        });

    },

    search: (req, res) => {
        //sacar el string a buscar
        var searchString = req.params.search;
        //find or
        Article.find({
            "$or": [ //operador or
                { "title": { "$regex": searchString, "$options": "i" } }, //cuando el titulo contenga lo que tiene el searchString. Si el searchString esta contenido, esta incluido dentro del titulo o esta incluido en el content entoces saca los articulos que coinsidan con eso. NOTA "$options": "i" son las opciones sin eso no funciona
                { "content": { "$regex": searchString, "$options": "i" } },
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }

                if (!articles || articles == '') { // tambien puede usarse || articles.length <= 0 en lugat de ==''
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con la busqueda!!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });

    }

} // end controller

module.exports = controller; //exportar el controlador completo (ya este es un objeto que contiene todos los metodos)