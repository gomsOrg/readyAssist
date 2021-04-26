var express = require('express')
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var app = express()

app.use(express.json())
app.use('/', indexRouter)
app.use('/users', usersRouter)

app.listen(3000, () => console.log('server started'))

module.exports = app
