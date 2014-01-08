
/**
 * Module dependencies.
 */

var express = require('express');
var Mongo = require('connect-mongo');
var MongoStore = Mongo(express);
var settings = require('./settings');
var routes = require('./routes');
var partials = require('express-partials');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var util = require('util');
//The flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
//看github仓库里的examples
var flash = require('connect-flash');

var app = express();

app.configure(function  () {
    //process是一个全局变量，即global(全局对象)的属性
    //So process.env.port || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
    app.set('port',process.env.PORT || 3000);
    app.set('views',path.join(__dirname, 'views'));
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

    //http://cnodejs.org/topic/501f5d8ff767cc9a51c98165
    app.use(function  (req,res,next) {
        res.locals.user = req.session.user;
        var err = req.flash('error');
        res.locals.error = err.length ? err:null;
        var succ = req.flash('success');
        res.locals.success = succ.length ? succ:null;
        res.locals.login = req.session.user;
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
app.get('/reg',routes.checkNotLogin);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.checkNotLogin);
app.get('/login',routes.login);
app.post('/login',routes.checkNotLogin);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
app.post('/post',routes.checkLogin);
app.post('/post',routes.post);
app.get('/postform',routes.checkLogin);
app.get('/postform',routes.postform);

app.listen(3000);


