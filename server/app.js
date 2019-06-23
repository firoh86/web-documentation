const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// Intializations
const app = express()

// Settings
app.set('port', process.env.PORT || 80)
app.set('views', path.join(__dirname, '/views'))

// Middlewares

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('', require('./routes/index.routes'))


//Errors
app.use((err, req, res, next) => {
    res.send({ error: err.message })
})

// Public
app.use(express.static(path.join(__dirname, '../public')))

//start server
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`)
})