var mongodb = require('./db');

function Post (username,content,title,tag,course,expire) {
    this.user = username;
    this.content = content;
    this.good = 0;
    this.bad = 0;
    this.title = title;
    this.tag = tag;
    this.course = course;
    this.time = new Date();
    if (expire) {
        this.expire = new Date(expire.toString());
    }
}

Post.prototype.save = function save (callback) {
    var post = {
        user: this.user,
        content: this.content,
        time: this.time,
        bad: this.bad,
        good:this.good,
        tag:this.tag,
        course:this.course,
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
                collection.ensureIndex('user');
                collection.insert(post,{safe: true},function  (err,post) {
                    mongodb.close();
                    callback(err,post);
                });

            });
        });
    });
};

Post.get = function get (username,callback) {
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
            if (username) {
                query.user = username;
            }

            collection.find(query).sort({time:-1}).toArray(function  (err,docs) {
                mongodb.close();
                if (err) {
                    callback(err,null);
                }

                var posts = [];
                docs.forEach(function  (doc,index) {
                    var post = new Post(doc.user,doc.post,doc.time);
                    posts.push(post);
                });
                callback(null,posts);
            })

        })

    })
}

module.exports = Post;
