var TaskModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

TaskModel.prototype.setAttributes = function(data){
    this.id = data.id ? data.id : null;
    this.task_name = data.task_name ? data.task_name : null;
    this.user_creator_id = data.user_creator_id ? data.user_creator_id : null;
    this.user_assigned_id = data.user_assigned_id ? data.user_assigned_id : null;
    this.class_id = data.class_id ? data.class_id : null;
    this.estimate_time = data.estimate_time ? data.estimate_time : null;
    this.created_time = data.created_time ? data.created_time : null;
    this.task_content = data.task_content ? data.task_content : null;
    this.status = data.status ? data.status : null;
};

TaskModel.prototype.getAttributes = function(){
    return {
        id: this.id,
        task_name: this.task_name   ,
        task_content: this.task_content,
        user_creator_id: this.user_creator_id,
        user_assigned_id: this.user_assigned_id,
        class_id: this.class_id,
        estimate_time: this.estimate_time,
        created_time: this.created_time,
        status: this.status
    };
};

TaskModel.validate = function(data){
    return {code: 0, message: ''};
};

TaskModel.prototype.add = function(connection, log, callback){
    var validate = this.validate(this.getAttributes());
    if(validate.code){
        callback(validate);
        return false;
    }
    var sql = 'INSERT INTO task (task_name, task_content, user_creator_id, user_asigm_id, class_id, estimate_time, created_time, status) ' 
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var self = this;
    var params = [this.task_name, this.task_content, this.user_creator_id, this.user_assigned_id, this.class_id, this.estimate_time, this.created_time, this.status];
    connection.query(sql, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 102 , message :'Error when excute SQL Query' });
            return false;
        }
        self.id = result.insertId;
        callback({code: 0, message: '', taks: self});
    });
};

TaskModel.prototype.getOneByAttributes = function(attribute, value, connection, callback){
    var sqlQuery = "SELECT * FROM task WHERE "
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

module.exports = TaskModel;