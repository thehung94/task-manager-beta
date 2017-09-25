var ArrayHelper = require('../util/helpers/ArrayHelper');
var appLanguage = require('../messages/AppLanguage');
var AppLanguage = new appLanguage();
var async = require('async');
var jwt = require('jsonwebtoken');
var config = require('../config');
var TaskModel = require('./TaskModel');
var TextHelper = require('../util/helpers/TextHelper');
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
};

UserModel.prototype.getAttributes = function(){
    return {
        gpoid: this.gpoid,
        username: this.username,
        fullname: this.fullname,
        password: this.password,
        address: this.address,
        email: this.email,
        phone_number: this.phone_number
    };
};

UserModel.validate = function(data){
    return {code: 0, message: ''};
};

UserModel.prototype.save = function(connection, callback){
    var validate = UserModel.validate(this.getAttributes());
    var sqlQuery ='';
    var params = [
        this.username, this.fullname, this.password, this.address, this.email, this.phone_number
    ];
    if (this.gpoid) {
        sqlQuery = "UPDATES users"
                +" SET username = ?, fullname = ?, password = ?, address = ?, email = ?"
                +" phone_number = ? WHERE gpoid = ?";
        params.push(this.gpoid);
    }
    if(validate.code){
        callback(validate);
        return false;
    }
    sqlQuery = 'INSERT INTO users (username, fullname, password, address, email, phone_number) ' 
            + 'VALUES (?, ?, ?, ?, ?, ?)';
    var self = this;
    var params = [this.username, this.fullname, this.password, this.address, this.email, this.phone_number];
    connection.query(sqlQuery, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 102 , message :'Error when excute SQL Query' });
            return false;
        }
        self.gpoid = result.insertId ? result.insertId : this.gpoid;
        callback({code: 0, message: '', user: self});
    });
};
UserModel.prototype.getOneByAttributes = function(attribute, value, connection, callback){
    var sqlQuery = "SELECT * FROM users WHERE "
                + attribute
                + " = ? LIMIT 1";
    connection.query(sqlQuery, [value], function(err, result){
        if (err){
            callback({
                code : 404,
                message : ''
            });
            return false;
        }
        callback({
            code : 0,
            message : '',
            data : result
        });
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
UserModel.activeUser = function(userName, active, connection, callback){
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
/**
 * @api {get} cp.cam9.tv:3000/login 3.1 Authenticate user in mobile app
 * @apiName doLogin
 * @apiGroup CMS API
 *
 * @apiParam {String} action Type of action, fix value "login"
 * @apiParam {String} password A SHA265 string from user's password
 * @apiParam {String} email Email
 * @apiParam {String} phone Phone number
 * @apiParam {String} username Username
 * @apiDescription Param email, phone and username are options, but have to one of them.
 *
 * @apiSuccess {String} success True
 * @apiSuccess {String} message Enjoy your token!
 * @apiSuccess {String} token Token generated for client
 *
 * @apiExample {get} Example request
 * http://localhost:3000/login?action=login&password=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918&email=tungnd@vp9.tv
 */
UserModel.doLogin = function(password, identifier, andQuery, connection, callback) {
    var selectQuery = 'SELECT * FROM users WHERE password = ? AND ' + andQuery;
    var resResult = {
        code : 0,
        message : AppLanguage.t("app", "success")
    };
    async.waterfall([
        function(callbackWf){
            connection.query(selectQuery, [password, identifier], function (err, result) {
                if (err) {
                    resResult.code= 404;
                    resResult.message = AppLanguage.t("app", "Connection error");
                    callbackWf(resResult, null);
                }
                if (!result || !result.length) {
                    resResult.code = 1000;
                    resResult.message = AppLanguage.t("app", "Invalid username or password");
                    callbackWf(resResult, null);
                }
                var userModel = {
                    username : result[0].username,
                    gpoid : result[0].gpoid,
                    email : result[0].email
                };
                callbackWf(null, userModel);
            });
        },
        function(userModel, callbackWf){
            TaskModel.getAllTaskByUser(userModel.gpoid, connection, function(result){
                if (result.code === 0){
                    var list_task = result.data;
                    callbackWf(null, userModel, list_task);
                }
                else{
                    resResult.code = 1002;
                    resResult.message = AppLanguage.t("app", "Get task error");
                    callbackWf(resResult, null, null);
                }
            });
        },
        function(userModel, listTask, callbackWf){
            var token = jwt.sign(userModel, config.superSecret, {
                    expiresIn: 86400 * 365
                });
                resResult.code = 0;
                resResult.message = AppLanguage.t("app", "success");
                resResult.user = userModel;
                resResult.token = token;
                resResult.list_task = listTask;
                callbackWf(null, resResult);
        }
    ], function(err, resultWf){
        callback(err, resultWf);
    });
};
module.exports = UserModel;


