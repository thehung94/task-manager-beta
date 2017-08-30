 function notifycation() {

 }

 /**
  * @api {get} cp.cam9.tv:3000/module 2.7 Get list notifycation with start,limit
  * @apiName getNotificationGeneralInfo
  * @apiGroup MODULE
  *
  * @apiParam {String} action Type of action, fix equal "get_notifycation"
  * @apiParam {Integer} start START row of list data
  * @apiParam {Integer} limit MAX NUM of notifycation general info per get
  *
  * @apiSuccess {String} Result List of Notifycation General
  * @apiExample {get} Example request
  * http://cp.cam9.tv:3000/module?action=get_notification_general_info&user_id=129
  */

notifycation.getNotificationGeneralInfo = function (req, res, connection) {
    var start = req.query.start;
    var limit = req.query.limit;
    if (start == null ||  limit == null ||
        start === '' || limit === '') {
        start = 0;
        limit = 9999999;
    }
    var mysqlQuery = "SELECT  * "
    + " FROM notification_general_info n "
    + " ORDER BY n.create_date DESC LIMIT ?,? ";
    //SELECT id, site_id, site_name, news_title FROM notification WHERE site_id in (SELECt site_id FROM user_site WHERE user_id = 129";
    connection.query(mysqlQuery, [parseInt(start),parseInt(limit)], function (err, result) {
            //connection.release();
            if (err) {
                res.json({"code": 100, "status": "Error in connection database"});
                console.log(err);
            } else {
                if (result.length > 0) {
                    res.send(result);
                } else {
                    res.send("0");
                }
            }
        }
    )
}

/**
 * @api {get} cp.cam9.tv:3000/module 2.7 Get list notifycation with start,limit
 * @apiName getNotification
 * @apiGroup MODULE
 *
 * @apiParam {String} action Type of action, fix equal "get_notifycation"
 * @apiParam {String} user_id ID of user
 * @apiParam {Integer} start START row of list data
 * @apiParam {Integer} limit MAX NUM of notifycation per get
 *
 * @apiSuccess {String} Result List of Notify
 * @apiExample {get} Example request
 * http://cp.cam9.tv:3000/module?action=get_notifycation&user_id=129
 */

notifycation.getNotifycation = function (req, res, connection) {
   var user_id = req.query.user_id;
   var start = req.query.start;
   var limit = req.query.limit;
   if (user_id == null || start == null ||  limit == null
       || user_id === '' || start === '' || limit === '') {
       //connection.release();
       res.json({"code": 1030, "status": "Missing parameter"});
       return;
   }
   var mysqlQuery = "SELECT  s.owner site_title, s.icon site_icon, n.id notifycation_id , n.site_id, n.site_name, n.news_title, n.news_content "
   + " FROM notification n "
   + " INNER JOIN `notification_users_sites` nus ON nus.site_id = n.site_id "
   + " INNER JOIN `sites` s ON s.id = n.site_id WHERE nus.user_id = ? "
   + " ORDER BY n.create_date DESC LIMIT ?,? ";
   //SELECT id, site_id, site_name, news_title FROM notification WHERE site_id in (SELECt site_id FROM user_site WHERE user_id = 129";
   connection.query(mysqlQuery, [user_id,parseInt(start),parseInt(limit)], function (err, result) {
           //connection.release();
           if (err) {
               res.json({"code": 100, "status": "Error in connection database"});
               console.log(err);
           } else {
               if (result.length > 0) {
                   res.send(result);
               } else {
                   res.send("0");
               }
           }
       }
   )
}

/**
 * @api {get} cp.cam9.tv:3000/module 2.7 Get list notifycation with start,limit
 * @apiName getNotification
 * @apiGroup MODULE
 *
 * @apiParam {String} action Type of action, fix equal "get_notifycation"
 * @apiParam {String} user_id ID of user
 * @apiParam {Integer} start START row of list data
 * @apiParam {Integer} limit MAX NUM of notifycation per get
 *
 * @apiSuccess {String} Result List of Notify
 * @apiExample {get} Example request
 * http://cp.cam9.tv:3000/module?action=get_notifycation&user_id=129
 */

notifycation.getNotifycation = function (req, res, connection) {
   var user_id = req.query.user_id;
   var start = req.query.start;
   var limit = req.query.limit;
   var site_id = req.query.site_id;
   if (user_id == null || start == null ||  limit == null
       || user_id === '' || start === '' || limit === '') {
       //connection.release();
       res.json({"code": 1030, "status": "Missing parameter"});
       return;
   }
   /*var mysqlQuery = "SELECT  s.owner site_title, s.icon site_icon, n.id notifycation_id , n.site_id, n.site_name, n.news_title, n.news_content, n.create_date "
   + " FROM notification n "
   + " INNER JOIN `notification_users_sites` nus ON nus.site_id = n.site_id "
   + " INNER JOIN `sites` s ON s.id = n.site_id WHERE nus.user_id = ? and nus.site_id = ?"
   + " ORDER BY n.create_date DESC LIMIT ?,? ";*/
   var mysqlQuery = "SELECT u.* FROM ((SELECT  s.owner site_title, s.icon site_icon, n.id notifycation_id , n.site_id, n.site_name, n.news_title, n.news_content, n.create_date "+
                "FROM notification n  "+
                "INNER JOIN `news2site` nus ON nus.news_id = n.id "+
                "INNER JOIN `user2site` us ON us.id  = nus.user2site_id  "+
                "INNER JOIN `sites` s ON s.id = n.site_id WHERE us.site_member_id = ? )"+
                "union   "+
                "(SELECT  s.owner site_title, s.icon site_icon, n.id notifycation_id , n.site_id, n.site_name, n.news_title, n.news_content, n.create_date "+
                "FROM notification n "+
                "INNER JOIN `sites` s ON s.id = n.site_id WHERE n.site_id = ? ))"+
                "AS u ORDER BY u.create_date DESC LIMIT ?,?";
   //SELECT id, site_id, site_name, news_title FROM notification WHERE site_id in (SELECt site_id FROM user_site WHERE user_id = 129";
   connection.query(mysqlQuery, [site_id,site_id,parseInt(start),parseInt(limit)], function (err, result) {
           //connection.release();
           if (err) {
               res.json({"code": 100, "status": "Error in connection database"});
               console.log(err);
           } else {
               if (result.length > 0) {
                   res.send(result);
               } else {
                   res.send("0");
               }
           }
       }
   )
}

module.exports = notifycation;
