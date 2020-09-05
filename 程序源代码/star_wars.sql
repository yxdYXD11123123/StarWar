
-- ----------------------------
-- 星空大作战 成绩表
-- ------
-- 表字段:
-- id(列id)  数字类型  主键  非空  自增长
-- score(得分成绩)  数字类型  非空  默认值为 0
-- create_time(创建时间)  日期类型  非空 
-- openid(用户登入辨识身份)  字符串类型  可以为空  默认为空
-- rank(成绩排名)  字符串类型  可以为空  默认为空
-- ------
-- collation字符集 utf8_general_ci utf8  _ci(表示大小写不敏感)
-- 主键使用BTREE索引
-- ----------------------------
DROP TABLE IF EXISTS `sw_score`;
-- 成绩表 建表语句
CREATE TABLE `sw_score`(
    `id` INT(30)  UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '列id',
    `score` INT(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '得分成绩',
    `create_time` DATETIME NOT NULL COMMENT '创建时间',
    `openid` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户openid(用户登入辨识身份)',
    `rank` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '成绩排名',
    PRIMARY KEY(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '星空大作战成绩表' ROW_FORMAT = Dynamic ;
-- 成绩表 添加案例
INSERT INTO `sw_score`(`score`,`create_time`,`openid`,`rank`) VALUES(738,'2020-07-11','oB4nYjnoHhuWrPVi2pYLuPjnCaU0','13');




-- ----------------------------
-- 星空大作战 微信用户数据表
-- ------
-- 表字段:
-- openid(用户登入辨识身份)  字符串类型  主键  非空
-- nickname(用户昵称)  字符串类型  可以为空  默认为空
-- sex(用户性别)  字符串类型  可以为空  默认为空
-- province(用户所在省份)  字符串类型  可以为空  默认为空
-- city(用户所在市区)  字符串类型  可以为空  默认为空
-- country(用户所在区)  字符串类型  可以为空  默认为空
-- headimgurl(用户头像)  字符串类型  可以为空  默认为空
-- createtime(用户信息获取时间)  日期类型  非空
-- updatetime(用户信息获取时间)  日期类型  非空
-- ------
-- collation字符集 utf8_general_ci utf8  _ci(表示大小写不敏感)
-- 主键使用BTREE索引
-- ----------------------------
DROP TABLE IF EXISTS `sw_wechat_userinfo`;
-- 微信用户数据表 建表语句
CREATE TABLE `sw_wechat_userinfo`(
    `openid` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户openid',
    `nickname` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
     `sex` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户性别',
     `province` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户所在省份',
     `city` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户所在市区',
     `country` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户所在区',
     `headimgurl` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像',
     `createtime` DATETIME NULL DEFAULT NULL COMMENT '用户信息获取时间',
     `updatetime` DATETIME NULL DEFAULT NULL COMMENT '用户信息更新时间',
     PRIMARY KEY (`openid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '微信相关用户信息' ROW_FORMAT = Dynamic ;
-- 微信用户数据表 添加案例
INSERT INTO `sw_wechat_userinfo`
    (`openid`,`nickname`,`sex`,`province`,`city`,`country`,`headimgurl`,`createtime`,`updatetime`)
    VALUES('oB4nYjnoHhuWrPVi2pYLuPjnCaU0','admin','男','XX省','XX市','XX区','/img/001.jpg','2020-07-11 00:00:00','2020-07-12 00:00:00');