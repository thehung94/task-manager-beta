var User2ClassModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

User2ClassModel.prototype.setAttributes = function(data){
    this.id = data.id ? data.id : null;
    this.user_id = data.user_id ? data.user_id : null;
    this.class_id = data.class_id ? data.class_id : null;
    this.created_time = data.created_time ? data.created_time : null;
    this.status = data.end_time ? data.status : null;
};

User2ClassModel.prototype.getAttributes = function(){
    return {
        id: this.id,
        user_id: this.user_id   ,
        class_id: this.class_id,
        created_time: this.created_time,
        status: this.status
    };
};

User2ClassModel.validate = function(data){
    return {code: 0, message: ''};
};

User2ClassModel.prototype.save = function(connection, callback){
    var validate = User2ClassModel.validate(this.getAttributes());
    if(validate.code){
        callback(validate);
        return false;
    }
    var sqlQuery ='';
    var params = [
        this.user_id, this.class_id, this.created_time, this.status
    ];
    if (this.id) {
        sqlQuery = "UPDATES user2class"
                +" SET user_id = ?, class_id = ?, created_time = ?, status = ? WHERE id = ?";
        params.push(this.id);
    }
    sqlQuery= "INSERT INTO user2class (user_id, class_id, created_time, status) " 
            + "VALUES (?, ?, ?, ?)";
    var self = this;
    connection.query(sqlQuery, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 404 , message :'Error when excute SQL Query', error : err });
            return false;
        }
        self.id = result.insertId;
        callback({code: 0, message: '', thisModel: self});
    });
};

User2ClassModel.prototype.getOneByAttributes = function(attribute, value, connection, callback){
    var sqlQuery = "SELECT * FROM user2class WHERE "
                + attribute
                + " = ? LIMIT 1";
    connection.query(sqlQuery, [value], function(err, result){
        if (err){
            callback({
                code : 404,
                message : '',
                error : err
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

module.exports = User2ClassModel;