var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./config/connection');

var adminRouter = require('./routes/admin');
var userRouter = require('./routes/users');

// Instead of 'require("express-handlebars")', we import and create an instance:
var exphbs = require('express-handlebars');

var app = express();

// Create an express-handlebars instance
var hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  // Register custom helpers here
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
    // you can add more helpers if needed
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);          // Use the express-handlebars instance
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "key", cookie: { maxAge: 6000000 } }));

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  // provide error in development only
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
