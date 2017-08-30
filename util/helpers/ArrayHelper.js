//async
var async = require('async');
var ArrayHelper = {};

ArrayHelper.arrayObjectUpdate = function(array, element, attribute){
    var isPush = true;
    array.forEach(function(item, key){
        if(item[attribute] === element[attribute]){
            isPush = false;
            array[key] = element;
        }
    });
    if(isPush){
        array.push(element);
    }
    return array;
};

ArrayHelper.arrayObjectElement = function(array, attribute, value){
    var result;
    array.forEach(function(item, key){
        if(item[attribute] === value){
            result = item;
        }
    });
    return result;
};

ArrayHelper.objectToArray = function(object){
    var result = [];
    for(var key in object){
        if(!object.hasOwnProperty(key)) continue;
        result.push(object[key]);
    }
    return result;
};

ArrayHelper.asyncForEach = function(array, callback){
    async.forEach(array, function(item, callbackFe){
        callback(item);
    }, function(err){
        if(err) return next(err);
        return true;
    });
};

module.exports = ArrayHelper;