/* /app.js */
require('dotenv').config()
// load modules
const express = require('express')
const express_layout = require('express-ejs-layouts')
const method_override = require('method-override')
const cookie_parser = require('cookie-parser')
const session = require('express-session')
const mongo_store = require('connect-mongo')
const connect_db = require('./server/config/db')
const app = express()
const PORT = 5000 || process.env.PORT
// connect to DB
connect_db()
// middleware setup
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookie_parser())
app.use(method_override('_method'))
// session setup
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: mongo_store.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  // cookie: { maxAge: new Date(Date.new() + (3600000)) }
}))
// static file
app.use(express.static('public'))

// Templating Engine <%-%>
app.use(express_layout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})