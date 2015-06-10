var express = require('express');
var app = express();
var httpServer = require("http").Server(app);

var io = require("socket.io")(httpServer);
var server = require('./server');

var passportSocketIo = require("passport.socketio");


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/passport');

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
var users = require('./routes/users');

var flash = require('connect-flash');
app.use(flash());

var swig  = require('swig');
var expressSession = require('express-session');
var FileStore = require('session-file-store')(expressSession);
var fs = new FileStore();
app.use(expressSession({
    secret: 'mySecretKey', 
    resave: true,
    saveUninitialized: true,
    store: fs
}));

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'connect.sid',       // the name of the cookie where express/connect stores its session_id
  secret:       'mySecretKey',    // the session_secret to parse the cookie
  store:        fs      // we NEED to use a sessionstore. no memorystore please
}));


app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components/')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server(io);

httpServer.listen(3000, function () {
});

module.exports = app;
