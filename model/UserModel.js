var ArrayHelper = require('../util/helpers/ArrayHelper');
var UserModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

UserModel.prototype.setAttributes = function(data){
    this.gpoid = data.gpoid ? data.gpoid : null;
    this.username = data.username ? data.username : null;
    this.fullname = data.fullname ? data.fullname : null;
    this.password = data.password ? data.password : null;
    this.address = data.address ? data.address : null;
    this.email = data.email ? data.email : null;
    this.phone_number = data.phone_number ? data.phone_number : null;
    this.facebook_id = data.facebook_id ? data.facebook_id : null;
};

UserModel.prototype.getAttributes = function(){
    return {
        gpoid: this.gpoid,
        username: this.username,
        fullname: this.fullname,
        password: this.password,
        address: this.address,
        email: this.email,
        phone_number: this.phone_number,
        facebook_id : this.facebook_id,
    };
};

UserModel.validate = function(data){
    return {code: 0, message: ''};
};

UserModel.prototype.add = function(connection, log, callback){
    var validate = UserModel.validate(this.getAttributes());
    if(validate.code){
        callback(validate);
        return false;
    }
    var sql = 'INSERT INTO users (username, fullname, password, address, email, phone_number,facebook_id) ' 
            + 'VALUES (?, ?, ?, ?, ?, ?, ?)';
    var self = this;
    
    connection.query(sql, [this.username, this.fullname, this.password, this.address, this.email, this.phone_number,this.facebook_id], function(err, result){
        if(err){
            callback({code : 102 , message :'Error when excute SQL Query' });
            return false;
        }
        self.gpoid = result.insertId;
        callback({code: 0, message: '', user: self});
    });
};

UserModel.prototype.addUserSite = function(site, connection, log, callback){
    callback({code: 0, message: ''});
};

UserModel.checkUserInfo = function (username, connection, log, callback) {
    var sql = "SELECT * from users WHERE username = ?";
    connection.query(sql, [username], function (err, result) {
        if (err) {
            log.error(JSON.stringify({ "code": 102, "message": "Error when excute SQL Query", "status": "NOK" }));
            return callback({ "code": 102, "message": "Error when excute SQL Query", "status": "NOK" });
        }
        else if (result.length === 0) {
            log.error(JSON.stringify({ "code": -1, "message": "Account không tồn tại trong hệ thống", "status": "NOK" }));
            return callback({ "code": -1, "message": "Account không tồn tại trong hệ thống", "status": "NOK" });
        }
        log.info(JSON.stringify({ "code": 200, "message": "Thành công" }));
        return callback(null, result[0]);
    });
};
UserModel.prototype.checkIdFacebook = function(facebook_id , connection , log, callback){
    var checkExistQuery = " SELECT (SELECT COUNT(*) FROM users WHERE facebook_id = ?)"+
    " count_index, gpoid, username,`password`,email,address FROM users WHERE facebook_id = ?";
    var resResult;
    connection.query(checkExistQuery,[facebook_id ,facebook_id],function(err, result){
        if(err){
            resResult = {
                code : 404,
                message : 'Error when exec mysql query'
            };
        }else{
            resResult = {
                code : 0,
                message : 'success',
                data : result
            };
        }
        callback(resResult);
        log.info("UserModel ==> checkIdFacebook :" + JSON.stringify(resResult));
    });
};
UserModel.activeUser = function(userName, active, connection, log, callback){
    var queryUpdate = " UPDATE users SET  active = ? WHERE username = ?";
    var activeIndex= null;
    if (active === 'active') {
        activeIndex = 1;
    }
    else if (active === 'inactive') {
        activeIndex = 0;
    }
    var resResult;
    connection.query(queryUpdate, [activeIndex, userName], function(err, result){
        if (err) {
            resResult = {
                code : 404,
                message : " Error when exec query database"
            };
            callback(resResult);
        }
        else{
            resResult = {
                code : 0,
                message : "success"
            };
            callback(resResult);
        }   
    });
};
module.exports = UserModel;


