var ClassModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

ClassModel.prototype.setAttributes = function(data){
    this.id = data.id ? data.id : null;
    this.class_name = data.class_name ? data.class_name : null;
    this.descriptions = data.descriptions ? data.descriptions : null;
    this.max_participant = data.max_participant ? data.max_participant : null;
    this.type = data.type ? data.type : null;
    this.start_time = data.start_time ? data.start_time : null;
    this.created_time = data.created_time ? data.created_time : null;
    this.end_time = data.end_time ? data.end_time : null;
    this.status = data.status ? data.status : null;
    this.max_group = data.max_group ? data.max_group : null;
};

ClassModel.prototype.getAttributes = function(){
    return {
        id: this.id,
        class_name: this.class_name   ,
        descriptions: this.descriptions,
        max_participant: this.max_participant,
        type: this.type,
        start_time: this.start_time,
        created_time: this.created_time,
        end_time: this.end_time,
        status: this.status,
        max_group: this.max_group
    };
};

ClassModel.validate = function(data){
    return {code: 0, message: ''};
};

ClassModel.prototype.save = function(connection, callback){
    var validate = ClassModel.validate(this.getAttributes());
    if(validate.code){
        callback(validate);
        return false;
    }
    var sqlQuery ='';
    var params = [
        this.class_name, this.descriptions, this.max_participant,
        this.type, this.start_time, this.end_time, this.created_time, this.status
    ];
    if (this.id) {
        sqlQuery = "UPDATES class"
                +" SET class_name = ?, descriptions = ?, max_participant = ?, type = ?, start_time = ?"
                +" end_time = ?, status = ?, created_time= ?, max_group= ? WHERE id = ?";
        params.push(this.id);
    }
    else{
        sqlQuery = 'INSERT INTO class (class_name, descriptions, max_participant, type, start_time, end_time, created_time, status, max_group) ' 
                + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    }
    var self = this;
    connection.query(sqlQuery, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 404 , message :'Error when excute SQL Query' });
            return false;
        }
        self.id = result.insertId;
        callback({code: 0, message: '', thisClass: self});
    });
};

ClassModel.prototype.getOneByAttributes = function(attribute, value, connection, callback){
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

ClassModel.checkExistedClass = function(className, userId, connection, callback){
    var sqlQuery = "SELECT COUNT(c.id) number_count FROM class c " +
                " INNER JOIN user2class u2c ON u2c.class_id = c.id" +
                " WHERE c.class_name = ? AND u2c.user_id = ?";
    connection.query(sqlQuery, [className, userId], function(err, result){
        callback(err, result);
    });    
};

module.exports = ClassModel;