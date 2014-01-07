var mongodb = require('./db');

function Post (username,post,time,great,bad) {
    this.user = username;
    this.post = post;
    this.great = great;
    this.bad = bad;
    if (time) {
        this.time = time;
    }
    else{
        this.time = new Date();
    }
}

Post.prototype.save = function save (callback) {
    var post = {
        user: this.user,
        post: this.post,
        time: this.time,
        bad: this.bad,
        good:this.good
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
            //为user属性添加索引
            collection.ensureIndex('user');
            collection.insert(post,{safe: true},function  (err,post) {
                mongodb.close();
                callback(err,post);
            });
        });
    });
};

Post.get = function get (username,callback) {
    mongodb.open(function  (err,db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('post',function  (err,collection) {
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
