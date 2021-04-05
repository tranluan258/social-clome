require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const db = require('./db')
const passport = require('passport');
const flash = require('express-flash')
require('./services/passport');

const siteRouter = require('./routes/site');
const commentRouter = require('./routes/comments')
const accountRouter = require('./routes/account');
const postRouter = require('./routes/post')
const facultyRouter = require('./routes/faculty')
const notificationsRouter = require('./routes/notification')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'users')));
app.use(session({ secret: 'password_secret', path: '/', httpOnly: true, secure: false, maxAge: null }))

app.use((req, res, next) => {
  req.vars =  {root: __dirname}
  next()
})

app.use('/faculty',facultyRouter)
app.use('/notification',notificationsRouter)
app.use('/post',postRouter);
app.use('/account', accountRouter);
app.use('/comments', commentRouter);
app.use('/', siteRouter);

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
