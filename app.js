const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const ejs = require('ejs')
const nocache = require('nocache')
const mongoose=require('mongoose')
const session = require('express-session')

mongoose.connect("mongodb+srv://naseebsidan:jda6cctU0sVMwSNE@cluster0.kongi3m.mongodb.net/").then(()=> console.log("MongoDB Connected") );
// mongodb://127.0.0.1:27017/user_management_system
// mongodb+srv://naseebsidan:jda6cctU0sVMwSNE@cluster0.kongi3m.mongodb.net/

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout: false,layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))

app.use(nocache())
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));  
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(session({
  secret:"MySecretAhda",
  resave:false,
  saveUninitialized:false,
  cookie:{secure:false}
}))



app.use('/',usersRouter);
app.use('/admin',adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error-404', { message: err.message }); // Passing the error message as a local variable
});


module.exports = app;
