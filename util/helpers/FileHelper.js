//fs
var fs = require('fs'); 
var FileHelper = {};

FileHelper.writeFile = function(file, content, chmodP, log, callback){
    var result = {code: 400, message: "", error: null};
    if(!file){
        callback(result);
        return false;
    }
    fs.writeFile(file, content, function(err){
        if(err){
            result.error = err;
            if(log){
                log.error('write file. File: ' + file + ' Error: ' + JSON.stringify(err));
            }
            callback(result);
            return false;
        }
        if(chmodP){
            fs.chmod(file, chmodP, function(chmodError){
                if(chmodError){
                    result.error = chmodError;
                    if(log){
                        log.error('write file. File: ' + file + ' Error: ' + JSON.stringify(chmodError));
                    }
                    callback(result);
                    return false;
                }
                result.code = 0;
                callback(result);
                return false;
            });
        }
        else{
            result.code = 0;
            callback(result);
            return false;
        }
    });
};

module.exports = FileHelper;

