const path = require('path')
const express = require('express')
const dotenv = require('dotenv' )
const connectDB = require("./config/db")
const morgan = require("morgan")
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose')
const flash = require('connect-flash');



// load config
dotenv.config({path : './config/config.env'})

// Passport config
require('./config/passport.js')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(flash());


// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan('dev'))
}
// Handlebars Helpers
const { formatDate, stripTags, truncate, encodeURIComponent, replace, editIcon, select, eq } = require('./helpers/hbs.js')

// Handlebars
app.engine('.hbs', engine({ helpers: {
  formatDate,
  truncate,
  stripTags,
  replace,
  encodeURIComponent,
  editIcon,
  select,
  eq
}, defaultLayout: 'main', extname:'.hbs'}))
app.set('view engine', '.hbs')

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    })
  }));

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function (req,res, next){
  res.locals.user = req.user || null
  next()
})


// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes

app.use('/', require('./routes/index.js'))
app.use('/auth', require('./routes/auth.js'))
app.use('/stories', require('./routes/stories.js'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))