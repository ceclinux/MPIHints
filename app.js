
/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo');
var settings = require('./settings');
var routes = require('./routes');
var partials = require('express-partials');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/',routes.index);
app.get('/u/:user',routes.user);
app.post('/post',routes.post);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);

app.listen(3000);
