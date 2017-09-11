var express = require("express");
var mysql = require('mysql');
var app = express();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('events').EventEmitter.prototype._maxListeners = 100;
var config = require('./config.js');
app.set('superSecret', config.superSecret); // secret variable
var async = require("async");
var bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');
var p_user_id = 0;
var p_site_owner_id = 0;
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
var Log = require('./util/log');
var log = new Log(__dirname + '/log');
var appLanguage = require('./messages/AppLanguage');
var AppLanguage = new appLanguage();
//controller
var UserController = require('./controller/UserController.js');
var TaskController = require('./controller/TaskController');
var ClassController = require('./controller/ClassController');
var GroupController = require('./controller/GroupController');

//enum
var AppEnum = require('./util/AppEnums');
var myConnection = require('express-myconnection');

app.use(myConnection(mysql, config.dbOptions, 'pool'));
/**
 * @api {get} cp.cam9.tv:3000/login 3.1 Authenticate user in mobile app
 * @apiName doLogin
 * @apiGroup CMS API
 *
 * @apiParam {String} action Type of action, fix value "login"
 * @apiParam {String} password A SHA265 string from user's password
 * @apiParam {String} email Email
 * @apiParam {String} phone Phone number
 * @apiParam {String} username Username
 * @apiDescription Param email, phone and username are options, but have to one of them.
 *
 * @apiSuccess {String} success True
 * @apiSuccess {String} message Enjoy your token!
 * @apiSuccess {String} token Token generated for client
 *
 * @apiExample {get} Example request
 * http://localhost:3000/login?action=login&password=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918&email=tungnd@vp9.tv
 */
function doLogin(req, res, connection) {
    var username = req.query.username;
    var phone = req.query.phone;
    var email = req.query.email;
    var password = req.query.password;
    var selectQuery = 'SELECT * FROM users WHERE password = ? AND ';
    var identifier = '';
    var resResult = {
        code : 0,
        message : AppLanguage.t("app", "success")
    };
    if (!password || (!username && !email && !phone)) {
        resResult.code = 102;
        resResult.message = AppLanguage.t("app", "Parameters are invalid");
        res.json(resResult);
        log.error("doLogin --> 63 : " + "Parameters are invalid");
        return false;
    }
    if (username) {
        selectQuery += ' username = ? ';
        identifier = username;
    } else if (phone) {
        selectQuery += ' phone_number = ? ';
        identifier = phone;
    } else if (email) {
        selectQuery += ' email = ? ';
        identifier = email;
    }
    
    connection.query(selectQuery, [password, identifier], function (err, result) {
        if (err) {
            resResult.code= 404;
            resResult.message = AppLanguage.t("app", "Connection error");
            log.error("login ---> 80 :" + "Connection error");
            res.json(resResult);
            return false;
        }
        if (!result || !result.length) {
            resResult.code = 0;
            resResult.message = AppLanguage.t("app", "Invalid username or password");
            log.error("login ---> 80" + "Invalid username or password" );
            res.json(resResult);
            return false;
        }
        var userModel = {
            username : result[0].username,
            user_id : result[0].gpoid,
            email : result[0].email
        };
        var token = jwt.sign(userModel, config.superSecret, {
            expiresIn: 86400 * 365
        });
        resResult.code = 0;
        resResult.message = AppLanguage.t("app", "success");
        resResult.user_id = result[0].gpoid;
        resResult.token = token;
        res.json(resResult);
        return false;
    });
}
function handle_login(req, res) {
    req.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Database error " + err });
            return;
        }
        console.log('connected as id ' + connection.threadId);
        var action = req.query.action;
        switch (action) {
            case 'login':
                doLogin(req, res, connection);
                break;
            default:
                console.log('Do nothing');
                res.json({ "code": 102, "status": "Invalid param action" });
        }
    });
}

var apiLimiter = new RateLimit({
    windowsMs: 1 * 60 * 1000,
    max: 60,
    delayMs: 0,
    message: "Too many request to API"
});
app.use(function(req, res, next){
    log.req = req;
    next();
});
var apiRoutes = express.Router();
app.get("/login", apiLimiter, function (req, res) {
    -
        handle_login(req, res);
});
app.post('/register', apiLimiter, function (req, res) {
    UserController.register(req, res, log);
});
// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function (req, res, next) {
    var token = req.param('token');
    if (token) {
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                p_user_id = decoded.gpoid;
                p_site_owner_id = decoded.id_sites;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

apiRoutes.get('/getTask', function(req, res){
   TaskController.getTask(req, res);
});

apiRoutes.get('/createTask', function(req, res){
   TaskController.getTask(req, res);
});

apiRoutes.get('/updateTask', function(req, res){
   TaskController.getTask(req, res);
});

apiRoutes.get('/deleteTask', function(req, res){
   TaskController.getTask(req, res);
});

apiRoutes.get('/getClass', function(req, res){
   ClassController.getClass(req, res);
});

apiRoutes.get('/createClass', function(req, res){
   ClassController.getClass(req, res);
});

apiRoutes.get('/updateTask', function(req, res){
   ClassController.getClass(req, res);
});

apiRoutes.get('/deleteClass', function(req, res){
   ClassController.getTask(req, res);
});

app.listen(config.port);
console.log('App listen on port :' + config.port);