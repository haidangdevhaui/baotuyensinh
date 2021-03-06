var express = require('express');
	app = express(),
    config = require('./config/config'),
    port = process.env.PORT || config.port,
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    layouts = require('express-ejs-layouts'),
    path = require('path'),
    passport = require('passport'),
    rewrite = require('express-urlrewrite'),
    flash = require('connect-flash');
mongoose.connect(config.database.url);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'dev'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.set("layout", true);
app.set('layout', 'index');
app.use(layouts);

app.use('/client', express.static(__dirname + '/client'));
app.use('/views', express.static(__dirname + '/views'));
var admin = app;
app.use('/public', express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/public/uploads'));
admin.use(express.static(path.join(__dirname, 'public')));
app.use(rewrite('/*.htm', '/$1'));

require('./app/api')(admin);
require('./app/main')(admin);
require('./app/index')(app);




app.listen(port);
console.log("Welcome to Haidangdev's Apps :D " + config.port);