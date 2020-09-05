//引入express 框架
const express = require('express');
const path = require('path');

//引入路由
const userinfo = require('./routes/userRouter');

//创建服务
const app = express();

//设置静态资源
app.use(express.static(path.join(__dirname, 'public')));

//设置中间键
app.use(express.urlencoded({ extend: false }));

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//挂载路由
app.use('/api', userinfo);

//监听指定端口 开启服务
app.listen(3000, () => {
    console.log('请打开 http://localhost:3000');
});