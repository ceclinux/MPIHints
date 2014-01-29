var User = require('../models/user');
var crypto = require('crypto');
var Post = require('../models/post');
/*
 * GET home page.
 */
var listitem=[{number:12,item:'fack'},{number:20,item:'you'}];
var supply=['yamiedie','echo'];
var categories = ['会计学原理','咨询系统实施','电子商务导论','数据仓库及数据采集','统计学II','英语IV'];
var imageUrl = '';
var nickname = '';

exports.index = function  (req,res) {
    //Render a view with a callback responding with the rendered string. When an error occurs next(err) is invoked internally. When a callback is provided both the possible error and rendered string are passed, and no automated response is performed.
    if(req.session.user){
        if(imageUrl===''){
            getUserData(res,req,"首页");
        }else{
            res.render('index',{title:'首页',imageUrl:imageUrl,nickname:nickname,"listitem":listitem});
        }

    }
    else{
        res.render('index',{title:'首页',"listitem":listitem});
    }
};

exports.postform = function  (req,res) {
    console.log(imageUrl);
    res.render('post',{title:'发表文章',imageUrl:imageUrl,nickname:nickname,"listitem":listitem,"categories":categories});
};

exports.user = function  (req,res) {
    res.render('li',{layout:false,title:'发表文章',"supplies":supply});
};



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
            console.log(err);
            return res.redirect('/reg');
        }
        newUser.save(function  (err) {
            if (err) {
                req.flash('error','不好意思，数据库出现问题啦，请联系Cecil = = ,错误信息：' + err.toString());
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','注册成功\\(^o^)/~');
            res.redirect('/');
            console.log(req.session.user);
        });
    });
};

exports.login = function  (req,res) {
    res.render('login',{title:'用户登陆',"listitem":listitem});
};
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
};
exports.logout = function  (req,res) {
    req.session.user = null;
    req.flash('success','登出成功');
    res.redirect('/');
};

exports.checkLogin = function  (req,res,next) {
    if (!req.session.user) {
        req.flash('error','未登陆');
        return res.redirect('/login');
    }
    next();
};
exports.checkNotLogin = function  (req,res,next) {
    if (req.session.user) {
        req.flash('error','已经登陆');
        return res.redirect('/');
    }
    next();
};

exports.post = function  (req,res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name,req.body.content,req.body.title,req.body.tag,req.body.category,req.body.expire);
    post.save(function  (err) {
        if (err) {
            req.flash('error',err);
            return res.redirect('/');
        }
        req.flash('success','发表成功');
        res.redirect('/p/'+ Post.getMax());
    });

};

exports.postContent = function  (req,res) {
    Post.get(req.params.postid,function  (err,post) {
        if (err) {
            req.flash('err','木有这篇文章哦');
        }
        post.category = categories[post.category];
        User.get(post.user,function(err,doc){
            post.headUrl = doc.headUrl;
            post.nickname = doc.nickname;
            res.render('postContent',{title:'postContent',imageUrl:imageUrl,nickname:nickname,"listitem":listitem,post:post});

        });
    });
};

exports.settings = function (req,res){
    User.get(req.session.user.name,function(err,doc){
        res.render('settings',{title:'发表文章',imageUrl:imageUrl,nickname:nickname,"listitem":listitem,"categories":categories});
    });
};

exports.updateUser = function  (req,res) {
    imageUrl = req.body.imageUrl;
    nickname = req.body.nickname;
    User.update(req.session.user.name,{headUrl:imageUrl,nickname:nickname},function(){
        req.flash('success','更新成功');
        res.redirect('/');
    });
};

var getUserData = function(res,req,title){
    User.get(req.session.user.name,function(err,doc){
        imageUrl = doc.headUrl;
        nickname = doc.nickname;
        res.render('index',{title:title,imageUrl:imageUrl,nickname:nickname,"listitem":listitem});
    });
};

//para的顺序不能换
//这段需要研究～
exports.testlist = function  (req,res) {
    var post=[];
    var urlarr = req.params.date.split(/\//);
        var date = urlarr[urlarr.length-1];
    //substr 后面跟的参数是length
    var year = date.substring(0,4);
    var month = date.substring(4,6);
    var day = date.substring(6,8);
    var dateaf = year+'-'+month+'-'+day;
    Post.getLists({time:{"$gte":new Date()}},function  (err,docs) {
        var i = 0;
        docs.forEach(function(item,index,array){
            User.get(item.user,function(err,doc){
                //将图片从列表中删除（正则），需要排除最后出现<img .....没了的情况
                post.push({nickname:doc.nickname,good:item.good,bad:item.bad,content:item.content.substr(0,80).replace(/<img[^>]*?>/g,'').replace(/<img[^>]*?$/,''),userHead:doc.headUrl,title:item.title,pid:item.pid});
                if((++i)==array.length)
                    res.render('testlist',{title:'发表文章',post:post,imageUrl:imageUrl,nickname:nickname,"listitem":listitem,"categories":categories});
            });
        });
        return console.log(err);
    });
};

exports.addCountGood = function (req,res){
    var arr = req.url.split(/\//);
        var pid = Number(arr[arr.length-2]);
    Post.increGoodByOne(pid);
};

exports.addCountBad = function (req,res){
    var arr = req.url.split(/\//);
        var pid = Number(arr[arr.length-2]);
    Post.increBadByOne(pid);
};

exports.about = function  (req,res) {
    res.render('about',{title:'发表文章',imageUrl:imageUrl,nickname:nickname,"listitem":listitem,"categories":categories});
};
