const express = require('express')
const path = require('path')

// Intializations
const app = express()

// Settings
app.set('port', process.env.PORT || 80)
app.set('views', path.join(__dirname, '/views'))

// Middlewares
//app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))

app.use('', require('./routes/index.routes'))
app.use(express.json())


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