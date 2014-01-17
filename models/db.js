//mongodb连接文件

//http://mongodb.github.io/node-mongodb-native/

var MongoClient = require('mongodb').MongoClient;
url='mongodb://ceclinux:17283950@widmore.mongohq.com:10010/mpihints';

exports.MongoClient = MongoClient;
exports.url = url;
