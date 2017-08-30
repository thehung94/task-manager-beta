var config = require('../config');
var AppLanguage = function(){
    if(typeof config.laguage === "undefined" || !config.language){
        this.language = "vi";
    }
    else{
        this.language = config.language;
    }
};

//AppLanguage.prototype.language = "vi";

AppLanguage.prototype.t = function(file, message, params){
    file = file.toString();
    message = message.toString();
    
    if(!file || !message || (params && typeof params !== 'object')){
        return "";
    }
    var messageFile = require('../messages/' + this.language + '/' + file);
    if(!messageFile){
        return "";
    }
    var result = messageFile.message[message];
    if(!result){
        return message;
    }
    if(params){
        for(var p in params){
            var replace = "{"+p+"}";
            while(result.indexOf(replace) >= 0){
                result = result.replace(replace, params[p]);
            }
        }
    }
    return result;
};

module.exports = AppLanguage;