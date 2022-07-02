const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const compress = require('compression');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const mongoose = require('mongoose');
const expressSession = require('express-session');

const storeSession = require('connect-mongo')(expressSession); 

if (process.env.NODE_ENV == "development")
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true,useUnifiedTopology:true }).then(db=>{
},err=> console.error(err));
const app = express();


// view engine setup
app.set('views',[path.join(__dirname, 'views'),path.join(__dirname,'views/pages'),path.join(__dirname,'views/partials')]);
app.set('view engine', '.ejs');

app.use(expressSession({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: new storeSession({ mongooseConnection: mongoose.connection }),
  cookie:{
    httpOnly: true,
    maxAge:172800,
    expires: 172800
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{ maxAge:604800 }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRouter);
app.use(compress());
app.all('*',(req,res,next)=>{
  if(req.protocol=='https') {
  }
  else{
    res.redirect(307,`https://${req.hostname}:${app.get('secPort')}${req.url}`); 
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
