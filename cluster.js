require('newrelic');
//A single instance of Node runs in a single thread. To take advantage of multi-core systems the user will sometimes want to launch a cluster of Node processes to handle the load.
var cluster = require('cluster');
var os = require('os');

//获取CPU的数量
var numCPUs = os.cpus().length;

var workers = {};

//True if the process is a master. This is determined by the process.env.NODE_UNIQUE_ID. If process.env.NODE_UNIQUE_ID is undefined, then isMaster is true.
if (cluster.isMaster) {
    //When any of the workers die the cluster module will emit the 'exit' event.
    cluster.on('exit',function  (worker) {
        //The delete operator removes a property from an object.
        delete workers[worker.pid];
        //fork -- create a clild process
        worker = cluster.fork();
        workers[workers.pid] = worker;
    });
    //初始开启与CPU数量相同的工作进程
    for( var i = 0;i<numCPUs;i++){
        var worker = cluster.fork();
        workers[worker.pid] = worker;
    }
}else{
    var app = require('./app');
    app.listen(3000);
}

//当主进程被终止时，关闭所有工作进程*/
//process.on('SIGTERM',function(){
//    for(var pid in workers){
//        process.kill(pid);
//    }
//    process.exit(0);
//});

