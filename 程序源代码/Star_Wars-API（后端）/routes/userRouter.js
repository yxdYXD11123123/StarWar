//引入express框架
const express = require('express');

//创建路由
const userRouter = express.Router();

//引入控制器方法
const { getRankingList , addScore , subUserInfo, beyondHowMany } = require('../controller/userCtrl');


//#region 获取前100名排行榜结果
userRouter.get('/get_ranking_list',getRankingList);
//#endregion

//#region 提交用户分数
userRouter.post('/add_score',addScore);
//#endregion

//#region 提交用户信息
userRouter.post('/add_userinfo',subUserInfo);
//#endregion

//#region 超越百分之多少的用户
userRouter.post('/beyond', beyondHowMany);
//#endregion


module.exports = userRouter;