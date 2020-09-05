var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PlayGame = (function (_super) {
    __extends(PlayGame, _super);
    function PlayGame(stageWidth, stageHeight) {
        var _this = _super.call(this) || this;
        _this.addSound = RES.getRes("add_mp3");
        _this.gameoverSound = RES.getRes("gameover_mp3");
        _this.clickButtonSound = RES.getRes("clickButton_mp3");
        _this.enableSound = false;
        // 玩家分数
        _this.playerScore = 0;
        // 颜色数组
        _this.colorArr = [0xFF69B4, 0xFF1493, 0xFFFAFA, 0x6495ED, 0xFFA500, 0xFF6347, 0x90EE90, 0x98FB98, 0x00FFFF];
        // 物体出现区域的y轴最低线
        _this.positionLowest = 430;
        // 游戏启动
        _this.isGameBegin = false;
        _this.playerImpulse = 600;
        _this.playerImpulseMore = 12;
        // 碰撞后回弹
        _this.enableAddRun = true;
        _this.playerRunNum = 0;
        // 多边 始3
        _this.holdHowManyPolygon = 3;
        // [物] 始4
        _this.holdHowManyLogo = 4;
        _this.width = stageWidth;
        _this.height = stageHeight;
        // 创建游戏场景
        _this.createGameScene();
        return _this;
    }
    PlayGame.prototype.createUserInfo = function () {
        var _this = this;
        var nickname = new egret.TextField();
        var avatar = new egret.ImageLoader();
        // 用户信息
        if (window && window.PlayerInfo) {
            if (window.PlayerInfo.nickname) {
                nickname.text = window.PlayerInfo.nickname;
            }
            if (window.PlayerInfo.headimgurl) {
                egret.ImageLoader.crossOrigin = "anonymous";
                avatar.load(window.PlayerInfo.headimgurl);
                avatar.once(egret.Event.COMPLETE, function (e) {
                    var loader = e.currentTarget;
                    var bmd = loader.data;
                    //创建纹理对象
                    var texture = new egret.Texture();
                    texture.bitmapData = bmd;
                    var bmp = new egret.Bitmap(texture);
                    _this.navBar.addChild(bmp);
                    bmp.width = 40;
                    bmp.height = 40;
                    bmp.x = 40;
                    bmp.y = 13;
                }, this);
            }
        }
        nickname.width = 160;
        nickname.height = 24;
        nickname.x = 98;
        nickname.y = 24;
        nickname.size = 22;
        this.navBar.addChild(nickname);
    };
    PlayGame.prototype.createGameScene = function () {
        var _this = this;
        // 声明一个背景图片，值为资源中的bg_png图 （调用下面的createBitmapByName函数）
        var bg = new createBitmapByName().get("bg_png");
        this.addChild(bg);
        var stageW = this.width;
        var stageH = this.height;
        bg.width = stageW;
        bg.height = stageH;
        bg = null;
        // 声明世界
        var world = new p2.World({
            gravity: [0, 0]
        });
        // 物理界硬度
        world.defaultContactMaterial.stiffness = 1000000;
        world.defaultContactMaterial.restitution = 1.00044;
        // 上左右 三个边框图
        var leftWall = new createBitmapByName().get('wall_png');
        leftWall.width = this.height;
        leftWall.height = 28;
        leftWall.x = 28;
        leftWall.rotation = 90.2;
        var rightWall = new createBitmapByName().get('wall_png');
        rightWall.width = this.height;
        rightWall.height = 28;
        rightWall.x = this.width;
        rightWall.rotation = 89.8;
        // 创建  右上左 3边
        var upBorder = this.createPlane();
        upBorder.position = [0, 66];
        var leftBorder = this.createPlane();
        leftBorder.position = [28, 0];
        leftBorder.angle = Math.PI * 3 / 2;
        var rightBorder = this.createPlane();
        rightBorder.position = [this.width - 28, 0];
        rightBorder.angle = Math.PI * 1 / 2;
        world.addBody(upBorder);
        world.addBody(leftBorder);
        world.addBody(rightBorder);
        upBorder = leftBorder = rightBorder = null;
        // 玩家刚体
        var playerBody = new p2.Body({
            mass: 1,
            damping: 0,
            position: [this.width / 2, this.height - 200],
            fixedRotation: true
        });
        // 玩家图
        var playerPic = new createBitmapByName().get('player_png');
        playerPic.name = 'PLAYER';
        this.playerPic = playerPic;
        playerPic.width = playerPic.width / 2;
        playerPic.height = playerPic.height / 2;
        playerPic.anchorOffsetX = playerPic.width / 2;
        playerPic.anchorOffsetY = playerPic.height / 2;
        var circleShape = new p2.Circle({
            radius: 40
        });
        // 玩家：circleShape.material = mat;
        playerBody.addShape(circleShape);
        playerBody.displays = [playerPic];
        world.addBody(playerBody);
        playerBody = circleShape = null;
        // 点击启动
        playerPic.touchEnabled = true;
        playerPic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameBegin, this);
        var circleRing = new createBitmapByName().get('circle_png');
        this.circleRing = circleRing;
        this.addChild(circleRing);
        circleRing.anchorOffsetX = circleRing.width / 2;
        circleRing.anchorOffsetY = circleRing.height / 2;
        circleRing.x = this.width / 2 + 1;
        circleRing.y = this.height - 199;
        circleRing.scaleX = 0.4;
        circleRing.scaleY = 0.4;
        circleRing.alpha = 0.4;
        egret.Tween.get(circleRing, { loop: true }).to({
            scaleX: 1.8,
            scaleY: 1.8
        }, 800);
        // 按钮上方渐变图 以及 刚体
        var leftShadow = new createBitmapByName().get('light_png');
        leftShadow.width = this.width / 2 - 5;
        leftShadow.x = 5;
        leftShadow.y = this.height - 200;
        leftShadow.alpha = 0;
        leftShadow.name = 'leftShadow';
        var rightShadow = new createBitmapByName().get('light_png');
        rightShadow.width = this.width / 2 - 5;
        rightShadow.x = this.width / 2;
        rightShadow.y = this.height - 200;
        rightShadow.alpha = 0;
        rightShadow.name = 'rightShadow';
        var leftShadowBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [leftShadow.width / 2, leftShadow.y + leftShadow.height / 2],
            collisionResponse: false
        });
        var leftShadowShape = new p2.Box({
            width: leftShadow.width,
            height: leftShadow.height - 9
        });
        leftShadowBody.addShape(leftShadowShape);
        world.addBody(leftShadowBody);
        var rightShadowBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [this.width / 2 + rightShadow.width / 2, leftShadow.y + leftShadow.height / 2],
            collisionResponse: false
        });
        var rightShadowShape = new p2.Box({
            width: rightShadow.width,
            height: rightShadow.height - 9
        });
        rightShadowBody.addShape(rightShadowShape);
        world.addBody(rightShadowBody);
        // 胶囊按钮 左
        var leftBtnPic = new createBitmapByName().get('button_png');
        leftBtnPic.x = 60;
        leftBtnPic.y = this.height - 140;
        leftBtnPic.touchEnabled = true;
        leftBtnPic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickLeftBtn, this);
        document.addEventListener('keydown', function (e) {
            if (e.keyCode == 70) {
                _this.clickLeftBtn();
            }
            if (e.keyCode == 74) {
                _this.clickRightBtn();
            }
        });
        // 右
        var rightBtnPic = new createBitmapByName().get('button_png');
        rightBtnPic.x = this.width - rightBtnPic.width - 60;
        rightBtnPic.y = this.height - 140;
        rightBtnPic.touchEnabled = true;
        rightBtnPic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickRightBtn, this);
        // 监测世界中的碰撞事件
        world.on('beginContact', this.beginContactEvent, this);
        this.world = world;
        // 给舞台中添加显示体
        // 添加玩家图
        this.addChild(playerPic);
        playerPic = null;
        // 添加按钮图
        this.addChild(leftBtnPic);
        this.addChild(rightBtnPic);
        // 添加渐变光影
        this.addChild(leftShadow);
        this.addChild(rightShadow);
        this.addChild(leftWall);
        leftWall = null;
        this.addChild(rightWall);
        rightWall = null;
        // 开始时3
        for (var i = 0; i < this.holdHowManyPolygon; i++) {
            this.addPolygon();
        }
        // 开始时4
        for (var i = 0; i < this.holdHowManyLogo; i++) {
            this.addHigherScoreLogo(this.getNewPosition());
        }
        ;
        var playerScoreLabel = new egret.TextField();
        playerScoreLabel.text = "\u5F97\u5206 " + this.playerScore;
        playerScoreLabel.x = 262;
        playerScoreLabel.y = 22;
        playerScoreLabel.name = 'getScore';
        playerScoreLabel.size = 25;
        this.playerScoreLabel = playerScoreLabel;
        // 顶部玩家信息
        var navBar = new egret.Sprite();
        this.navBar = navBar;
        navBar.width = this.width;
        navBar.height = 66;
        navBar.graphics.beginFill(0x2c296e);
        navBar.graphics.drawRect(0, 0, this.width, 63);
        navBar.graphics.beginFill(0x524596);
        navBar.graphics.drawRect(0, 62, this.width, 3);
        this.createUserInfo(); //用户信息
        // 添加声音按钮
        this.voice = new voiceBtn();
        this.voice.touchEnabled = true;
        this.voice.x = this.width - this.voice.width - 16;
        this.voice.y = 7;
        this.voice.scaleX = 0.9;
        this.voice.scaleY = 0.86;
        navBar.addChild(this.voice);
        this.bgMusic = RES.getRes("bgm_mp3");
        this.voice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleSound, this);
        navBar.addChild(playerScoreLabel);
        playerScoreLabel = null;
        // 判断声音记录
        if (!egret.localStorage.getItem('enableSound')) {
            egret.localStorage.setItem('enableSound', '0');
        }
        if (egret.localStorage.getItem('enableSound') == '1') {
            this.playBgMusic();
        }
        else {
            this.stopBgMusic();
        }
        if (!egret.localStorage.getItem('isAlreadyKnow')) {
            egret.localStorage.setItem('isAlreadyKnow', '0');
        }
        // 打开说明
        var explainOpen = new egret.TextField();
        explainOpen.text = "\u8BF4\u660E";
        explainOpen.x = this.width - 149;
        explainOpen.y = 22;
        explainOpen.textColor = 0x5785f8;
        explainOpen.size = 27;
        explainOpen.touchEnabled = true;
        explainOpen.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.addChild(_this.explains);
        }, this);
        navBar.addChild(explainOpen);
        this.addChild(navBar);
        // 游戏说明
        var explains = new egret.Sprite();
        explains.width = this.width;
        explains.height = this.height - 74;
        explains.y = 64;
        explains.touchEnabled = true;
        var explainsMask = new egret.Sprite();
        explainsMask.width = this.width;
        explainsMask.height = this.height - 74;
        explainsMask.graphics.beginFill(0x000000, 1);
        explainsMask.graphics.drawRect(0, 0, this.width, this.height - 74);
        explainsMask.graphics.endFill();
        explainsMask.alpha = 0.5;
        explains.addChild(explainsMask);
        explainsMask = null;
        var explainsFrame = new createBitmapByName().get('rect_png');
        explainsFrame.scale9Grid = new egret.Rectangle(30, 30, 9, 3);
        explainsFrame.width = 450;
        explainsFrame.height = 600;
        explainsFrame.x = this.width / 2 - explainsFrame.width / 2;
        explainsFrame.y = 160;
        explains.addChild(explainsFrame);
        explainsFrame = null;
        // 说明文字
        var explainsContent = new egret.DisplayObjectContainer();
        explains.addChild(explainsContent);
        explainsContent.width = 450;
        explainsContent.height = 600;
        explainsContent.x = this.width / 2 - explainsContent.width / 2;
        explainsContent.y = 160;
        var explainsTitle = new egret.TextField();
        explainsContent.addChild(explainsTitle);
        explainsTitle.text = '游戏说明';
        explainsTitle.size = 30;
        explainsTitle.textAlign = 'center';
        explainsTitle.y = 16;
        explainsTitle.width = 450;
        explainsTitle.height = 34;
        explainsTitle.textColor = 0x6392fc;
        var explainsList1Title = new egret.TextField();
        explainsContent.addChild(explainsList1Title);
        explainsList1Title.text = '游戏背景';
        explainsList1Title.size = 27;
        explainsList1Title.x = 22;
        explainsList1Title.y = 58;
        explainsList1Title.width = 410;
        explainsList1Title.textColor = 0x6392fc;
        var explainsList1Txt = new egret.TextField();
        explainsContent.addChild(explainsList1Txt);
        explainsList1Txt.text = '一次星空疫情大爆发，朱望仔与大反派展开激战，你的任务就是帮助朱望仔！';
        explainsList1Txt.size = 24;
        explainsList1Txt.x = 22;
        explainsList1Txt.y = 102;
        explainsList1Txt.width = 410;
        explainsList1Txt.textColor = 0xC0C0C0;
        explainsList1Txt.lineSpacing = 10;
        var explainsLine = new createBitmapByName().get('line_png');
        explainsContent.addChild(explainsLine);
        explainsLine.x = 20;
        explainsLine.y = 196;
        explainsLine.width = 410;
        explainsLine.height = 2;
        var explainsList2Title = new egret.TextField();
        explainsContent.addChild(explainsList2Title);
        explainsList2Title.text = '玩法说明';
        explainsList2Title.size = 27;
        explainsList2Title.x = 22;
        explainsList2Title.y = 236;
        explainsList2Title.width = 410;
        explainsList2Title.textColor = 0x6392fc;
        var explainsList2Txt1 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt1);
        explainsList2Txt1.text = "1.  \u901A\u8FC7\u70B9\u51FB\u6731\u671B\u4ED4\u6216\u8005\u5DE6\u53F3\u6309\u94AE\u542F\u52A8\u6E38\n     \u620F\uFF0C\u6BCF\u6B21\u4E0B\u843D\u65F6\u901A\u8FC7\u70B9\u51FB\u5DE6\u53F3\u6309\u94AE\uFF0C\n     \u5728\u84DD\u5149\u533A\u57DF\u5C31\u80FD\u5E2E\u52A9\u6731\u671B\u4ED4\u56DE\u5F39";
        explainsList2Txt1.size = 22;
        explainsList2Txt1.x = 22;
        explainsList2Txt1.y = 280;
        explainsList2Txt1.width = 410;
        explainsList2Txt1.textColor = 0xbfd0fa;
        explainsList2Txt1.lineSpacing = 6;
        var explainsList2Txt2 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt2);
        explainsList2Txt2.text = "2.  \u53EA\u6709\u4FDD\u62A4\u597D\u6731\u671B\u4ED4\u624D\u80FD\u83B7\u5F97\u66F4\u591A\u5206\u6570\uFF0C\n     \u5982\u672A\u80FD\u8BA9\u6731\u671B\u4ED4\u56DE\u5F39\uFF0C\u5BFC\u81F4\u5176\u4E0B\u843D\u8D85\n     \u51FA\uFF0C\u6E38\u620F\u7ED3\u675F";
        explainsList2Txt2.size = 22;
        explainsList2Txt2.x = 22;
        explainsList2Txt2.y = 380;
        explainsList2Txt2.width = 410;
        explainsList2Txt2.textColor = 0xbfd0fa;
        explainsList2Txt2.lineSpacing = 6;
        var explainsList2Txt3 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt3);
        explainsList2Txt3.text = "3.  \u6D88\u706D\u5927\u53CD\u6D3E+10\u5206\uFF0C\u78B0\u649Elogo+20\u5206\uFF0C\n     \u53E3\u7F69+30\u5206";
        explainsList2Txt3.size = 22;
        explainsList2Txt3.x = 22;
        explainsList2Txt3.y = 480;
        explainsList2Txt3.width = 410;
        explainsList2Txt3.textColor = 0xbfd0fa;
        explainsList2Txt3.lineSpacing = 6;
        var explainsList2Txt4 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt4);
        explainsList2Txt4.text = "4.  \u66F4\u591A\u73A9\u6CD5\u8BF7\u6E38\u620F\u4F53\u9A8C\u54E6~";
        explainsList2Txt4.size = 22;
        explainsList2Txt4.x = 22;
        explainsList2Txt4.y = 550;
        explainsList2Txt4.width = 410;
        explainsList2Txt4.textColor = 0xbfd0fa;
        explainsList2Txt4.lineSpacing = 6;
        var explainsClose = new egret.DisplayObjectContainer();
        explainsClose.width = 195;
        explainsClose.height = 70;
        explainsClose.x = this.width / 2 - explainsClose.width / 2;
        explainsClose.y = 800;
        explainsClose.touchEnabled = true;
        explainsClose.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.removeChild(_this.explains);
            egret.localStorage.setItem('isAlreadyKnow', '1');
        }, this);
        var explainsCloseBg = new createBitmapByName().get('blue_png');
        explainsCloseBg.scale9Grid = new egret.Rectangle(14, 17, 2, 1);
        explainsCloseBg.width = explainsClose.width;
        explainsCloseBg.height = explainsClose.height;
        explainsClose.addChild(explainsCloseBg);
        explainsCloseBg = null;
        var explainsCloseText = new egret.TextField();
        explainsCloseText.text = '已知晓';
        explainsCloseText.textColor = 0xffffff;
        explainsCloseText.fontFamily = "FangSong";
        explainsCloseText.width = 195;
        explainsCloseText.textAlign = 'center';
        explainsCloseText.y = 18;
        explainsClose.addChild(explainsCloseText);
        explainsCloseText = null;
        // 将知晓按钮加入 说明中
        explains.addChild(explainsClose);
        explainsClose = null;
        this.explains = explains;
        explains = null;
        if (egret.localStorage.getItem('isAlreadyKnow') == '0') {
            this.addChild(this.explains);
        }
        // 根据帧率刷新页面， 默认是每秒钟30下
        this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
    };
    ;
    // 获取当前页面中所有多边形和  logo 等物体的坐标  ( 用来避免物体覆盖 )
    PlayGame.prototype.getAllPositions = function () {
        var positionArr = [];
        this.world.bodies.forEach(function (v, i) {
            if (v.displays) {
                if (v.displays[0].name == 'POLYGON' || v.displays[0].name == 'BATMAN' || v.displays[0].name == "MASK" || v.displays[0].name == 'LOGO' || v.displays[0].name == 'PLAYER') {
                    positionArr.push(v.position);
                }
            }
        });
        return positionArr;
    };
    // 获取一个不会覆盖当前已有物体的position
    PlayGame.prototype.getNewPosition = function () {
        var arr = this.getAllPositions();
        // 100 ~ this.width-100
        var positionX = Math.ceil(Math.random() * (this.width - 200) + 100);
        // 100 - 600
        var positionY = Math.ceil(Math.random() * this.positionLowest + 100);
        // 看看上面随机出的这个位置是不是和我们页面中已有的物体距离都大于 75，如果不是，那就是继续随机，直到随机出来为止
        while (!(arr.every(function (value, index, array) { return Math.sqrt(Math.pow(value[0] - positionX, 2) + Math.pow(value[1] - positionY, 2)) > 75; }))) {
            // 如果范围不到，继续随机
            positionX = Math.ceil(Math.random() * (this.width - 200) + 100);
            positionY = Math.ceil(Math.random() * this.positionLowest + 100);
        }
        ;
        var position = [positionX, positionY];
        return position;
    };
    // 添加圆形
    PlayGame.prototype.addCircle = function (position, times) {
        var randomColorNum = Math.floor(Math.random() * 101);
        var randomColor = this.colorArr[randomColorNum % this.colorArr.length];
        var shp = new egret.Sprite();
        shp.name = 'POLYGON';
        shp.alpha = 0;
        egret.Tween.get(shp).to({
            alpha: 1
        }, 100);
        shp.graphics.lineStyle(4, randomColor);
        shp.graphics.endFill();
        shp.graphics.drawCircle(0, 0, 26);
        // 创建文本
        var label = new egret.TextField();
        label.text = "" + times;
        shp['label'] = times;
        label.size = 26;
        label.textColor = randomColor;
        label.x = 0 - label.width / 2;
        label.y = 0 - label.height / 2 + 2;
        shp.addChild(label);
        this.addChild(shp);
        var polShape = new p2.Circle({
            radius: 26
        });
        var polBody = new p2.Body({
            type: p2.Body.STATIC,
            position: position
        });
        polBody.addShape(polShape);
        polBody.displays = [shp];
        this.world.addBody(polBody);
        randomColor = randomColorNum = shp = label = polShape = polBody = null;
    };
    ;
    // 添加三角形
    PlayGame.prototype.addTriangle = function (position, times) {
        var randomColorNum = Math.floor(Math.random() * 101);
        var randomColor = this.colorArr[randomColorNum % this.colorArr.length];
        var shp = new egret.Sprite();
        shp.name = 'POLYGON';
        shp.alpha = 0;
        egret.Tween.get(shp).to({
            alpha: 1
        }, 100);
        shp.graphics.lineStyle(4, randomColor);
        shp.graphics.endFill();
        shp.graphics.moveTo(-18, -38);
        shp.graphics.lineTo(38, 18);
        shp.graphics.lineTo(-18, 18);
        shp.graphics.lineTo(-18, -38);
        // 创建文本
        var label = new egret.TextField();
        label.text = "" + times;
        shp['label'] = times;
        label.size = 26;
        label.textColor = randomColor;
        label.x = position[0] - label.width / 2;
        label.y = position[1] - label.height / 2 + 2;
        this.addChild(shp);
        this.addChild(label);
        var points = [[-18, -38], [38, 18], [-18, 18]];
        var polShape = new p2.Convex({
            vertices: points
        });
        var polBody = new p2.Body({
            type: p2.Body.STATIC,
            position: position,
            angle: Math.floor(Math.random() * 361)
        });
        polBody.addShape(polShape);
        polBody.displays = [shp, label];
        this.world.addBody(polBody);
        randomColor = randomColorNum = shp = label = polShape = polBody = null;
    };
    // 添加正方形
    PlayGame.prototype.addSquare = function (position, times) {
        var randomColorNum = Math.floor(Math.random() * 101);
        var randomColor = this.colorArr[randomColorNum % this.colorArr.length];
        var shp = new egret.Sprite();
        shp.name = 'POLYGON';
        shp.alpha = 0;
        egret.Tween.get(shp).to({
            alpha: 1
        }, 100);
        shp.graphics.lineStyle(4, randomColor);
        shp.graphics.endFill();
        shp.graphics.drawRect(-23, -23, 46, 46);
        // 创建文本
        var label = new egret.TextField();
        label.text = "" + times;
        shp['label'] = times;
        label.size = 26;
        label.textColor = randomColor;
        label.x = 0 - label.width / 2;
        label.y = 0 - label.height / 2 + 2;
        shp.addChild(label);
        this.addChild(shp);
        var polShape = new p2.Box({
            width: 46,
            height: 46
        });
        var polBody = new p2.Body({
            type: p2.Body.STATIC,
            position: position
        });
        polBody.addShape(polShape);
        polBody.displays = [shp];
        this.world.addBody(polBody);
        randomColor = randomColorNum = shp = label = polShape = polBody = null;
    };
    // 添加 得分图标
    PlayGame.prototype.addHigherScoreLogo = function (position) {
        // 概率：反派 > logo > 口罩
        var whichRandom = Math.floor(Math.random() * 100 + 1);
        var body = new p2.Body({
            type: p2.Body.STATIC,
            position: position,
            collisionResponse: false
        });
        var shp = new p2.Circle();
        body.addShape(shp);
        // 0放蝙蝠侠  1放logo  2放口罩
        if (whichRandom <= 50) {
            var batmanPic = new createBitmapByName().get('batman_png');
            batmanPic.scaleX = 0.5;
            batmanPic.scaleY = 0.5;
            batmanPic.anchorOffsetX = batmanPic.width / 2;
            batmanPic.anchorOffsetY = batmanPic.height / 2;
            batmanPic.name = 'BATMAN';
            shp.radius = 30;
            batmanPic.alpha = 0;
            egret.Tween.get(batmanPic).to({
                alpha: 1
            }, 200);
            body.displays = [batmanPic];
            this.addChild(batmanPic);
            egret.Tween.get(batmanPic, { loop: true }).to({
                scaleX: 0.45,
                scaleY: 0.45
            }, 2000).to({
                scaleX: 0.5,
                scaleY: 0.5
            }, 2000);
            egret.Tween.get(shp, { loop: true }).to({
                radius: 25,
            }, 2000).to({
                radius: 30,
            }, 2000);
        }
        else if (whichRandom <= 80) {
            var logoPic = new createBitmapByName().get('logo_png');
            logoPic.anchorOffsetX = logoPic.width / 2;
            logoPic.anchorOffsetY = logoPic.height / 2;
            logoPic.name = 'LOGO';
            logoPic.rotation = -10;
            logoPic.alpha = 0;
            egret.Tween.get(logoPic).to({
                alpha: 1
            }, 200);
            shp.radius = logoPic.width / 2;
            body.displays = [logoPic];
            this.addChild(logoPic);
            egret.Tween.get(logoPic, { loop: true }).to({
                rotation: 10
            }, 1800).to({
                rotation: -10,
            }, 1800);
        }
        else {
            var maskPic = new createBitmapByName().get('mask_png');
            maskPic.scaleX = 0.5;
            maskPic.scaleY = 0.5;
            maskPic.anchorOffsetX = maskPic.width / 2;
            maskPic.anchorOffsetY = maskPic.height / 2;
            maskPic.name = 'MASK';
            maskPic.alpha = 0;
            egret.Tween.get(maskPic).to({
                alpha: 1
            }, 200);
            shp.radius = 30;
            body.displays = [maskPic];
            this.addChild(maskPic);
            egret.Tween.get(maskPic, { loop: true }).to({
                scaleX: 0.44,
                scaleY: 0.44
            }, 1500).to({
                scaleX: 0.5,
                scaleY: 0.5
            }, 1500);
            egret.Tween.get(shp, { loop: true }).to({
                radius: 25,
            }, 1500).to({
                radius: 30,
            }, 1500);
        }
        this.world.addBody(body);
    };
    // 点击左按钮
    PlayGame.prototype.clickLeftBtn = function () {
        var _this = this;
        if (this.enableSound)
            this.clickButtonSound.play(0, 1);
        this.addEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithLeftLight, this);
        this.$children.forEach(function (v, i) {
            if (v.name == 'leftShadow') {
                var shawdowTw = egret.Tween.get(v);
                shawdowTw.to({ alpha: 1 }, 100).to({ alpha: 0 }, 200).call(function () {
                    _this.removeEventListener(egret.Event.ENTER_FRAME, _this.isOverLapsWithLeftLight, _this);
                });
                return shawdowTw = null;
            }
        });
    };
    ;
    // 点击右按钮
    PlayGame.prototype.clickRightBtn = function () {
        var _this = this;
        if (this.enableSound)
            this.clickButtonSound.play(0, 1);
        this.addEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithRightLight, this);
        this.$children.forEach(function (v, i) {
            if (v.name == 'rightShadow') {
                var shawdowTw = egret.Tween.get(v);
                shawdowTw.to({ alpha: 1 }, 100).to({ alpha: 0 }, 200).call(function () {
                    _this.removeEventListener(egret.Event.ENTER_FRAME, _this.isOverLapsWithRightLight, _this);
                });
                return shawdowTw = null;
            }
        });
    };
    ;
    PlayGame.prototype.gameBegin = function () {
        // console.log('游戏开始');
        this.world.gravity = [0, 0.1]; //修改重力
        this.playerRun();
        this.removeChild(this.circleRing);
        this.circleRing = null;
        this.isGameBegin = true;
        this.playerPic.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameBegin, this);
        this.gameBegin = null;
        this.playerPic = null;
    };
    PlayGame.prototype.playerRun = function () {
        this.enableAddRun = false;
        this.addEventListener(egret.Event.ENTER_FRAME, this.listenPlayerPosition, this);
        this.world.bodies[3].velocity = [0, 0];
        var floatNum = this.playerImpulse * 3 / 5;
        var getUpRandom = Math.floor(Math.random() * (this.playerImpulse - floatNum)) + floatNum;
        var getXRandom = Math.pow(Math.pow(this.playerImpulse, 2) - Math.pow(getUpRandom, 2), 1 / 2);
        if (Math.floor(Math.random() * 101) % 2)
            getXRandom = -getXRandom;
        this.world.bodies[3].applyImpulse([getXRandom, -getUpRandom], [0, 0]);
        this.playerImpulse = this.playerImpulse + this.playerImpulseMore;
        this.removeEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithLeftLight, this);
        this.playerRunNum++;
        getUpRandom = getXRandom = floatNum = null;
    };
    PlayGame.prototype.listenPlayerPosition = function () {
        if (this.world.bodies[3].position[1] < this.height - 260) {
            this.enableAddRun = true;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.listenPlayerPosition, this);
        }
    };
    // 检测左边按钮是否碰撞
    PlayGame.prototype.isOverLapsWithLeftLight = function () {
        if (!this.isGameBegin)
            this.gameBegin();
        if (this.world.bodies[3].overlaps(this.world.bodies[4]) && this.enableAddRun) {
            this.playerRun();
        }
    };
    // 检测右边按钮是否碰撞
    PlayGame.prototype.isOverLapsWithRightLight = function () {
        if (!this.isGameBegin)
            this.gameBegin();
        if (this.world.bodies[3].overlaps(this.world.bodies[5]) && this.enableAddRun) {
            this.playerRun();
        }
    };
    // 添加多边形
    PlayGame.prototype.addPolygon = function () {
        var random = Math.floor(Math.random() * 3);
        var randomcenterNum;
        if (this.playerRunNum <= 20) {
            randomcenterNum = Math.floor(Math.random() * 4 + 2); //2-5
        }
        else if (this.playerRunNum <= 40) {
            randomcenterNum = Math.floor(Math.random() * 5 + 3); //3-7
        }
        else if (this.playerRunNum <= 60) {
            randomcenterNum = Math.floor(Math.random() * 6 + 4); //4-9
        }
        else if (this.playerRunNum > 60) {
            randomcenterNum = Math.floor(Math.random() * 7 + 5); //5-11
        }
        switch (random) {
            case 0:
                this.addCircle(this.getNewPosition(), randomcenterNum);
                break;
            case 1:
                this.addSquare(this.getNewPosition(), randomcenterNum);
                break;
            case 2:
                this.addTriangle(this.getNewPosition(), randomcenterNum);
                break;
        }
        random = null;
    };
    // 检测世界碰撞
    PlayGame.prototype.beginContactEvent = function (e) {
        if (e.bodyA.displays && e.bodyB.displays) {
            // 检测是否有多边形发生碰撞
            if (e.bodyA.displays[0].name == 'POLYGON') {
                if (e.bodyA.displays.length == 1) {
                    e.bodyA.displays[0].$children[0].text = e.bodyA.displays[0].$children[0].text - 1;
                    if (e.bodyA.displays[0].$children[0].text == 9)
                        e.bodyA.displays[0].$children[0].x = e.bodyA.displays[0].$children[0].x + e.bodyA.displays[0].$children[0].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyA, 2);
                    }
                    else {
                        this.addPoints(e.bodyA, 1);
                    }
                    // 如果多边形次数为0 
                    if (parseInt(e.bodyA.displays[0].$children[0].text) == 0) {
                        this.removeChild(e.bodyA.displays[0]);
                        this.world.removeBody(e.bodyA);
                        this.addPolygon();
                    }
                }
                else {
                    e.bodyA.displays[1].text = e.bodyA.displays[1].text - 1;
                    if (e.bodyA.displays[1].text == 9)
                        e.bodyA.displays[1].x = e.bodyA.displays[1].x + e.bodyA.displays[1].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyA, 2);
                    }
                    else {
                        this.addPoints(e.bodyA, 1);
                    }
                    // 如果多边形次数为0 
                    if (parseInt(e.bodyA.displays[1].text) == 0) {
                        for (var i = 0; i < e.bodyA.displays.length; i++) {
                            this.removeChild(e.bodyA.displays[i]);
                        }
                        this.world.removeBody(e.bodyA);
                        this.addPolygon();
                    }
                }
            }
            else if (e.bodyB.displays[0].name == 'POLYGON') {
                if (e.bodyB.displays.length == 1) {
                    e.bodyB.displays[0].$children[0].text = e.bodyB.displays[0].$children[0].text - 1;
                    if (e.bodyB.displays[0].$children[0].text == 9)
                        e.bodyB.displays[0].$children[0].x = e.bodyB.displays[0].$children[0].x + e.bodyB.displays[0].$children[0].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyB, 2);
                    }
                    else {
                        this.addPoints(e.bodyB, 1);
                    }
                    if (parseInt(e.bodyB.displays[0].$children[0].text) == 0) {
                        this.removeChild(e.bodyB.displays[0]);
                        this.world.removeBody(e.bodyB);
                        this.addPolygon();
                    }
                }
                else {
                    e.bodyB.displays[1].text = e.bodyB.displays[1].text - 1;
                    if (e.bodyB.displays[1].text == 9)
                        e.bodyB.displays[1].x = e.bodyB.displays[1].x + e.bodyB.displays[1].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyB, 2);
                    }
                    else {
                        this.addPoints(e.bodyB, 1);
                    }
                    if (parseInt(e.bodyB.displays[1].text) == 0) {
                        for (var i = 0; i < e.bodyB.displays.length; i++) {
                            this.removeChild(e.bodyB.displays[i]);
                        }
                        this.world.removeBody(e.bodyB);
                        this.addPolygon();
                    }
                }
            }
            else if (e.bodyA.displays[0].name == 'BATMAN' || e.bodyB.displays[0].name == 'BATMAN') {
                this.addPoints(e.bodyA.displays[0].name == 'BATMAN' ? e.bodyA : e.bodyB, 10);
                this.world.removeBody(e.bodyA.displays[0].name == 'BATMAN' ? e.bodyA : e.bodyB);
                this.removeChild((e.bodyA.displays[0].name == 'BATMAN' ? e.bodyA : e.bodyB).displays[0]);
                this.addHigherScoreLogo(this.getNewPosition());
            }
            else if (e.bodyA.displays[0].name == 'LOGO' || e.bodyB.displays[0].name == 'LOGO') {
                this.addPoints(e.bodyA.displays[0].name == 'LOGO' ? e.bodyA : e.bodyB, 20);
                this.world.removeBody(e.bodyA.displays[0].name == 'LOGO' ? e.bodyA : e.bodyB);
                this.removeChild((e.bodyA.displays[0].name == 'LOGO' ? e.bodyA : e.bodyB).displays[0]);
                this.addHigherScoreLogo(this.getNewPosition());
            }
            else if (e.bodyA.displays[0].name == 'MASK' || e.bodyB.displays[0].name == 'MASK') {
                this.addPoints(e.bodyA.displays[0].name == 'MASK' ? e.bodyA : e.bodyB, 30);
                this.world.removeBody(e.bodyA.displays[0].name == 'MASK' ? e.bodyA : e.bodyB);
                this.removeChild((e.bodyA.displays[0].name == 'MASK' ? e.bodyA : e.bodyB).displays[0]);
                this.addHigherScoreLogo(this.getNewPosition());
            }
        }
    };
    ;
    // 加分效果
    PlayGame.prototype.addPoints = function (target, point) {
        var _this = this;
        if (this.enableSound)
            this.addSound.play(0, 1);
        var label = new egret.TextField();
        this.addChild(label);
        label.text = "+" + point;
        label.size = 30;
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.x = target.position[0] - 30;
        label.y = target.position[1] - 40;
        label.textColor = 0xFFD700;
        label.alpha = 1;
        this.playerScore += point;
        egret.Tween.get(label).to({
            y: target.position[1] - 70,
        }, 200).wait(300).to({
            alpha: 0,
        }, 1500).call(function () {
            _this.removeChild(label);
            label = null;
        });
    };
    // 根据帧率刷新页面， 默认是每秒钟30下
    PlayGame.prototype.onUpdate = function () {
        this.playerScoreLabel.text = "\u5F97\u5206 " + this.playerScore;
        // 游戏结束
        if (this.world.bodies[3].position[1] > this.height + 60) {
            if (window.PlayerInfo && window.PlayerInfo.openid) {
                window.platform.postUserScore(this.playerScore);
            }
            var aGameOver = new GameOver(this.width, this.height, this.playerScore);
            this.parent.addChild(aGameOver);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
            this.parent.removeChild(this);
            aGameOver = null;
            if (this.enableSound)
                this.gameoverSound.play(0, 1);
            this.stopBgMusic();
            return console.log('游戏结束');
        }
        ;
        // 世界中物体数量
        if (this.playerRunNum >= 66) {
            this.holdHowManyLogo = 6;
            this.holdHowManyPolygon = 5;
            this.positionLowest = 380;
            this.dejustNum();
        }
        else if (this.playerRunNum >= 45) {
            this.holdHowManyLogo = 6;
            this.holdHowManyPolygon = 5;
            this.positionLowest = 405;
            this.dejustNum();
        }
        else if (this.playerRunNum >= 18) {
            this.holdHowManyLogo = 5;
            this.holdHowManyPolygon = 4;
            this.dejustNum();
        }
        // 递进难度
        if (this.playerRunNum >= 68) {
            this.playerImpulseMore = 2;
        }
        else if (this.playerRunNum >= 25) {
            this.playerImpulseMore = 7;
        }
        // 让世界运算一下
        this.world.step(1 / 30);
        this.world.bodies.forEach(function (v) {
            if (v.displays) {
                v.displays[0].x = v.position[0];
                v.displays[0].y = v.position[1];
                v.displays[0].rotation = v.angle * 180 / Math.PI;
            }
        });
    };
    // 调整数量
    PlayGame.prototype.dejustNum = function () {
        var numPolygonCur = 0;
        var numHigherCur = 0;
        this.world.bodies.forEach(function (v, i) {
            if (v.displays) {
                if (v.displays[0].name == 'POLYGON') {
                    numPolygonCur += 1;
                }
                else if (v.displays[0].name == 'BATMAN' || v.displays[0].name == "MASK" || v.displays[0].name == 'LOGO') {
                    numHigherCur += 1;
                }
            }
        });
        if (numPolygonCur < this.holdHowManyPolygon) {
            for (var i = 1; i <= this.holdHowManyPolygon - numPolygonCur; i++) {
                this.addPolygon();
            }
        }
        ;
        if (numHigherCur < this.holdHowManyLogo) {
            for (var i = 1; i <= this.holdHowManyLogo - numHigherCur; i++) {
                this.addHigherScoreLogo(this.getNewPosition());
            }
        }
    };
    // 创建边界
    PlayGame.prototype.createPlane = function () {
        var groundShape = new p2.Plane();
        var groundBody = new p2.Body({
            type: p2.Body.STATIC,
            damping: 1
        });
        groundBody.addShape(groundShape);
        return groundBody;
    };
    // 播放背景音乐
    PlayGame.prototype.playBgMusic = function () {
        var voiceOpen = new createBitmapByName().get('voice_open_png');
        this.voice.addChild(voiceOpen);
        voiceOpen = null;
        if (this.soundPosition) {
            this.soundChannel = this.bgMusic.play(this.soundPosition, 0);
        }
        else {
            this.soundChannel = this.bgMusic.play(0.8);
        }
        this.enableSound = true;
    };
    // 停止背景音乐
    PlayGame.prototype.stopBgMusic = function () {
        if (this.soundChannel) {
            // 在执行停止前记录 position  播放位置
            this.voice.removeChildAt(1);
            this.soundPosition = this.soundChannel.position;
            this.soundChannel.stop();
            this.soundChannel = null;
            this.enableSound = false;
        }
    };
    // 播放音乐开关this
    PlayGame.prototype.toggleSound = function () {
        if (this.soundChannel) {
            this.stopBgMusic();
            egret.localStorage.setItem('enableSound', '0');
        }
        else {
            this.playBgMusic();
            egret.localStorage.setItem('enableSound', '1');
        }
    };
    return PlayGame;
}(egret.DisplayObjectContainer));
__reflect(PlayGame.prototype, "PlayGame");
//# sourceMappingURL=PlayGame.js.map