
/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var routes = require('./routes');
var partials = require('express-partials');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
var flash = require('connect-flash');

var app = express();

app.configure(function  () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(partials());
    app.use(flash());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret:settings.cookieSecret,store:new MongoStore({db:settings.db})}));
    app.use(function  (req,res,next) {
        res.locals.user = req.session.user;
        var err = req.flash('error');
        
        res.locals.error = err.length ? err:null;
        var succ = req.flash('success');
        res.locals.success = succ.length ? succ:null;
        next();
    })


    app.use(app.router);


});

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


