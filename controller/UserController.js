var UserController = {};
var appLanguage = require('../messages/AppLanguage');
var AppLanguage = new appLanguage();
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var AppEnum = require('../util/AppEnums');
var UserModel = require('../model/UserModel');
var TextHelper = require('../util/helpers/TextHelper');

UserController.activeUser = function(req, res, log){
    req.getConnection(function(err, connection){
        if (err) {
            resResult = {
                code : 404,
                message : AppLanguage.t("app", "Connention error"),
                status : "NOK"
            };
            log.error("UserController --> activeUser :" + JSON.stringify(resResult));
            res.json(resResult);
        }
        else{
            try {
                var isAccessBccs = UserController.isAccessBccs(req);
                if (isAccessBccs) {
                    var userName = req.body.username;
                    var active = req.body.status;
                    if (!userName || !active) {
                        resResult = {
                            code : 102,
                            message : AppLanguage.t("app","Parameters are invalid"),
                            status : "NOK"
                        };
                        res.json(resResult);
                        log.error("Usercontroller --> activeUser :" + JSON.stringify(resResult));
                        return false;
                    }
                    UserModel.activeUser(userName, active, connection, log, function(result){
                        if (result.code === 404) {
                            resResult = {
                                code : 404,
                                message : AppLanguage.t("app", "Connection error"),
                                status : "NOK"
                            };
                            log.error("UserController --> activeUser :" + JSON.stringify(resResult));
                            res.json(resResult);
                            return false;
                        }
                        else{
                            resResult = {
                                code : 200,
                                message : AppLanguage.t("app", "success"),
                                status : "OK"
                            };
                            res.json(resResult);
                            return false;
                        }
                    });
                }
                else{
                    resResult = {
                        code : 404,
                        message : AppLanguage.t("app", "IP is not accepted"),
                        status : "NOK"
                    };
                    res.json(resResult);
                    log.error("UserController --> checkSubscriberVCam :" + JSON.stringify(resResult));
                }
            } catch (error) {
                resResult = {
                    code : 404,
                    message : AppLanguage.t("app", "Connection error"),
                    status : "NOK"
                };
                log.error("UserController --> activeUser :" + JSON.stringify(error));
                res.json(resResult);
            }
        }
    });
};

UserController.isActive = function(p_user_id, req, log){
    return new Promise(function(resolve, reject){
        req.getConnection(function(err, connection){
            if(err){
                var resResult = {
                    code : 404,
                    message : AppLanguage.t("app", "Connention error"),
                    status : "NOK"
                };
                log.error("Check active user :" + JSON.stringify(resResult));
                reject(resResult);
            }
            else{
                try{
                    var userArModel = new UserArModel({connection: connection});
                    userArModel
                        .find()
                        .andWhere({gpoid: p_user_id})
                        .one()
                        .then(function(userResult){
                            if(!userResult){
                                var resResult = {
                                    code : 400,
                                    message : AppLanguage.t("app", "Username is not found"),
                                    status : "NOK"
                                };
                                log.error("Check active user :" + JSON.stringify(resResult));
                                reject(resResult);
                                return false;
                            }
                            if(parseInt(userResult.active) === 0){
                                var resResult = {
                                    code : 400,
                                    message : AppLanguage.t("app", "Username is not active"),
                                    status : "NOK"
                                };
                                log.error("Check active user :" + JSON.stringify(resResult));
                                reject(resResult);
                                return false;
                            }
                            else{
//                                var resResult = {
//                                    code : 0,
//                                    status : "OK"
//                                }; 
                                resolve();
                           }
                        })
                        .catch(function(err){
                            log.error(JSON.stringify(err));
                            reject(err);
                        });
                }
                catch(e){
                    var resResult = {
                        code : 404,
                        message : AppLanguage.t("app", "Connention error"),
                        status : "NOK"
                    };
                    log.error("Check active user :" + JSON.stringify(e));
                    reject(resResult);
                }
            }
        });
    });
};

UserController.register = function(req, res, log){
    log.info("UserController --> register :" + TextHelper.parramToString(req.body));
    var resResult = { code : 0, message : AppLanguage.t("app", "success")};
    req.getConnection(function(err, connection){
        if (err){
            resResult.code = 0;
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("UserController --> register :" + " Connection error");
            return false;
        }
        try {
            var username = req.body.username;
            var password = req.body.username;
            var email = req.body.username;
            var phone = req.body.username;
            if (!username || !password || !email || !phone ) {
                resResult.code = 102;
                resResult.message = AppLanguage.t("app", "Parameters are invalid");
                res.json(resResult);
                log.error("UserController --> register :" + "Parameters are invalid");
                return false;
            }
            var userModel = new UserModel(req.body);
            userModel.add(connection, log, function(result){
                if (result.code === 0){
                    resResult.user = result.user;
                    res.json(resResult);
                }
                else{
                    resResult.code = 404;
                    resResult.message = AppLanguage.t("app", "Connection error");
                    res.json(resResult);
                    log.error("UserController --> register :" + " Connection error");
                    return false;
                }
            });
            
        }
        catch(e){
            log.error("UserController --> register Exception :" + " Connection error");
            return false;
        }
    });
};
module.exports = UserController;