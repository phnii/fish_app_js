const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const layouts = require("express-ejs-layouts");
const passport = require("passport");
const methodOverride = require("method-override");
const expressValidator = require("express-validator");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const roomsRouter = require("./routes/rooms");
const tripsRouter = require("./routes/trips");

const User = require("./models/user");

const app = express();

// DB接続設定
mongoose.connect(
  "mongodb://localhost:27017/fish_app_js_db",
  {useNewUrlParser: true}
);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser("testpass"));
app.use(
  expressSession({
    secret: "testpass",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static(path.join(__dirname, 'public')));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use(methodOverride("_method"));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/rooms", roomsRouter);
app.use("/trips", tripsRouter);

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
