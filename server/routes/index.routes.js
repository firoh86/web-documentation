//Importa el módulo express.
const express = require('express')

//Guardamos el objeto que devuelve el método router. Router sirve para escuchar peticiones y enrutarlas.
const router = express.Router()

// El objeto controller es lo que devuelve el index.controller y se guarda en controller. Si no tuviera el module.exports no se podría usar.
const controller = require("../controllers/index.controller")

router.get('/', controller.index)
router.get('/getMenus', controller.getMenus)
router.get('/getContent/:id', controller.getContent)

module.exports = router
