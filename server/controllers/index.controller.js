const connection = require('../db_connection/connection')
const conn = connection()

// Es un objeto en el cual se crean las funciones que se ejecutan a través del enrutador.
const controller = {}

const path = require('path')

//función que recibe dos parámetros petición y respuesta
controller.index = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'))
}

controller.getMenus = (req, res, next) => {
    //rutas de consulta a la base de datos
    conn.query("SELECT * FROM menus ; SELECT * FROM submenus", (err, rows) => {
        //Si hay error en la consulta lanzamos un error
        if (err) next(new Error(err));
        else {
            res.charset = "utf-8"
            res.send(rows)

        }
    })
}

controller.getContent = (req, res, next) => {
    //rutas de consulta a la base de datos
    conn.query(`SELECT text FROM menus WHERE id = ${req.params.id}`, (err, rows) => {
        //Si hay error en la consulta lanzamos un error
        if (err) next(new Error(err));
        else {
            res.charset = "utf-8"
            res.send(rows)

        }
    })
}


module.exports = controller