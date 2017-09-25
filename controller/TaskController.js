var TaskController = {};
var appLanguage = require('../messages/AppLanguage');
var TaskModel = require('../model/TaskModel');
var UserModel = require('../model/UserModel');
var AppLanguage = new appLanguage();
var TextHelper = require('../util/helpers/TextHelper');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
TaskController.createTask = function(req, res, log){
    var resResult = {code : 0, status: "OK", message: AppLanguage.t("app", "success")};
    log.info("TaskController --> createTask :" + TextHelper.parramToString(req.bpdy));
    req.getConnection(function(err, connection){
        if (err) {
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> createTask --> 12 :" + "Connection error");
            return false;  
        }
        try{
            if (!req.body.task_name || !req.body.user_creator_id) {
                resResult.code = 102;
                resResult.status = "NOK";
                resResult.message = AppLanguage.t("app", "Parameter are invalid");
                res.json(resResult);
                log.error("TaskController --> createTask --> 21 :" + "Parameter are invalid");
                return false;
            }
            //kiem tra voi task user create and user assigment === thi bao existed;
            var data = req.body;
            data.created_time = parseInt(Date.now() / 1000);
            var taskModel = new TaskModel(data);
            taskModel.getOneByAttributes('task_name', data.task_name, connection, function(result){
                if (err){
                    resResult.code = 404;
                    resResult.status = "NOK";
                    resResult.message = AppLanguage.t("app", "Connection error");
                    res.json(resResult);
                    log.error("TaskController --> createTask --> 34 :" + "Connection error");
                    return false;
                }
                if (result.data.length > 0 && result.data[0].user_creator_id === data.user_creator_id && result.data[0].user_asigm_id === data.user_asigm_id ){
                    resResult.code = 103;
                    resResult.status = "NOK";
                    resResult.message = AppLanguage.t("app", "This task aready existed");
                    res.json(resResult);
                    log.error("TaskController --> createTask --> 43 :" + "This task aready existed");
                    return false;
                }
                taskModel.save(connection, function(result){
                    if (result.code === 0){
                        resResult.task = result.task;
                        res.json(resResult);
                        return false;
                    }
                    else{
                        resResult.code = 404;
                        resResult.status = "NOK";
                        resResult.message = AppLanguage.t("app", "Connection error");
                        res.json(resResult);
                        log.error("TaskController --> createTask --> 56 :" + "Connection error");
                        return false;
                    }
                });
            });
        }
        catch(e){
            console.log(e);
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> createTask --> exception :" + TextHelper.parramToString(e));
        }
    });  
};

TaskController.getTaskByUser = function(req, res, log){
    var resResult = {code : 0, status: "OK", message: AppLanguage.t("app", "success")};
    req.getConnection(function(err, connection){
        if (err) {
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> getTaskByUser --> 72 :" + "Connection error");
            return false;  
        }
        try{
            
            var token = req.param('token');
            var userId = parseInt(req.param('u'));
            if (!userId) {
                resResult.code = 102;
                resResult.status = "NOK";
                resResult.message = AppLanguage.t("app", "Parameter are invalid");
                res.json(resResult);
                log.error("TaskController --> getTaskByUser --> 80 :" + "Parameter are invalid");
                return false;
            }
            jwt.verify(token, config.superSecret, function(err, decoded){
                if (err){
                    resResult.code = 10000;
                    resResult.status = "NOK";
                    resResult.message = AppLanguage.t("app", "Token are invalid");
                    res.json(resResult);
                    log.error("TaskController --> getTaskByUser --> 72 :" + "Token is invalid");
                    return false;
                }
                var userModel = new UserModel({user_id : userId});
                if (parseInt(decoded.gpoid) !== userId) {
                    resResult.code = 1002;
                    resResult.status = "NOK";
                    resResult.message = AppLanguage.t("app", "User is'nt active"); 
                    res.json(resResult);
                    return false;
                }
                userModel.getOneByAttributes('gpoid', userId, connection, function(result){
                    if (result.code === 0 && parseInt(result.data[0].active) === 1){
                        TaskModel.getAllTaskByUser(userId, connection, function(result){
                            if (result.code === 0){
                                resResult.list_task = result.data;
                                res.json(resResult);
                            }
                            else{
                                resResult.code = 1003;
                                resResult.message = AppLanguage.t("app", "Database connection error");
                                res.json(resResult);
                            }
                        });
                    }
                    else{
                        resResult.code = 105;
                        resResult.message = AppLanguage.t("app", "User is not actived");
                        res.json(resResult);
                    }
                });
            });
        }
        catch(e){
            console.log(e);
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> createTask --> exception :" + TextHelper.parramToString(e));
        }
    });
};

TaskController.updateTask = function(req, res, log){
    var resResult = {code : 0, status: "OK", message: AppLanguage.t("app", "success")};
    log.info("TaskController --> updateTask :" + TextHelper.parramToString(req.bpdy));
    req.getConnection(function(err, connection){
        if (err) {
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> updateTask --> 162 :" + "Connection error");
            return false;  
        }
        try{
            if (!req.body.id || !req.body.task_name || !req.body.user_creator_id) {
                resResult.code = 102;
                resResult.status = "NOK";
                resResult.message = AppLanguage.t("app", "Parameter is invalid");
                res.json(resResult);
                log.error("TaskController --> updateTask --> 171 :" + "Parameter is invalid");
                return false;
            }
            //kiem tra voi task user create and user assigment === thi bao existed;
            var data = req.body;
            data.created_time = parseInt(Date.now() / 1000);
            var taskModel = new TaskModel(data);
            taskModel.save(connection, function(result){
                if (result.code === 0){
                    resResult.task = result.task;
                    res.json(resResult);
                    return false;
                }
                else{
                    resResult.code = 404;
                    resResult.status = "NOK";
                    resResult.message = AppLanguage.t("app", "Connection error");
                    res.json(resResult);
                    log.error("TaskController --> updateTask --> 189 :" + "Connection error");
                    return false;
                }
            });
        }
        catch(e){
            console.log(e);
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> updateTask --> exception :" + TextHelper.parramToString(e));
        }
    }); 
};

module.exports = TaskController;