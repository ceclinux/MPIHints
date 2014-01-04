
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
    res.render('reg',{title:'rigister',"listitem":listitem});
}
exports.doReg = function  (req,res) {
}
exports.login = function  (req,res) {
}
exports.doLogin = function  (req,res) {
}
exports.logout = function  (req,res) {
}
