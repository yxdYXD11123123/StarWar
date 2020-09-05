//连接数据库

//引入mysql包
const mysql = require('mysql');

//配置数据库信息
const pool = mysql.createPool({
    multipleStatements: true,
    //数据库连接池 有多少连接
    connecttionLimit : 20,
    host : 'localhost',
    user : 'demo',
    password : '123456',
    database : 'demo'
});

//导出数据库
module.exports = pool;
