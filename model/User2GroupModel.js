var User2GroupModel = function(data){
    if(data){
        this.setAttributes(data);
    }
};

User2GroupModel.prototype.getTableName = function(){
    return 'user2group';
};

User2GroupModel.prototype.setAttributes = function(data){
    this.id = data.id ? data.id : null;
    this.user_id = data.user_id ? data.user_id : null;
    this.group_id = data.group_id ? data.group_id : null;
    this.status = data.status ? data.status : null;
    this.join_time = data.join_time ? data.join_time : null;
    this.role_view = data.role_view ? data.role_view : null;
    this.role_edit = data.role_edit ? data.role_edit : null;
    this.role_create = data.role_create ? data.role_create : null;
    this.role_comment = data.role_comment ? data.role_comment : null;
    this.role_adduser = data.role_adduser ? data.role_adduser : null;
    this.role_deluser = data.role_deluser ? data.role_deluser : null;
    this.role_breaktask = data.role_breaktask ? data.role_breaktask : null;
    this.role_close = data.role_close ? data.role_close : null;
    this.role_block = data.role_block ? data.role_block : null;
};

User2GroupModel.prototype.getAttributes = function(){
    return {
        id: this.id,
        user_id: this.user_id   ,
        group_id: this.group_id,
        status: this.status,
        join_time: this.join_time,
        user_created_id: this.user_creator_id,
        role_view: this.role_view,
        role_edit: this.role_edit,
        role_create: this.role_create,
        role_comment: this.role_comment,
        role_adduser: this.role_adduser,
        role_deluser: this.role_deluser,
        role_breaktask: this.role_breaktask,
        role_close: this.role_close,
        role_block: this.role_block
    };
};

User2GroupModel.validate = function(data){
    return {code: 0, message: ''};
};

User2GroupModel.prototype.save = function(connection, callback){
    var validate = User2GroupModel.validate(this.getAttributes());
    if(validate.code){
        callback(validate);
        return false;
    }
    var sqlQuery ='';
    var params = [
        this.user_id, this.group_id, this.status, this.join_time, this.role_view, this.role_edit,
        this.role_create, this.role_comment, this.role_adduser, this.role_deluser, this.role_breaktask, this.role_close, this.role_block
    ];
    if (this.id) {
        sqlQuery = "UPDATES user2group"
                +" SET user_id = ?, group_id = ?, status = ?, join_time = ?, role_view= ?, role_edit= ?, role_create= ?, "
                +" role_comment= ?, role_adduser= ?, role_deluser= ?, role_breaktask= ?, role_close= ?, role_block= ? WHERE gpoid = ?";
        params.push(this.id);
    }
    else{
        sqlQuery = "INSERT INTO user2group (user_id, group_id, status, join_time, role_view, role_edit, role_create,"
                + " role_comment, role_adduser, role_deluser, role_breaktask, role_close, role_block)"
                + " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    }
    
    var self = this;
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
    var sqlQuery = "SELECT * FROM user2group WHERE "
                + attribute
                + " = ? LIMIT 1";
    connection.query(sqlQuery, [value], function(err, result){
        if (err){
            callback({
                code : 404,
                error : err,
                message : ''
            });
            return false;
        }
        callback({
            code : 0,
            message : '',
            error : null,
            data : result
        });
    });
};

module.exports = User2GroupModel;