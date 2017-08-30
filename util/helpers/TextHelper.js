var TextHelper = {};

TextHelper.randomString = function(limit){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < limit; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

TextHelper.parramToString = function(data){
    if(typeof (data) === 'undefined'){
        return "undefined data";
    }
    else if(typeof data === 'object'){
        return 'object: ' + JSON.stringify(data);
    }
    else if(typeof data === 'string'){
        return data;
    }
    else{
        return 'other: ' + JSON.stringify(data);
    }
};

TextHelper.macAddressText = function(mac){
    if(!mac){
        return mac;
    }
    return mac.replace(/:/g, '');
};

TextHelper.b64EncodeUnicode = function(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return TextHelper.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
};

TextHelper.replaceAllString = function(string, search, replace){
    if(!string || !replace || !search){
        return string;
    }
    
    while (string.indexOf(search) !== -1) {
        string = string.replace(search, replace);
    }
    return string;
};

TextHelper.btoa = function(str) {
  if (Buffer.byteLength(str) !== str.length)
    throw new Error('bad string!');
  return Buffer(str, 'binary').toString('base64');
};

module.exports = TextHelper;