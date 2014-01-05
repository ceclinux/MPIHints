var User = require('../models/user');
var crypto = require('crypto');
/*
 * GET home page.
 */
var listitem=[{number:12,item:'fack'},{number:20,item:'you'}];

exports.index = function  (req,res) {
    res.render('index',{title:'Homepage',"listitem":listitem});
}

exports.user = function  (req,res) {
}

exports.post = function  (req,res) {
}
exports.reg = function  (req,res) {
    res.render('reg',{title:'Rigister',"listitem":listitem});
};

exports.doReg = function  (req,res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({name: req.body.username,password:password});

    User.get(newUser.name,function  (err,user) {
        if (user) {err = 'Username already exists';}
        if (err) {req.flash('error',err);
            return res.redirect('/reg');
        }

        newUser.save(function  (err) {
            if (err) {req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','注册成功');
            res.redirect('/');

        });
    });
}

exports.login = function  (req,res) {
    res.render('login',{title:'用户登入'});
}
exports.doLogin = function  (req,res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username,function  (err,user) {

        if (!user) {req.flash('error','用户不存在');return res.redirect('/login');
        }
        if (user.password != password) {
            req.flash('error','用户口令错误');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success','登陆成功');
        res.redirect('/');

    });
}
exports.logout = function  (req,res) {
    req.session.user = null;
    req.flash('success','登出成功');
    res.redirect('/');
}
