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
//models
var TaskModel = require('./model/TaskModel');

//enum
var AppEnum = require('./util/AppEnums');
var myConnection = require('express-myconnection');

app.use(myConnection(mysql, config.dbOptions, 'pool'));

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
                UserController.doLogin(req, res, log);
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
app.use('/cms_api', apiRoutes);
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

apiRoutes.post('/createTask', function(req, res){
   TaskController.createTask(req, res, log);
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