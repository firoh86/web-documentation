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
    conn.query("SELECT * FROM menus ; SELECT * FROM submenus ORDER BY id", (err, rows) => {
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

controller.insertContent = (req, res, next) => {

    let menuID

    const sections = []


    console.log(sections);
    const data = {
        title: req.body.titles[1],
        // convierte en string un array y cambia las ',' por saltos de linea
        text: req.body.completDoc.toString().replace(/,/g, '')
    }

    conn.query("INSERT INTO menus SET ?", [data], (err, rows) => {
        //Si hay un error en la inserción lanzamos el error
        if (err) next(new Error(err))
        else {
            console.log(rows);
            menuID = rows.insertId

            for (const section of req.body.sections) {
                sections.push([null, section, menuID])
            }

            conn.query("INSERT INTO submenus (id,title,menu_id) VALUES ?", [sections], (err, rows) => {
                //Si hay un error en la inserción lanzamos el error
                if (err) next(new Error(err))
                else res.send({
                    ok: 'true'
                })
            })
        }

    })

}


module.exports = controller

