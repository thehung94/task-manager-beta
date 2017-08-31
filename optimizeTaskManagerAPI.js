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

//enum
var AppEnum = require('./util/AppEnums');
var myConnection = require('express-myconnection'); // express-myconnection module

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
 * http://cp.cam9.tv:3000/login?action=login&password=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918&email=tungnd@vp9.tv
 */
function doLogin(req, res, connection) {
    var username = req.query.username;
    var phone = req.query.phone;
    var email = req.query.email;
    var password = req.query.password;
    var selectQuery = 'select * from users where password=? and ';
    var identifier = '';
    var error = 0;
    if (!password) {
        console.log('no has password');
        error++;
    } else {
        if (username) {
            selectQuery += ' username = ? ';
            identifier = username;
        } else if (phone) {
            selectQuery += ' phone_number = ? ';
            identifier = phone;
        } else if (email) {
            selectQuery += ' email = ? ';
            identifier = email;
        } else {
            error++;
        }
    }
    if (error === 0) {
        connection.query(selectQuery, [password, identifier], function (err, result) {
            if (err) {
                var resResult = { "code": 100, "status": "Database error " + err };
                log.error(JSON.stringify(resResult));
                res.json(resResult);
            } else {
                if (result.length === 1) {
                    var userModel = result[0];
                    if(parseInt(userModel.active) === 0){
                        var resResult = {code: 101, status: "User is inactive"};
                        log.error(JSON.stringify(resResult));
                        res.json(resResult);
                        return false;
                    }
                    else{
                        loginSuccessfull(result, res, connection);
                    }
                } else {
                    var resResult = { "code": 101, "status": "Invalid username or password" };
                    log.error(JSON.stringify(resResult));
                    res.json(resResult);
                }

            }

        });
    } else {
        var resResult = { "code": 102, "status": "API Paramaters are not enough" };
        log.error(JSON.stringify(resResult));
        res.json(resResult);
    }
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
function Gettoken(req, res) {
    req.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Database error " + err });
            return;
        }
        else {
            var device_id = req.param('device_id');
            //kiem tra xem device_id co ton tai khong neu khong thi bao loi
            var mysqlQuery = "select count(*)icount,(select ss.`owner` from sites ss where ss.id = s.site_id)site_name from servers s where device_id=?";
            connection.query(mysqlQuery, [device_id], function (err, result) {
                if (err) {
                    res.json({ "code": 100, "status": "Error in connection database" });
                    console.log(err);
                }
                else {
                    console.log(result[0].icount);
                    if (result[0].icount > 0) {
                        //bat dau get token o doan nay
                        var token = jwt.sign({ device_id: device_id }, app.get('superSecret'), {
                            expiresIn: 86400 * 365 // expires in 24*365 hours (1 year)
                        });
                        res.json({
                            code: 0,
                            message: 'Enjoy your token!',
                            device_id: device_id,
                            site_name: result[0].site_name,
                            token: token
                        });
                    }
                    else {
                        res.json({ "code": 102, "status": "Not found device_id" });
                        console.log(err);
                    }
                }
            });
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

app.listen(config.port);
console.log('App listen on port :' + config.port);