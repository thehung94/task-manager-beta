var GroupModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

GroupModel.prototype.setAttributes = function(data){
    this.id = data.id ? data.id : null;
    this.group_name = data.group_name ? data.group_name : null;
    this.class_id = data.class_id ? data.class_id : null;
    this.description = data.description ? data.description : null;
    this.type = data.type ? data.type : null;
    this.max_user = data.max_user ? data.max_user : null;
    this.created_time = data.created_time ? data.created_time : null;
    this.user_create = data.user_create ? data.user_create : null;
    this.status = data.status ? data.status : null;
};

GroupModel.prototype.getAttributes = function(){
    return {
        id: this.id,
        group_name: this.group_name   ,
        class_id: this.class_id,
        description: this.description,
        type: this.type,
        max_user: this.max_user,
        created_time: this.created_time,
        user_create : this.user_create,
        status: this.status
    };
};

GroupModel.validate = function(data){
    return {code: 0, message: ''};
};

GroupModel.prototype.save = function(connection, callback){
    var sqlQuery ='';
    var params = [
        this.group_name, this.class_id, this.description, this.type,
        this.max_user, this.created_time, this.created_time, this.status
    ];
    if (this.id) {
        sqlQuery = "UPDATES group"
                +" SET group_name = ?, class_id = ?, description = ?, type = ?, max_user = ?"
                +" user_create = ?, status = ? WHERE id = ?";
        params.push(this.gpoid);
    }
    else{
        sqlQuery = 'INSERT INTO group (group_name, class_id, description, type, max_user, created_time, user_create, status) ' 
                + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    }
    var self = this;
    connection.query(sqlQuery, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 102 , message :'Error when excute SQL Query' });
            return false;
        }
        self.id = result.insertId ? result.insertId : this.id;
        callback({code: 0, message: '', taks: self});
    });
};

GroupModel.prototype.getOneByAttributes = function(attribute, value, connection, callback){
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

GroupModel.checkExistedClass = function(className, userId, connection, callback){
    var sqlQuery = "SELECT COUNT(c.id) number_count FROM class c " +
                " INNER JOIN user2class u2c ON u2c.class_id = c.id" +
                " WHERE c.class_name = ? AND u2c.user_id = ?";
    connection.query(sqlQuery, [className, userId], function(err, result){
        callback(err, result);
    });    
};

module.exports = GroupModel;