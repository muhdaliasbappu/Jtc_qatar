var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var adminRouter = require('./routes/admin');
var userRouter = require('./routes/users');
var superRouter = require('./routes/superadmin')
var hbs = require('express-handlebars');
var app = express();
var db = require('./config/connection');

const session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' },));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "key", cookie: { maxAge: 6000000 } }));


app.set('subdomain offset', 1);
app.use((req, res, next) => {
  const subdomain = req.subdomains[0];
 
  let dbName = "Jtcqatars";
  if (subdomain) {
    dbName = subdomain;
    dbid = subdomain;
  }
  db.connect(dbName, (err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
    } else {
      console.log(`Connected to database: ${dbName}`);
    }
    
    next();
  });
});

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/superadmin', superRouter);



// Rest of your code


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
