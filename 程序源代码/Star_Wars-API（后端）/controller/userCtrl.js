//引入userModel 操作数据库的 方法
const {
    getScore,
    updateScore,
    addUser,
    findUserByOpenid,
    updateUser,
    beyondNum
} = require('../models/userModel');

//导出方法
//#region 获取前100名排行榜结果
module.exports.getRankingList = (req, res) => {
    //调用方法
    getScore(function (results) {
        //使数据扁平化
        results = results.flat();

        //发送数据
        res.send({
            code: 200,
            message: '排行榜获取成功',
            data: results
        })
    })
}
//#endregion


//#region 提交用户分数
module.exports.addScore = (req, res) => {
    //获取数据
    let {
        openid,
        score
    } = req.body;

    //判断openid是否为空
    if (!openid || !score) {
        res.send({
            code: 500,
            message: '数据获取为空'
        })
    };

    //调用方法（更新用户分数）
    updateScore(openid, score, function (results) {
        if (results.affectedRows == 1) {
            //发送数据
            res.send({
                code: 200,
                message: '用户成绩修改成功'
            })
        }
    })
}
//#endregion



//#region 提交用户信息
module.exports.subUserInfo = (req, res) => {
    //获取用户信息
    let { openid, nickname, sex, province, city, country, headimgurl, createtime } = req.body;

    //查询语句判断数据库中是否存在用户
    findUserByOpenid(openid, function (results) {
        let datetime = new Date().Format("yyyy-MM-dd hh:mm:ss");
        // 如果用户已经存在
        if (results.length != 0) {
            //创建user对象
            let user = {
                nickname: nickname,
                sex: sex,
                province: province,
                city: city,
                country: country,
                headimgurl: headimgurl,
                updatetime: datetime
            };
            //更新数据
            updateUser(openid, user, function (results) {
                if (results.affectedRows == 1) {
                    res.send({
                        code: 200,
                        message: '用户修改成功'
                    })
                }
            })
        }
        // 如果用户还没有
        else {
            //创建user对象
            let user = {
                openid: openid,
                nickname: nickname,
                sex: sex,
                province: province,
                city: city,
                country: country,
                headimgurl: headimgurl,
                createtime: datetime,
                updatetime: datetime
            };

            //添加数据
            addUser(user, function (results) {
                if (results.affectedRows == 1) {
                    res.send({
                        code: 200,
                        message: '用户添加成功'
                    })
                }
            })
        }
    })
}
//#endregion


//#region 超过多少用户
module.exports.beyondHowMany = (req, res) => {
    let score = parseInt(req.body.score);
    beyondNum(score, (results) => {
        res.send({
            code: 200,
            message: '超越成功',
            data: {
                sum: results[0][0].sum,
                over: results[1][0].over
            }
        })
    });
};
//#endregion