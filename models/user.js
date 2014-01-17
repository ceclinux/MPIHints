var MongoClient = require('./db').MongoClient;
var url = require('./db').url;

function User (user) {
    this.name = user.name;
    this.password = user.password;
};
//这样可以直接返回User对象哦
module.exports = User;

User.prototype.save = function save (callback) {
    //存入mongodb的文档
    var user = {
        name: this.name,
        password: this.password,
    };

    MongoClient.connect(url,function  (err,db) {
        var collection = db.collection('users');
        collection.ensureIndex('name',{unique:true},function  (err,indexName) {
            collection.insert(user,{safe:true},function  (err,user) {
                callback(err,user);
            });
        });
    });
};

User.get = function get (username,callback) {
    MongoClient.connect(url,function(err,db){
        if (err) {
            //Close the current db connection, including all the child db instances. Emits close event if no callback is provided.
            db.close();
            return callback(err);
        }
        var collection = db.collection('users');
        collection.findOne({name:username},function  (err,doc) {
            if (doc) {
                //封装为User对象
                var user = new User(doc);
                callback(err,user);
            }else{
                callback(err,null);
            }
        });
    });
};
