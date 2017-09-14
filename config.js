var config = {};


config.port = 8080; 
config.dbOptions = {

   "host": "localhost",
   "user": "root",
   "password": "hunghoa9403",
  
  "port": 3306,
  "database": "task_beta",
  "connectionLimit": 50,
  "waitForConnections": true,
  "debug": false
};
config.superSecret = 'sweetspring';

module.exports = config;
