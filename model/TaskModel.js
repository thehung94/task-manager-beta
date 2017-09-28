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

TaskModel.prototype.save = function(connection, callback){
    var sqlQuery = '';
    var params = [
            this.task_name, this.task_content, this.user_creator_id, this.user_assigned_id, 
            this.class_id, this.estimate_time, this.created_time, this.status
        ];
    if (this.id){
        sqlQuery = "UPDATES task"
                    +" SET task_name = ?, task_content = ?, user_creator_id = ?, user_assigned_id = ?"
                    +" class_id = ?, estimate_time = ?, status = ? WHERE id = ?";
        params.push(this.id);
    }
    else{
        sqlQuery = "INSERT INTO task (task_name, task_content, user_creator_id, user_assigned_id, class_id, estimate_time, created_time, status) " 
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    }
    
    var self = this;
    
    connection.query(sqlQuery, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 102 , message :'Error when excute SQL Query' });
            return false;
        }
        self.id = result.insertId ? result.insertId : this.id;
        callback({code: 0, task: self});
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
TaskModel.getAllTaskByUser = function(userId, connection, callback){
    var sqlQuery = " SELECT t.*,g.group_name, c.class_name  FROM task t" +
                " INNER JOIN users u ON t.user_creator_id = u.gpoid OR t.user_assigned_id = u.gpoid " +
                " LEFT JOIN user2class u2c ON u2c.user_id = t.user_creator_id OR u2c.user_id = t.user_assigned_id " +
                " LEFT JOIN user2group u2g ON u2g.user_id = t.user_creator_id OR u2g.user_id = t.user_assigned_id  " +
                " LEFT JOIN class c ON  u2c.class_id = c.id " +
                " LEFT JOIN `group` g ON g.id = u2g.group_id "+
                " WHERE u.gpoid = 2 ORDER BY c.class_name DESC , t.created_time";
    connection.query(sqlQuery, [userId], function(err, result){
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