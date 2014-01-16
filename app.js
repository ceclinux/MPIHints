var fs = require('fs');
// - Open file for appending. The file is created if it does not exist.
var accessLogfile = fs.createWriteStream('access.log',{flags:'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags:'a'});
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

//Express支持两种模式：开发模式和产品模式
//3.x已经停用app.error,请用middleware()
/*app.configure('production',function  () {*/
//app.error(function  (err,req,res,next) {
//var meta = ']' + new Date() + '] ' + req.url + '\n';
//errorLogfile.write(meta + err.stack + '\n');
//next();
//});
//});

//在两种模式下的配置
app.configure(function  () {
    //process是一个全局变量，即global(全局对象)的属性
    //So process.env.port || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
    //app.use -- 使用middleware
    app.use(express.logger({stream:accessLogfile}));
    //app.set -- assigns settings name to value
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

    // Response local variables are scoped to the request, thus only available to the view(s) rendered during that request / response cycle, if any. Otherwise this API is identical to app.locals.
    app.use(function(req,res,next) {
        res.locals.user = req.session.user;
        var err = req.flash('error');
        res.locals.error = err.length ? err:null;
        var succ = req.flash('success');
        res.locals.success = succ.length ? succ:null;
        res.locals.login = req.session.user;
        res.locals.url = req.url;
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
app.get('/post',routes.checkLogin);
app.get('/post',routes.postform);
app.get('/p/:postid',routes.postContent);
app.get('/settings',routes.settings);

//http://expressjs.com/api.html#app.listen
///**
/** Listen for connections.*/
//*
//* A node `http.Server` is returned, with this
//* application (which is a `Function`) as its
//* callback. If you wish to create both an HTTP
//* and HTTPS server you may do so with the "http"
//* and "https" modules as shown here:
//*
//*    var http = require('http')
//*      , https = require('https')
//*      , express = require('express')
//*      , app = express();
//*
//*    http.createServer(app).listen(80);
//*    https.createServer({ ... }, app).listen(443);
//*
//* @return {http.Server}
//* @api public
//*/

//app.listen = function(){
//var server = http.createServer(this);
//return server.listen.apply(server, arguments);
//};

if(!module.parent){
    var server = app.listen(3000);
    //app.settings -- env Environment mode, defaults to process.env.NODE_ENV or "development"
    //server.port是nodejs而非expressjs的
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
}

module.exports = app;
