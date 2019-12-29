var express = require('express')
,http = require('http');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var app = express();
var crypto = require('crypto');
var route_loader = require('./routes/route_loader');
var socketio = require('socket.io');
var cors = require('cors');

var database = require('./database/database');
var config = require('./config/config');

// Passport
var passport = require('passport');
var flash = require('connect-flash');

// view engine setup

app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

// Passport 사용자 설정
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// cors
app.use(cors);

// // 라우터와 디비연결 및 호출 모듈화
// route_loader.init(app);

var configPassport = require('./config/passport');
configPassport(app, passport);

var userPassport = require('./routes/user_passport');
userPassport(app, passport);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log(" 서버가 시작됨 포트 :"+ app.get('port'));

  // database.init(app, config);
  route_loader.init(app);
})

var io= socketio.listen(server);
console.log(" socket.io 를 받아들일 준비완료")

io.sockets.on('connect',function(socket){
  console.log('connection info : ', socket.request.connection._peername);


socket.remoteAddress = socket.requset.connection._peername.address;
socket.remotePort = socket.request.connection._peername.port;

})




// ..
var errorHandler = expressErrorHandler({
  static: {
    '404': './public/html/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

module.exports = app;
