//引入数据库连接池
const pool = require('../config/dbconfig');

//#region 查询前100条数据
module.exports.getScore = (callback) => {
    //书写sql语句
    let sql = `SELECT swu.nickname, swu.headimgurl, swc.score, swc.rank FROM sw_score swc join sw_wechat_userinfo swu on swc.openid = swu.openid order by swc.score desc LIMIT 0,100`;

    //查询数据
    pool.query(sql, function (error, results) {
        if (error) throw error;

        callback(results);
    })
}
//#endregion


//#region 根据 openid 修改用户分数
module.exports.updateScore = (openid, score, callback) => {
    let ifhave = `select * from sw_score where openid = '${openid}';`;
    // 先查询是否已经有这个人的分数记录
    pool.query(ifhave, function (error, results) {
        if (error) throw error;
        // 如果没有就添加分数记录
        if (results.length == 0) {
            // let addScore = `insert into sw_score (score, create_time, openid) values (${score}, '${new Date()}', '${openid}')`;
            let addScore = `insert into sw_score set ?`;
            let data = {
                openid,
                score,
                create_time: new Date()
            }
            pool.query(addScore, data, (error, results) => {
                if (error) throw error;
                callback(results);
            })
        }
        // 如果有且本次分数更高，就更新分数
        else if (+results[0].score < +score) {
            let sql = `UPDATE sw_score SET ? WHERE openid='${openid}'`;
            let newData = {
                score,
                create_time: new Date()
            }
            //修改数据
            pool.query(sql, newData, function (error, results) {
                if (error) throw error;
                callback(results);
            })
        }
    })
}
//#endregion



//#region 根据openid 查询用户
module.exports.findUserByOpenid = (openid, callback) => {
    //书写sql语句
    let sql = `SELECT * FROM sw_wechat_userinfo WHERE openid = '${openid}'`;

    //查询数据
    pool.query(sql, function (error, results) {
        if (error) throw error;

        callback(results);
    })
}
//#endregion


//#region 修改 user 数据
module.exports.updateUser = (openid, user, callback) => {
    //创建变量 储存数据
    let sets = '';

    //遍历user对象
    for (let i in user) {
        sets += i + "='" + user[i] + "',";
    }

    //删除末尾,
    sets = sets.slice(0, -1);

    let sql = `UPDATE sw_wechat_userinfo SET ${sets} WHERE openid = '${openid}'`;

    pool.query(sql, function (error, results) {
        if (error) throw error;

        callback(results);
    })
}
//#endregion



//#region 添加 user 数据
module.exports.addUser = (user, callback) => {
    //创建变量 储存数据
    let values = '';

    //遍历user对象
    for (let i in user) {
        values += "'" + user[i] + "',";
    }

    //删除末尾,
    values = values.slice(0, -1);
    console.log(values);

    let sql = `INSERT INTO sw_wechat_userinfo
    (openid,nickname,sex,province,city,country,headimgurl,createtime,updatetime)
    VALUES(${values})`;

    pool.query(sql, function (error, results) {
        if (error) throw error;

        callback(results);
    })
}
//#endregion


//#region  超过多少用户
module.exports.beyondNum = (score, callback) => {
    let sql = `
    select count(*) sum from sw_score;
    select count(*) over from sw_score where score < ${parseInt(score)};`;
    pool.query(sql, function (error, results) {
        if (error) throw error;
        callback(results);
    })
}
//#endregion