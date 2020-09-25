var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var UserRoutes = require('./routes/user');
var OrderRoutes =require('./routes/order');

var app = express();

mongoose.connect('mongodb://localhost:27017/shooping', function (error) {
  if (error) {
    console.log("Neuspjesno.")
  } else {
    console.log("Uspjesno.")
  }
});

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    cookie:{maxAge: 180*60*1000}
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/user',UserRoutes);
app.use('/order',OrderRoutes);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
