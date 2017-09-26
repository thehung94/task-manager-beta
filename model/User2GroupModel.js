var User2GroupModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

User2GroupModel.prototype.setAttributes = function(data){
    this.id = data.id ? data.id : null;
    this.class_name = data.class_name ? data.class_name : null;
    this.descriptions = data.descriptions ? data.descriptions : null;
    this.max_participant = data.max_participant ? data.max_participant : null;
    this.type = data.type ? data.type : null;
    this.start_time = data.start_time ? data.start_time : null;
    this.created_time = data.created_time ? data.created_time : null;
    this.end_time = data.end_time ? data.end_time : null;
    this.status = data.status ? data.status : null;
};

User2GroupModel.prototype.getAttributes = function(){
    return {
        id: this.id,
        class_name: this.class_name   ,
        descriptions: this.descriptions,
        max_participant: this.max_participant,
        type: this.type,
        start_time: this.start_time,
        created_time: this.created_time,
        end_time: this.end_time,
        status: this.status
    };
};

User2GroupModel.validate = function(data){
    return {code: 0, message: ''};
};

User2GroupModel.prototype.save = function(connection, callback){
    var validate = this.validate(this.getAttributes());
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
                +" end_time = ?, status = ? WHERE gpoid = ?";
        params.push(this.id);
    }
    sqlQuery = 'INSERT INTO class (class_name, descriptions, max_participant, type, start_time, end_time, created_time, status) ' 
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    var self = this;
    var params = [this.class_name, this.descriptions, this.max_participant, this.type, this.start_time, this.end_time, this.created_time, this.status];
    connection.query(sqlQuery, params, function(err, result){
        if(err){
            console.log(err);
            callback({code : 404 , message :'Error when excute SQL Query' });
            return false;
        }
        self.id = result.insertId;
        callback({code: 0, message: '', Class: self});
    });
};

User2GroupModel.prototype.getOneByAttributes = function(attribute, value, connection, callback){
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

module.exports = User2GroupModel;