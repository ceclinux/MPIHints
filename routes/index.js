var User = require('../models/user');
var crypto = require('crypto');
var Post = require('../models/post');
/*
 * GET home page.
 */
var listitem=[{number:12,item:'fack'},{number:20,item:'you'}];

exports.index = function  (req,res) {
    res.render('index',{title:'首页',"listitem":listitem});
}

exports.postform = function  (req,res) {
    res.render('postform',{title:'发表文章',"listitem":listitem});
}

exports.user = function  (req,res) {

}

exports.post = function  (req,res) {
}


exports.reg = function  (req,res) {
    res.render('reg',{title:'Rigister',"listitem":listitem});
};


exports.doReg = function  (req,res) {
    //http://zh.wikipedia.org/wiki/SHA%E5%AE%B6%E6%97%8F
    //Creates and returns a hash object, a cryptographic hash with the given algorithm which can be used to generate hash digests.
    var md5 = crypto.createHash('sha256');
    var password = md5.update(req.body.password).digest('base64');
    //创建一个新用户，从表单中获得的信息
    var newUser = new User({name: req.body.username,password:password});

    User.get(newUser.name,function  (err,user) {
        if (user) { err = '不好意思，用户名被占啦>_<';}
        if (err) {
            req.flash('error',err);
            return res.redirect('/reg');
        }

        newUser.save(function  (err) {
            if (err) {
                req.flash('error','不好意思，数据库出现问题啦，请联系Cecil = =' + err.toString());
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','注册成功\\(^o^)/~');
            res.redirect('/');
            console.log(req.session.user);

        });
    });
}

exports.login = function  (req,res) {
    res.render('login',{title:'用户登陆',"listitem":listitem});
}
exports.doLogin = function  (req,res) {
    var md5 = crypto.createHash('sha256');
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

exports.checkLogin = function  (req,res,next) {
    if (!req.session.user) {
        req.flash('error','未登陆');
        return res.redirect('/login');
    }
    next();
}
exports.checkNotLogin = function  (req,res,next) {
    if (req.session.user) {
        req.flash('error','已经登陆');
        return res.redirect('/');
    }
    next();
}

exports.post = function  (req,res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name,req.body.post);
    post.save(function  (err) {
        if (err) {
            req.flash('error',err);
            return res.redirect('/');
        }
        req.flash('success','发表成功');
        res.redirect('/post');
    })
}

