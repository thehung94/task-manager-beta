var ClassController = {};
var appLanguage = require('../messages/AppLanguage');
var AppLanguage = new appLanguage();
var ClassModel = require('../model/ClassModel');
var jwt = require('jsonwebtoken');
var async = require('async');
var User2Class = require('../model/User2ClassModel');
ClassController.createClass = function(req, res, log){
    var resResult = {};
    req.getConnection(function(err, connection){
        if (err) {
            resResult = {
                code : 404,
                message : AppLanguage.t("app", "Connention error"),
                status : "NOK"
            };
            log.error("ClassController --> createClass :" + JSON.stringify(resResult));
            res.json(resResult);
            return false;
        }
        try {
            var dataReq = req.body;
            var className = req.body.class_name;
            var type = req.body.type;
            var userId = req.body.user_id;
            if (!className || !type || !userId){
                resResult = {
                    code : 102,
                    message : AppLanguage.t("app","Parameters are invalid"),
                    status : "NOK"
                };
                res.json(resResult);
                log.error("Usercontroller --> createClass :" + JSON.stringify(resResult));
                return false;
            }
            //validate class -> check exist, check error
            ClassModel.checkExistedClass(className, userId, connection, function(err, result){
                console.log(result[0].number_count);return;
                if(err){
                    resResult = {
                        code : 404,
                        message : AppLanguage.t("app","Connection error"),
                        status : "NOK"
                    };
                    res.json(resResult);
                    log.error("Usercontroller --> createClass :" + JSON.stringify(resResult));
                    return false;
                }
                
                else if (result[0].number_count >= 1){
                    console.log('aaaaaaaaaa');return;
                    resResult = {
                        code : 1001,
                        message : AppLanguage.t("app","Task existed"),
                        status : "NOK"
                    };
                    res.json(resResult);
                    log.error("Usercontroller --> createClass :" + JSON.stringify(resResult));
                    return false;
                }
                else{
                    dataReq.created_time = parseInt(Date.now()/1000);
                    var classModel = new ClassModel(req.body);
                    async.waterfall([
                        function(callbackWf){
                            classModel.save(connection, function(result){
                                if (result.code === 0 ){
                                    callbackWf(null, result.thisClass);
                                }
                                else{
                                    callbackWf(result, null);
                                }
                            });
                        },
                        function(thisClass ,callbackWf){
                            var user2Class = { class_id : thisClass.id, user_id: userId, status : 1, created_time: Date.now() / 1000};
                            var user2ClassModel = new User2Class(user2Class);
                            user2ClassModel.save(connection, function(result){
                                if (result.code === 0 ){
                                    thisClass.user_id = userId;
                                    callbackWf(null, thisClass);
                                }
                                else{
                                    callbackWf(result.error, null);
                                }
                            });
                        }
                    ], 
                    function(err, result){
                        if (err){
                            resResult = {
                                code : 404,
                                message : AppLanguage.t("app","Connection error"),
                                status : "NOK"
                            };
                            res.json(resResult);
                            log.error("Usercontroller --> createClass :" + JSON.stringify(resResult));
                            return false;
                        }
                        else{
                            resResult = {
                                code : 404,
                                message : AppLanguage.t("app","Success"),
                                status : "NOK",
                                data : result
                            };
                            res.json(resResult);
                        }
                    });
                }
            });
        }
        catch(error){
            resResult = {
                code : 404,
                message : AppLanguage.t("app", "Connection error"),
                status : "NOK"
            };
            log.error("UserController --> activeUser :" + JSON.stringify(error));
            res.json(resResult);
            return false;
        }
    });
};

module.exports = ClassController;

