var util = {};
var fs = require('fs');
util.sha256 = function(s){
	var crypto = require("crypto");
	var sha256 = crypto.createHash("sha256");
	sha256.update(String(s), "utf8");//utf8 here
	return sha256.digest("hex");
};

util.md5 = function(s){
	var crypto = require("crypto");
	var md5 = crypto.createHash("md5");
	md5.update(String(s), "utf8");//utf8 here
	return md5.digest("hex");
};

util.NumberToHex = function(number){
	if(typeof number == 'number'){
		return number.toString(16).toUpperCase();
	}
	else{
		return null;
	}
}

util.isIpV4 = function(s){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	return pattern.test(s);  // returns a boolean
};

util.isOnlyNumber = function(s){
	var pattern = /^\d$/;
	return pattern.test(s);  // returns a boolean
};

util.isNumber = function(s){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	return pattern.test(s);  // returns a boolean
};

util.isInt = function(s){
	var pattern = /^(\-)?\d+$/;
	return pattern.test(s);  // returns a boolean
};

util.isPhoneNumber = function(s){
	var pattern = /^0(9\d{8}|1\d{9})$/;
	return pattern.test(s);  // returns a boolean
};

util.isEmail = function(s){
	var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return pattern.test(str);  // returns a boolean
};

util.isUsername = function(s){
	var pattern = /^[a-z][a-z0-9_]{5,29}$/;
	return pattern.test(s);  // returns a boolean
};

util.isPassword = function(s){
	var pattern = /^.{6,30}$/;
	return pattern.test(s);  // returns a boolean
};

util.isNameVi = function(s){
	var pattern = /^[a-zA-Z\-\sáàảãạăâắằấầặẵẫậéèẻẽẹếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịđùúủũụưứửữựÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỨỪỬỮỰỲỴÝỶỸửữựỵỷỹ]{2,30}$/;
	return pattern.test(s);
};

util.kodau = function(str){
	str= str.toLowerCase();
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/đ/g,"d");
	str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
	/* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
	str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
	str= str.replace(/^\-+|\-+$/g,"");
	//cắt bỏ ký tự - ở đầu và cuối chuỗi
	return str;
};

// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
util.isValidDate = function(s){
	// First check for the pattern
	if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s))
		return false;

	// Parse the date parts to integers
	var parts = s.split("/");
	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[2], 10);

	// Check the ranges of month and year
	if(year < 1000 || year > 3000 || month == 0 || month > 12)
		return false;

	var monthlength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	// Adjust for leap years
	if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthlength[1] = 29;

	// Check the range of the day
	return day > 0 && day <= monthlength[month - 1];
};

util.replaceHtml = function(s){
	if(s) return s.replace(/>/g, "&gt;").replace(/</g, "&lt;");
	return "";
};

util.StringFormat = function(s,arg){
	if(s && arg && arg.length && arg.length > 0 && (typeof s === 'string')){
		for(var i=0; i < arg.length; i++) {
			s = s.replace('{' + i + '}', arg[i]);
		}
	}
	return s;
};

//*********************parse data***********************//
util.parseInt = function(s,defaul){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	if(pattern.test(s)) return parseInt(s);
	else if(defaul) return defaul;
	return 0;
};

util.parseNumber = function(s,defaul){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	if(pattern.test(s)) return parseFloat(s);
	else if(defaul)return defaul;
	return 0
};

util.toString = function(obj,defaul){
	if(obj){
		return String(obj);
	}
	else{
		if(defaul) return defaul;
		return "";
	}
};

//date format dd/mm/yyyy
util.parseDate = function(s,defaul){
	if(this.isValidDate(s)){
		var parts = s.split("/");
		var day = parseInt(parts[0], 10);
		var month = parseInt(parts[1], 10);
		var year = parseInt(parts[2], 10);

		return new Date(year,month,day);
	}
	if(defaul)return defaul;
	return null;
};

//yyyy-MM-dd HH:mm:ss
util.date2String = function(date){
	if(date){
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var second = date.getSeconds();
		if(month<10) month ='0' + month;
		if(day<10) day='0'+day;
		if(hour<10) hour='0'+hour;
		if(minutes<10) minutes='0'+minutes;
		if(second<10) second='0'+second;
		return  year + '-' + month + '-' + day +' ' + hour + ':' + minutes + ':' + second;
	}
	return '';
};

//yyyyMMddHHmmss
util.date2String2 = function(date){
	if(date){
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var second = date.getSeconds();
		if(month<10) month ='0' + month;
		if(day<10) day='0'+day;
		if(hour<10) hour='0'+hour;
		if(minutes<10) minutes='0'+minutes;
		if(second<10) second='0'+second;
		return  year + '' + month + '' + day +'' + hour + '' + minutes + '' + second;
	}
	return '';
};

util.randomString = function(n){
	var patent = '0123456789abcdefghijklmnopqrstuvwxyz';
	var patent_length = patent.length;
	var s = '';
	for(i=0;i<n;i++){
		s+=patent[Math.floor(Math.random()*patent_length)];
	}
	return s;
};

util.randomNumber = function(n){
	var patent = '0123456789';
	var patent_length = patent.length;
	var s = '';
	for(i=0;i<n;i++){
		s+=patent[Math.floor(Math.random()*patent_length)];
	}
	return s;
};

util.getTokenCard = function(server_id,card_id,cardnumber,serial,datetime,capacity,key){
	var s = this.StringFormat('VP9@{0}^{1}-{2}-{3}+{4}-{5}|MVT|{6}$',[server_id,card_id,cardnumber.toUpperCase(),serial.toUpperCase(),datetime,capacity,key]);
	return this.sha256(s);
}

util.execFun = function(list_fun,callback){
	if(list_fun && list_fun.length>0){
		var fun_len = list_fun.length;
		var i_done = 0;
		var list_err = [];
		var list_result = [];

		for(var i=0;i<fun_len;i++){
			try{
				var fun = list_fun[i];
				var result = fun(exec_done);
			}
			catch(err){
				exec_done(err,null);
			}
		}

		function exec_done(err,result){
			list_err.push(err);
			list_result.push(result);
			i_done++;
			if(i_done==fun_len) callback(list_err,list_result);
		}
	}
	else{
		callback(null,null);
	}
};

util.search = function(st,se){
	if(st && st!='' && se && se!=''){
		var se_len = se.length;
		var st_len = st.length;
		var mark=0;
		var last_search = 0;
		for(var i=0; i<se_len; i++){
			var k = st.indexOf(se[i],last_search);
			// console.log(i,k,last_search);
			if(k>-1){
				mark+=1/(i+1)/((k+1)-last_search);
				last_search=k+2;
			}
			else{
				mark-=i;
				last_search=k+1;
			}
			// console.log(mark);
		}
		return mark;
	}
	return -1000;
}
util.notInListChannel = function(list, name) {
    for (var i in list) {
        if (list[i] === name) {
            return false;
        }
    }
    return true;
}
util.saveImageNumberPlate = function(image_base64,file_name,callback){
	fs.writeFile(file_name, image_base64, 'binary',(err) => {
	  	if (err) {
	  		throw err;
	  		var data_callback = {code : 127, message : 'err when save file'};
	  		callback(data_callback);
	  	}else{
	  		var data_callback = {code :0, message : ' success'};
	  		callback(data_callback);
	  	}
	});
};
util.isMacAddress = function (s) {
	var macPattern = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/;
	return macPattern.test(s);
};


module.exports = util;