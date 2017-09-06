var TaskController = {};
var appLanguage = require('../messages/AppLanguage');
var TaskModel = require('../model/TaskModel');
var AppLanguage = new appLanguage();
TaskController.createTask = function(req, res, log){
    var resResult = {code : 0, status: "OK", message: AppLanguage.t("app", "success")};
    req.getConnection(function(err, connection){
        if (err) {
            resResult.code = 404;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Connection error");
            res.json(resResult);
            log.error("TaskController --> createTask --> 12 :" + "Connection error");
            return false;  
        }
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
            taskModel.add(connection, function(result){
                if (result.code !== 0){
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
        if (!req.body.user_id) {
            resResult.code = 102;
            resResult.status = "NOK";
            resResult.message = AppLanguage.t("app", "Parameter are invalid");
            res.json(resResult);
            log.error("TaskController --> getTaskByUser --> 80 :" + "Parameter are invalid");
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
            taskModel.add(connection, function(result){
                if (result.code !== 0){
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
    });
};

module.exports = TaskController;