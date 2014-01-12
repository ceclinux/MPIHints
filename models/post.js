var mongodb = require('./db');
var max = 0;

function Post (username,content,title,tags,category,expire) {
    this.user = username;
    this.content = content;
    this.good = 0;
    this.bad = 0;
    this.title = title;
    this.tags = tags;
    this.category = category;
    this.time = new Date();
    if (expire) {
        this.expire = new Date(expire.toString());
    }
}

Post.prototype.getContent = function getContent () {
    var paragraphs = this.content.split('\r\n');
    var content = '';
    for(var i = 0;i<paragraphs.length;i++){
        var httpReg = /http:\/\/[^ ]*\s|\shttps:\/\/[^ ]*\s/g;
        var myArray;
        var imgReg = /(http:\/\/([^\.]+\.)+?(jpg|png|bmp)\s)/g;
        while(httpReg.test(paragraphs[i]) ){
            //visibility:hidden会使图片占位但仍然加载
            paragraphs[i] = paragraphs[i].replace(imgReg,"<img src='$1' class='postimage' style='visibility:hidden'/>");
        }
        content += ('<p>'+paragraphs[i] +'</p>');
    }
    return content;

}

Post.prototype.save = function save (callback) {

    var post = {
        user: this.user,
        content: this.getContent(),
        time: this.time,
        bad: this.bad,
        good:this.good,
        tags:this.tags.split(/,|，/),
        category:this.category,
        title:this.title,
        expire:this.expire
    }
    mongodb.open(function  (err,db) {
        if (err) {
            return callback(err);
        }


        db.collection('posts',function  (err,collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var cursor = collection.find({});
            cursor.count(function(err, count){
                post.pid = ++count;
                max = count;
                collection.ensureIndex('user');
                collection.insert(post,{safe: true},function  (err,post) {
                    mongodb.close();
                    callback(err,post);
                });

            });
        });
    });
};

Post.getMax = function  () {
    return max;
}

Post.get = function get (pid,callback) {
    mongodb.open(function  (err,db) {
        if (err) {
            return callback(err);
        }

        db.collection('posts',function  (err,collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (pid) {
                query.pid = Number(pid);
            }


            collection.findOne(query,function  (err,document) {
                mongodb.close();
                if (err) {
                    callback(err,null);
                }
                console.log(document);

                //callback has two parameters-an error obj(if an error occured) and a cursor object
                callback(null,document);
            })

        })

    })
}

module.exports = Post;
