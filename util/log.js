var fs = require('fs');
var TimeHelper = require('./helpers/TimeHelper');
var TextHelper = require('./helpers/TextHelper');
function Log(dir){
    this.dir = dir;
    fs.existsSync(dir) || fs.mkdirSync(dir);
    this.path = '';
    this.ip = '';
    this.req = null;
}

Log.prototype.setPath = function(){
    if(this.req){
        this.ip = this.req.ip;
        var originalUrl = this.req.originalUrl;
        var ouArray = originalUrl.split('/');
        if(ouArray.length > 1){
            var tmpPath = ouArray[ouArray.length - 1];
            var tmpPathArray = tmpPath.split('?');
            if(tmpPathArray.length >= 1){
                this.path = tmpPathArray[0];
            }
        }
    }
};

Log.prototype.setLogFile = function(s, type, callback){
    if(!s || !type || !callback || typeof (callback) !== 'function'){
        return false;
    }
    var date = new Date();
    var file_name = TimeHelper.getCurrentTime('Ymd');
    var log_file = fs.createWriteStream(this.dir + '/' + file_name + '.log', {flags : 'a'});
    var time = TimeHelper.getCurrentTime('H:i:s');
    log_file.write(time + ' [' + this.ip + ']' + '[' + this.path + ']' + '[' + type + '] ' + TextHelper.parramToString(s) + '\n');
    callback(time);
    log_file.end();
};

Log.prototype.info=function(s){
    this.setPath();
    this.setLogFile(s, 'info', function(){});
};

Log.prototype.error=function(s){
    this.setPath();
    this.setLogFile(s, 'error', function(){});
};

module.exports = Log;