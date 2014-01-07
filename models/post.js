var mongodb = require('./db');

function Post (username,post,time) {
    this.user = username;
    this.post = post;
    if (time) {
        this.time = time;
    }
}
