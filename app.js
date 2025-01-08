// app.js

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./config/connection');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');

const exphbs = require('express-handlebars');
const Handlebars = require('handlebars'); // Required for SafeString

const app = express();

// Create an express-handlebars instance with helpers
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    json: function (context) {
      // Ensure the JSON is not escaped by returning a SafeString
      return new Handlebars.SafeString(JSON.stringify(context));
    }
  }
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine); // Use the express-handlebars instance
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: "your-secret-key", 
  resave: false, 
  saveUninitialized: true, 
  cookie: { maxAge: 6000000 } 
}));

// Database connection
db.connect((err) => {
  if (err) {
    console.log("connection error: " + err);
  } else {
    console.log("database connected");
  }
});

// Routes
app.use('/', userRouter);
app.use('/admin', adminRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  // Provide error details in development only
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
