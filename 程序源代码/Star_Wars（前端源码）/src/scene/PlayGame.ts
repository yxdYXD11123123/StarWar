class PlayGame extends egret.DisplayObjectContainer {
    public constructor(stageWidth: number, stageHeight: number) {
        super();
        this.width = stageWidth;
        this.height = stageHeight;
        // 创建游戏场景
        this.createGameScene();
    }

    private addSound: egret.Sound = RES.getRes("add_mp3");
    private gameoverSound: egret.Sound = RES.getRes("gameover_mp3");
    private clickButtonSound: egret.Sound = RES.getRes("clickButton_mp3");
    private enableSound: boolean = false;

    private world: p2.World;
    private circleRing: egret.Bitmap;
    private playerPic: egret.Bitmap;

    private navBar: egret.Sprite;
    protected createUserInfo(): void {
        let nickname = new egret.TextField();
        let avatar = new egret.ImageLoader();
        // 用户信息
        if (window && window.PlayerInfo) {
            if (window.PlayerInfo.nickname) {
                nickname.text = window.PlayerInfo.nickname;
            }
            if (window.PlayerInfo.headimgurl) {
                egret.ImageLoader.crossOrigin = "anonymous";
                avatar.load(window.PlayerInfo.headimgurl);
                avatar.once(egret.Event.COMPLETE, (e: egret.Event) => {
                    let loader: egret.ImageLoader = e.currentTarget;
                    let bmd: egret.BitmapData = loader.data;
                    //创建纹理对象
                    let texture = new egret.Texture();
                    texture.bitmapData = bmd;
                    let bmp: egret.Bitmap = new egret.Bitmap(texture);
                    this.navBar.addChild(bmp);
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
    }

    private createGameScene() {
        // 声明一个背景图片，值为资源中的bg_png图 （调用下面的createBitmapByName函数）
        let bg = new createBitmapByName().get("bg_png");
        this.addChild(bg);
        let stageW = this.width;
        let stageH = this.height;
        bg.width = stageW;
        bg.height = stageH;
        bg = null;

        // 声明世界
        let world = new p2.World({
            gravity: [0, 0]
        });
        // 物理界硬度
        world.defaultContactMaterial.stiffness = 1000000;
        world.defaultContactMaterial.restitution = 1.00044;


        // 上左右 三个边框图
        let leftWall = new createBitmapByName().get('wall_png');
        leftWall.width = this.height;
        leftWall.height = 28;
        leftWall.x = 28;
        leftWall.rotation = 90.2;
        let rightWall = new createBitmapByName().get('wall_png');
        rightWall.width = this.height;
        rightWall.height = 28;
        rightWall.x = this.width;
        rightWall.rotation = 89.8;

        // 创建  右上左 3边
        let upBorder = this.createPlane();
        upBorder.position = [0, 66];
        let leftBorder = this.createPlane();
        leftBorder.position = [28, 0];
        leftBorder.angle = Math.PI * 3 / 2;
        let rightBorder = this.createPlane();
        rightBorder.position = [this.width - 28, 0];
        rightBorder.angle = Math.PI * 1 / 2;
        world.addBody(upBorder);
        world.addBody(leftBorder);
        world.addBody(rightBorder);
        upBorder = leftBorder = rightBorder = null;

        // 玩家刚体
        let playerBody = new p2.Body({
            mass: 1,
            damping: 0,
            position: [this.width / 2, this.height - 200],
            fixedRotation: true
        });

        // 玩家图
        let playerPic = new createBitmapByName().get('player_png');
        playerPic.name = 'PLAYER';
        this.playerPic = playerPic;
        playerPic.width = playerPic.width / 2;
        playerPic.height = playerPic.height / 2;
        playerPic.anchorOffsetX = playerPic.width / 2;
        playerPic.anchorOffsetY = playerPic.height / 2;
        let circleShape = new p2.Circle({
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

        let circleRing: egret.Bitmap = new createBitmapByName().get('circle_png');
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
        }, 800)


        // 按钮上方渐变图 以及 刚体
        let leftShadow = new createBitmapByName().get('light_png');
        leftShadow.width = this.width / 2 - 5;
        leftShadow.x = 5;
        leftShadow.y = this.height - 200;
        leftShadow.alpha = 0;
        leftShadow.name = 'leftShadow';

        let rightShadow = new createBitmapByName().get('light_png');
        rightShadow.width = this.width / 2 - 5;
        rightShadow.x = this.width / 2;
        rightShadow.y = this.height - 200;
        rightShadow.alpha = 0;
        rightShadow.name = 'rightShadow';

        // 光线的刚体
        let leftShadowBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [leftShadow.width / 2, leftShadow.y + leftShadow.height / 2],
            collisionResponse: false
        })
        let leftShadowShape = new p2.Box({
            width: leftShadow.width,
            height: leftShadow.height - 9
        })
        leftShadowBody.addShape(leftShadowShape);
        world.addBody(leftShadowBody);

        let rightShadowBody = new p2.Body({
            type: p2.Body.STATIC,
            position: [this.width / 2 + rightShadow.width / 2, leftShadow.y + leftShadow.height / 2],
            collisionResponse: false
        });
        let rightShadowShape = new p2.Box({
            width: rightShadow.width,
            height: rightShadow.height - 9
        });
        rightShadowBody.addShape(rightShadowShape);
        world.addBody(rightShadowBody);


        // 胶囊形状按钮 
        // 左
        let leftBtnPic = new createBitmapByName().get('button_png');
        leftBtnPic.x = 60;
        leftBtnPic.y = this.height - 140;
        leftBtnPic.touchEnabled = true;
        leftBtnPic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickLeftBtn, this);

        // 电脑端可以按 F J  方便测试
        document.addEventListener('keydown', e => {
            if (e.keyCode == 70) {
                this.clickLeftBtn();
            }
            if (e.keyCode == 74) {
                this.clickRightBtn();
            }
        })

        // 右
        let rightBtnPic = new createBitmapByName().get('button_png');
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

        // 开始时 添加多边形
        for (let i = 0; i < this.holdHowManyPolygon; i++) {
            this.addPolygon();
        }
        // 开始时 添加得分物体
        for (let i = 0; i < this.holdHowManyLogo; i++) {
            this.addHigherScoreLogo(this.getNewPosition());
        };

        // 玩家得分
        let playerScoreLabel: egret.TextField = new egret.TextField();
        playerScoreLabel.text = `得分 ${this.playerScore}`;
        playerScoreLabel.x = 262;
        playerScoreLabel.y = 22;
        playerScoreLabel.name = 'getScore';
        playerScoreLabel.size = 25;
        this.playerScoreLabel = playerScoreLabel;

        // 顶部玩家信息
        let navBar = new egret.Sprite();
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
        } else {
            this.stopBgMusic();
        }

        if (!egret.localStorage.getItem('isAlreadyKnow')) {
            egret.localStorage.setItem('isAlreadyKnow', '0');
        }

        // 打开说明
        let explainOpen = new egret.TextField();
        explainOpen.text = `说明`;
        explainOpen.x = this.width - 149;
        explainOpen.y = 22;
        explainOpen.textColor = 0x5785f8;
        explainOpen.size = 27;
        explainOpen.touchEnabled = true;
        explainOpen.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.addChild(this.explains);
        }, this);
        navBar.addChild(explainOpen);

        this.addChild(navBar);

        // 游戏说明
        let explains = new egret.Sprite();
        explains.width = this.width;
        explains.height = this.height - 74;
        explains.y = 64;
        explains.touchEnabled = true;

        let explainsMask = new egret.Sprite();
        explainsMask.width = this.width;
        explainsMask.height = this.height - 74;
        explainsMask.graphics.beginFill(0x000000, 1);
        explainsMask.graphics.drawRect(0, 0, this.width, this.height - 74);
        explainsMask.graphics.endFill();
        explainsMask.alpha = 0.5;
        explains.addChild(explainsMask);
        explainsMask = null;

        let explainsFrame = new createBitmapByName().get('rect_png');
        explainsFrame.scale9Grid = new egret.Rectangle(30, 30, 9, 3);
        explainsFrame.width = 450;
        explainsFrame.height = 600;
        explainsFrame.x = this.width / 2 - explainsFrame.width / 2;
        explainsFrame.y = 160;
        explains.addChild(explainsFrame);
        explainsFrame = null;

        // 说明文字
        let explainsContent = new egret.DisplayObjectContainer();
        explains.addChild(explainsContent);
        explainsContent.width = 450;
        explainsContent.height = 600;
        explainsContent.x = this.width / 2 - explainsContent.width / 2;
        explainsContent.y = 160;
        let explainsTitle = new egret.TextField();
        explainsContent.addChild(explainsTitle);
        explainsTitle.text = '游戏说明';
        explainsTitle.size = 30;
        explainsTitle.textAlign = 'center';
        explainsTitle.y = 16;
        explainsTitle.width = 450;
        explainsTitle.height = 34;
        explainsTitle.textColor = 0x6392fc;
        explainsTitle = null;
        let explainsList1Title = new egret.TextField();
        explainsContent.addChild(explainsList1Title);
        explainsList1Title.text = '游戏背景';
        explainsList1Title.size = 27;
        explainsList1Title.x = 22;
        explainsList1Title.y = 58;
        explainsList1Title.width = 410;
        explainsList1Title.textColor = 0x6392fc;
        explainsList1Title = null;
        let explainsList1Txt = new egret.TextField();
        explainsContent.addChild(explainsList1Txt);
        explainsList1Txt.text = '一次星空疫情大爆发，朱望仔与大反派展开激战，你的任务就是帮助朱望仔！';
        explainsList1Txt.size = 24;
        explainsList1Txt.x = 22;
        explainsList1Txt.y = 102;
        explainsList1Txt.width = 410;
        explainsList1Txt.textColor = 0xC0C0C0;
        explainsList1Txt.lineSpacing = 10;
        explainsList1Txt = null;
        let explainsLine = new createBitmapByName().get('line_png');
        explainsContent.addChild(explainsLine);
        explainsLine.x = 20;
        explainsLine.y = 196;
        explainsLine.width = 410;
        explainsLine.height = 2;
        explainsLine = null;
        let explainsList2Title = new egret.TextField();
        explainsContent.addChild(explainsList2Title);
        explainsList2Title.text = '玩法说明';
        explainsList2Title.size = 27;
        explainsList2Title.x = 22;
        explainsList2Title.y = 236;
        explainsList2Title.width = 410;
        explainsList2Title.textColor = 0x6392fc;
        explainsList2Title = null;
        let explainsList2Txt1 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt1);
        explainsList2Txt1.text = `1.  通过点击朱望仔或者左右按钮启动游
     戏，每次下落时通过点击左右按钮，
     在蓝光区域就能帮助朱望仔回弹`;
        explainsList2Txt1.size = 22;
        explainsList2Txt1.x = 22;
        explainsList2Txt1.y = 280;
        explainsList2Txt1.width = 410;
        explainsList2Txt1.textColor = 0xbfd0fa;
        explainsList2Txt1.lineSpacing = 6;
        explainsList2Txt1 = null;
        let explainsList2Txt2 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt2);
        explainsList2Txt2.text = `2.  只有保护好朱望仔才能获得更多分数，
     如未能让朱望仔回弹，导致其下落超
     出，游戏结束`;
        explainsList2Txt2.size = 22;
        explainsList2Txt2.x = 22;
        explainsList2Txt2.y = 380;
        explainsList2Txt2.width = 410;
        explainsList2Txt2.textColor = 0xbfd0fa;
        explainsList2Txt2.lineSpacing = 6;
        explainsList2Txt2 = null;
        let explainsList2Txt3 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt3);
        explainsList2Txt3.text = `3.  消灭大反派+10分，碰撞logo+20分，
     口罩+30分`;
        explainsList2Txt3.size = 22;
        explainsList2Txt3.x = 22;
        explainsList2Txt3.y = 480;
        explainsList2Txt3.width = 410;
        explainsList2Txt3.textColor = 0xbfd0fa;
        explainsList2Txt3.lineSpacing = 6;
        explainsList2Txt3 = null;
        let explainsList2Txt4 = new egret.TextField();
        explainsContent.addChild(explainsList2Txt4);
        explainsContent = null;
        explainsList2Txt4.text = `4.  更多玩法请游戏体验哦~`;
        explainsList2Txt4.size = 22;
        explainsList2Txt4.x = 22;
        explainsList2Txt4.y = 550;
        explainsList2Txt4.width = 410;
        explainsList2Txt4.textColor = 0xbfd0fa;
        explainsList2Txt4.lineSpacing = 6;
        explainsList2Txt4 = null;
        // 关闭说明框按钮
        let explainsClose = new egret.DisplayObjectContainer();
        explainsClose.width = 195;
        explainsClose.height = 70;
        explainsClose.x = this.width / 2 - explainsClose.width / 2;
        explainsClose.y = 800;
        explainsClose.touchEnabled = true;
        explainsClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.removeChild(this.explains);
            // 在localStorage 中记录用户已经看过 游戏说明
            egret.localStorage.setItem('isAlreadyKnow', '1');
        }, this)
        let explainsCloseBg = new createBitmapByName().get('blue_png');
        explainsCloseBg.scale9Grid = new egret.Rectangle(14, 17, 2, 1);
        explainsCloseBg.width = explainsClose.width;
        explainsCloseBg.height = explainsClose.height;
        explainsClose.addChild(explainsCloseBg);
        explainsCloseBg = null;
        let explainsCloseText = new egret.TextField();
        explainsCloseText.text = '已知晓';
        explainsCloseText.textColor = 0xffffff;
        explainsCloseText.fontFamily = "FangSong";
        explainsCloseText.width = 195;
        explainsCloseText.textAlign = 'center';
        explainsCloseText.y = 18;
        explainsClose.addChild(explainsCloseText);
        explainsCloseText = null;
        // 将 已知晓 按钮 加入 说明中
        explains.addChild(explainsClose);
        explainsClose = null;

        this.explains = explains;
        explains = null;

        // 如果用户是第一进入游戏，会自动弹出 游戏说明
        if (egret.localStorage.getItem('isAlreadyKnow') == '0') {
            this.addChild(this.explains);
        }
        // 根据帧率刷新页面， 默认是每秒钟30下
        this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);

    };

    private voice;
    private bgMusic: egret.Sound;
    private explains: egret.Sprite;
    private playerScoreLabel: egret.TextField;

    // 玩家分数
    private playerScore: number = 0;

    // 颜色数组
    private colorArr = [0xFF69B4, 0xFF1493, 0xFFFAFA, 0x6495ED, 0xFFA500, 0xFF6347, 0x90EE90, 0x98FB98, 0x00FFFF];

    // 获取当前页面中所有多边形和  logo 等物体的坐标  ( 用来避免覆盖已有物体 )
    private getAllPositions() {
        let positionArr = [];
        this.world.bodies.forEach((v, i) => {
            if (v.displays) {
                // 获取所有多边形、大反派、口罩、新网LOGO、玩家的位置，存入数组
                if (v.displays[0].name == 'POLYGON' || v.displays[0].name == 'BATMAN' || v.displays[0].name == "MASK" || v.displays[0].name == 'LOGO' || v.displays[0].name == 'PLAYER') {
                    positionArr.push(v.position);
                }
            }
        })
        return positionArr;
    }

    // 随机位置区域的y轴最低线
    private positionLowest: number = 430;

    // 获取一个不会覆盖当前已有物体的position
    private getNewPosition() {
        let arr = this.getAllPositions();
        // 100 ~ this.width-100   区域的x轴范围
        let positionX = Math.ceil(Math.random() * (this.width - 200) + 100);
        // 100 - 600  区域的y轴范围
        let positionY = Math.ceil(Math.random() * this.positionLowest + 100);
        // 看看上面随机出的这个位置是不是和我们页面中已有物体的距离都大于 75，如果不是，那就是继续随机，直到随机出来为止
        while (!(arr.every((value, index, array) => Math.sqrt(Math.pow(value[0] - positionX, 2) + Math.pow(value[1] - positionY, 2)) > 75))) {
            // 如果范围不到，继续随机
            positionX = Math.ceil(Math.random() * (this.width - 200) + 100);
            positionY = Math.ceil(Math.random() * this.positionLowest + 100);
        };
        // 循环结束后，会得到一个不会覆盖已有物体的随机位置
        let position: [number] = [positionX, positionY];
        return position;
    }

    // 添加圆形  参数为：出现的位置、可撞击的次数
    private addCircle(position: [number], times: number) {
        let randomColorNum = Math.floor(Math.random() * 101);
        let randomColor = this.colorArr[randomColorNum % this.colorArr.length];
        let shp = new egret.Sprite();
        shp.name = 'POLYGON';
        shp.alpha = 0;
        egret.Tween.get(shp).to({
            alpha: 1
        }, 100);
        shp.graphics.lineStyle(4, randomColor);
        shp.graphics.endFill();
        shp.graphics.drawCircle(0, 0, 26)

        // 可撞击的次数
        let label: egret.TextField = new egret.TextField();
        label.text = `${times}`;
        shp['label'] = times;
        label.size = 26;
        label.textColor = randomColor;
        label.x = 0 - label.width / 2;
        label.y = 0 - label.height / 2 + 2;
        shp.addChild(label);
        this.addChild(shp);
        let polShape: p2.Shape = new p2.Circle({
            radius: 26
        });
        let polBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position
        });
        polBody.addShape(polShape);
        polBody.displays = [shp];
        this.world.addBody(polBody);
        randomColor = randomColorNum = shp = label = polShape = polBody = null;
    };

    // 添加三角形
    private addTriangle(position: [number], times: number) {
        let randomColorNum = Math.floor(Math.random() * 101);
        let randomColor = this.colorArr[randomColorNum % this.colorArr.length];
        let shp = new egret.Sprite();
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
        let label: egret.TextField = new egret.TextField();
        label.text = `${times}`;
        shp['label'] = times;
        label.size = 26;
        label.textColor = randomColor;
        label.x = position[0] - label.width / 2;
        label.y = position[1] - label.height / 2 + 2;

        this.addChild(shp);
        this.addChild(label)
        let points = [[-18, -38], [38, 18], [-18, 18]];
        let polShape: p2.Convex = new p2.Convex({
            vertices: points
        });
        let polBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position,
            angle: Math.floor(Math.random() * 361)
        });
        polBody.addShape(polShape);
        polBody.displays = [shp, label];
        this.world.addBody(polBody);
        randomColor = randomColorNum = shp = label = polShape = polBody = null;
    }

    // 添加正方形
    private addSquare(position: [number], times: number) {
        let randomColorNum = Math.floor(Math.random() * 101);
        let randomColor = this.colorArr[randomColorNum % this.colorArr.length];
        let shp = new egret.Sprite();
        shp.name = 'POLYGON';
        shp.alpha = 0;
        egret.Tween.get(shp).to({
            alpha: 1
        }, 100);
        shp.graphics.lineStyle(4, randomColor);
        shp.graphics.endFill();
        shp.graphics.drawRect(-23, -23, 46, 46);

        // 创建文本
        let label: egret.TextField = new egret.TextField();
        label.text = `${times}`;
        shp['label'] = times;
        label.size = 26;
        label.textColor = randomColor;
        label.x = 0 - label.width / 2;
        label.y = 0 - label.height / 2 + 2;
        shp.addChild(label);
        this.addChild(shp);
        let polShape: p2.Shape = new p2.Box({
            width: 46,
            height: 46
        });
        let polBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position
        });
        polBody.addShape(polShape);
        polBody.displays = [shp];
        this.world.addBody(polBody);
        randomColor = randomColorNum = shp = label = polShape = polBody = null;
    }

    // 添加 得分图标
    private addHigherScoreLogo(position: [number]) {
        // 概率：反派 > logo > 口罩  （分值越高的物体出现概率越小）
        let whichRandom = Math.floor(Math.random() * 100 + 1);
        let body = new p2.Body({
            type: p2.Body.STATIC,
            position,
            collisionResponse: false
        });
        let shp = new p2.Circle();
        body.addShape(shp);
        // 0放蝙蝠侠  1放logo  2放口罩
        if (whichRandom <= 50) {
            let batmanPic = new createBitmapByName().get('batman_png');
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
            }, 2000)
            egret.Tween.get(shp, { loop: true }).to({
                radius: 25,
            }, 2000).to({
                radius: 30,
            }, 2000)
        }
        else if (whichRandom <= 80) {
            let logoPic = new createBitmapByName().get('logo_png');
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
            }, 1800)
        }
        else {
            let maskPic = new createBitmapByName().get('mask_png');
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
            }, 1500)
            egret.Tween.get(shp, { loop: true }).to({
                radius: 25,
            }, 1500).to({
                radius: 30,
            }, 1500)
        }

        this.world.addBody(body);
    }

    // 点击左按钮
    private clickLeftBtn() {
        // 如果开启声音开关，点击按钮会产生音效
        if (this.enableSound) this.clickButtonSound.play(0, 1);
        // 开始监听 "朱望仔" 是否和左边光线碰撞
        this.addEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithLeftLight, this);
        // 使光线 淡入
        this.$children.forEach((v, i) => {
            if (v.name == 'leftShadow') {
                let shawdowTw = egret.Tween.get(v);
                shawdowTw.to({ alpha: 1 }, 100).to({ alpha: 0 }, 200).call(() => {
                    // 光线 淡出后， 取消  “朱望仔” 与 光线 的碰撞监听
                    this.removeEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithLeftLight, this);
                });
                return shawdowTw = null;
            }
        });
    };
    // 点击右按钮
    private clickRightBtn() {
        if (this.enableSound) this.clickButtonSound.play(0, 1);
        this.addEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithRightLight, this);

        this.$children.forEach((v, i) => {
            if (v.name == 'rightShadow') {
                let shawdowTw = egret.Tween.get(v);
                shawdowTw.to({ alpha: 1 }, 100).to({ alpha: 0 }, 200).call(() => {
                    this.removeEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithRightLight, this);
                });
                return shawdowTw = null;
            }
        });
    };

    // 游戏启动
    private isGameBegin: boolean = false;
    private gameBegin() {
        // console.log('游戏开始');
        this.world.gravity = [0, 0.1]; //修改重力
        this.playerRun();
        this.removeChild(this.circleRing);
        this.circleRing = null;
        this.isGameBegin = true;
        this.playerPic.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gameBegin, this);
        this.gameBegin = null;
        this.playerPic = null;
    }

    // 对 “朱望仔” 施加的力的大小
    private playerImpulse: number = 600;
    // 每次 对“朱望仔” 施加的力的递进值
    private playerImpulseMore: number = 12;

    // 是否允许给 “朱望仔” 回弹的力  （为了避免用户过度点击按钮）
    private enableAddRun: boolean = true;
    //  “朱望仔” 回弹次数
    private playerRunNum: number = 0;
    // 回弹 “朱望仔”
    private playerRun() {
        this.enableAddRun = false;
        this.addEventListener(egret.Event.ENTER_FRAME, this.listenPlayerPosition, this);
        // 将 “朱望仔” 速度清零
        this.world.bodies[3].velocity = [0, 0];
        // 根据勾股定理 直角三角形中30度的 对角边 是 斜边的 3/5
        let floatNum = this.playerImpulse * 3 / 5;
        // 先随机出一个y轴向上的力  （保证这个y轴力的大小与this.playerImpulse的大小 所以最后产生的回弹角度在 30° - 90°）
        let getUpRandom = Math.floor(Math.random() * (this.playerImpulse - floatNum)) + floatNum;
        // 再根据y轴向上的力，计算出一个x轴左右的力，保证这两个力合起来的向量 是我们 this.playerImpulse 的大小
        let getXRandom = Math.pow(Math.pow(this.playerImpulse, 2) - Math.pow(getUpRandom, 2), 1 / 2);
        // x轴的力，随机正负 -> 随机偏左偏右
        if (Math.floor(Math.random() * 101) % 2) getXRandom = -getXRandom;
        // 对 “朱望仔” 施加力
        this.world.bodies[3].applyImpulse([getXRandom, -getUpRandom], [0, 0]);
        // 准备下次的力，更大一些
        this.playerImpulse = this.playerImpulse + this.playerImpulseMore;
        // 取消  “朱望仔” 与 光线 的碰撞监听
        this.removeEventListener(egret.Event.ENTER_FRAME, this.isOverLapsWithLeftLight, this);
        // 回弹次数记录 +1
        this.playerRunNum++;
        getUpRandom = getXRandom = floatNum = null;
    }

    // 监听朱望仔受力后是否已经刚好离开光线区域，如果离开，开启 enableAddRun （为了避免用户过度点击按钮）
    private listenPlayerPosition() {
        if (this.world.bodies[3].position[1] < this.height - 260) {
            this.enableAddRun = true;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.listenPlayerPosition, this);
        }
    }

    // 检测左边按钮是否碰撞
    private isOverLapsWithLeftLight() {
        if (!this.isGameBegin) this.gameBegin();
        // 通过overlaps方法，判断 “朱望仔” 是否和光线有物体重叠
        if (this.world.bodies[3].overlaps(this.world.bodies[4]) && this.enableAddRun) {
            this.playerRun();
        }
    }

    // 检测右边按钮是否碰撞
    private isOverLapsWithRightLight() {
        if (!this.isGameBegin) this.gameBegin();
        if (this.world.bodies[3].overlaps(this.world.bodies[5]) && this.enableAddRun) {
            this.playerRun();
        }
    }

    // 多边形 开始放3个
    private holdHowManyPolygon = 3;
    // 得分物体 开始放4个
    private holdHowManyLogo = 4;

    // 添加一个多边形
    private addPolygon() {
        let random = Math.floor(Math.random() * 3);
        // 可碰撞的次数
        let randomcenterNum: number;
        // 根据游戏进程 选取随机范围
        if (this.playerRunNum <= 20) {
            randomcenterNum = Math.floor(Math.random() * 4 + 2) //2-5
        } else if (this.playerRunNum <= 40) {
            randomcenterNum = Math.floor(Math.random() * 5 + 3) //3-7
        } else if (this.playerRunNum <= 60) {
            randomcenterNum = Math.floor(Math.random() * 6 + 4) //4-9
        } else if (this.playerRunNum > 60) {
            randomcenterNum = Math.floor(Math.random() * 7 + 5) //5-11
        }
        // 随机多边形的其中一种
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
    }

    // 检测世界碰撞
    private beginContactEvent(e) {
        // 判断 bodyA,bodyB是否有 displays显示图片
        if (e.bodyA.displays && e.bodyB.displays) {
            // 检测这次碰撞中bodyA这一方是否为多边形
            if (e.bodyA.displays[0].name == 'POLYGON') {
                // 因为三角形的 图案和数字是displays中的，而正方形和圆形不是，所以分开处理
                if (e.bodyA.displays.length == 1) {
                    // 多边形中的 数字-1
                    e.bodyA.displays[0].$children[0].text = e.bodyA.displays[0].$children[0].text - 1;
                    // 如果数字是 从两位数 变成了一位数 ，需要调整一下数字位置，保证数字在多边形中居中
                    if (e.bodyA.displays[0].$children[0].text == 9) e.bodyA.displays[0].$children[0].x = e.bodyA.displays[0].$children[0].x + e.bodyA.displays[0].$children[0].width / 2;
                    // 如果游戏进入后期，没碰撞一次多边形加分多一分
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyA, 2);
                    } else {
                        this.addPoints(e.bodyA, 1);
                    }
                    // 如果多边形次数为0 移除多边形
                    if (parseInt(e.bodyA.displays[0].$children[0].text) == 0) {
                        this.removeChild(e.bodyA.displays[0]);
                        this.world.removeBody(e.bodyA);
                        // 移除后在添加一个多边形
                        this.addPolygon();
                    }
                }
                // 如果是三角形
                else {
                    e.bodyA.displays[1].text = e.bodyA.displays[1].text - 1;
                    if (e.bodyA.displays[1].text == 9) e.bodyA.displays[1].x = e.bodyA.displays[1].x + e.bodyA.displays[1].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyA, 2);
                    } else {
                        this.addPoints(e.bodyA, 1);
                    }
                    // 如果多边形次数为0 
                    if (parseInt(e.bodyA.displays[1].text) == 0) {
                        // 移除三角形
                        for (let i = 0; i < e.bodyA.displays.length; i++) {
                            this.removeChild(e.bodyA.displays[i]);
                        }
                        this.world.removeBody(e.bodyA);
                        this.addPolygon();
                    }
                }
            }
            // bodyB这一方为多边形  处理方式同上
            else if (e.bodyB.displays[0].name == 'POLYGON') {
                if (e.bodyB.displays.length == 1) {
                    e.bodyB.displays[0].$children[0].text = e.bodyB.displays[0].$children[0].text - 1;
                    if (e.bodyB.displays[0].$children[0].text == 9) e.bodyB.displays[0].$children[0].x = e.bodyB.displays[0].$children[0].x + e.bodyB.displays[0].$children[0].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyB, 2);
                    } else {
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
                    if (e.bodyB.displays[1].text == 9) e.bodyB.displays[1].x = e.bodyB.displays[1].x + e.bodyB.displays[1].width / 2;
                    if (this.playerRunNum >= 34 && this.playerScore >= 1500) {
                        this.addPoints(e.bodyB, 2);
                    } else {
                        this.addPoints(e.bodyB, 1);
                    }
                    if (parseInt(e.bodyB.displays[1].text) == 0) {
                        for (let i = 0; i < e.bodyB.displays.length; i++) {
                            this.removeChild(e.bodyB.displays[i]);
                        }
                        this.world.removeBody(e.bodyB);
                        this.addPolygon();
                    }
                }
            }
            // 如果参与碰撞的是 大反派
            else if (e.bodyA.displays[0].name == 'BATMAN' || e.bodyB.displays[0].name == 'BATMAN') {
                // 加分
                this.addPoints(e.bodyA.displays[0].name == 'BATMAN' ? e.bodyA : e.bodyB, 10);
                // 移除
                this.world.removeBody(e.bodyA.displays[0].name == 'BATMAN' ? e.bodyA : e.bodyB);
                this.removeChild((e.bodyA.displays[0].name == 'BATMAN' ? e.bodyA : e.bodyB).displays[0]);
                // 再添加一个得分物体
                this.addHigherScoreLogo(this.getNewPosition());
            } else if (e.bodyA.displays[0].name == 'LOGO' || e.bodyB.displays[0].name == 'LOGO') {
                this.addPoints(e.bodyA.displays[0].name == 'LOGO' ? e.bodyA : e.bodyB, 20);
                this.world.removeBody(e.bodyA.displays[0].name == 'LOGO' ? e.bodyA : e.bodyB);
                this.removeChild((e.bodyA.displays[0].name == 'LOGO' ? e.bodyA : e.bodyB).displays[0]);
                this.addHigherScoreLogo(this.getNewPosition());
            } else if (e.bodyA.displays[0].name == 'MASK' || e.bodyB.displays[0].name == 'MASK') {
                this.addPoints(e.bodyA.displays[0].name == 'MASK' ? e.bodyA : e.bodyB, 30);
                this.world.removeBody(e.bodyA.displays[0].name == 'MASK' ? e.bodyA : e.bodyB);
                this.removeChild((e.bodyA.displays[0].name == 'MASK' ? e.bodyA : e.bodyB).displays[0]);
                this.addHigherScoreLogo(this.getNewPosition());
            }
        }
    };

    // 加分效果
    private addPoints(target: p2.Body, point: number) {
        // 加分音效
        if (this.enableSound) this.addSound.play(0, 1);
        var label: egret.TextField = new egret.TextField();
        this.addChild(label);
        label.text = `+${point}`;
        label.size = 30;
        label.textAlign = egret.HorizontalAlign.CENTER;
        label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.x = target.position[0] - 30;
        label.y = target.position[1] - 40;
        label.textColor = 0xFFD700;
        label.alpha = 1;
        // 加分
        this.playerScore += point;
        // 加分动画
        egret.Tween.get(label).to({
            y: target.position[1] - 70,
        }, 200).wait(300).to({
            alpha: 0,
        }, 1500).call(() => {
            this.removeChild(label);
            label = null;
        })
    }

    // 根据帧率刷新页面， 默认是每秒钟30下
    private onUpdate() {
        this.playerScoreLabel.text = `得分 ${this.playerScore}`;
        // 游戏结束  “朱望仔” 超出页面最低位置
        if (this.world.bodies[3].position[1] > this.height + 60) {
            // 提交用户分数
            if (window.PlayerInfo && window.PlayerInfo.openid) {
                window.platform.postUserScore(this.playerScore);
            }
            // 进入游戏结束场景
            let aGameOver = new GameOver(this.width, this.height, this.playerScore);
            this.parent.addChild(aGameOver);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
            this.parent.removeChild(this);
            aGameOver = null;
            // 游戏结束音效
            if (this.enableSound) this.gameoverSound.play(0, 1);
            this.stopBgMusic();
            return console.log('游戏结束');
        };
        // 随着游戏进度，调整世界中物体数量、随机的物体出现区域等等
        if (this.playerRunNum >= 66) {
            this.holdHowManyLogo = 6;
            this.holdHowManyPolygon = 5;
            this.positionLowest = 380;
            this.dejustNum();
        } else if (this.playerRunNum >= 45) {
            this.holdHowManyLogo = 6;
            this.holdHowManyPolygon = 5;
            this.positionLowest = 405;
            this.dejustNum();
        } else if (this.playerRunNum >= 18) {
            this.holdHowManyLogo = 5;
            this.holdHowManyPolygon = 4;
            this.dejustNum();
        }
        // 递进难度  前期速度递增值大一点，越到后期，由于速度基数已经很快，所以递增值越小
        if (this.playerRunNum >= 68) {
            this.playerImpulseMore = 2;
        } else if (this.playerRunNum >= 25) {
            this.playerImpulseMore = 7;
        }

        // 让世界运算一下
        this.world.step(1 / 30);
        // 刷新世界中刚体的图片位置
        this.world.bodies.forEach((v) => {
            if (v.displays) {
                v.displays[0].x = v.position[0];
                v.displays[0].y = v.position[1];
                v.displays[0].rotation = v.angle * 180 / Math.PI;
            }
        })

    }

    // 调整世界中多边形以及得分物体的总数量
    private dejustNum() {
        let numPolygonCur = 0;
        let numHigherCur = 0;
        this.world.bodies.forEach((v, i) => {
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
            for (let i = 1; i <= this.holdHowManyPolygon - numPolygonCur; i++) {
                this.addPolygon();
            }
        };
        if (numHigherCur < this.holdHowManyLogo) {
            for (let i = 1; i <= this.holdHowManyLogo - numHigherCur; i++) {
                this.addHigherScoreLogo(this.getNewPosition());
            }
        }
    }

    // 创建世界的边界
    private createPlane() {
        var groundShape = new p2.Plane();
        var groundBody = new p2.Body({
            type: p2.Body.STATIC,
            damping: 1
        });
        groundBody.addShape(groundShape);
        return groundBody;
    }

    private soundChannel: egret.SoundChannel;
    // 记录播放音频的位置
    private soundPosition: number;

    // 播放背景音乐
    private playBgMusic() {
        let voiceOpen = new createBitmapByName().get('voice_open_png');
        this.voice.addChild(voiceOpen);
        voiceOpen = null;
        if (this.soundPosition) {
            this.soundChannel = this.bgMusic.play(this.soundPosition, 0);
        }
        else {
            this.soundChannel = this.bgMusic.play(0.8);
        }
        this.enableSound = true;
    }
    // 停止背景音乐
    private stopBgMusic() {
        if (this.soundChannel) {
            // 在执行停止前记录 position  播放位置
            this.voice.removeChildAt(1);
            this.soundPosition = this.soundChannel.position;
            this.soundChannel.stop();
            this.soundChannel = null;
            this.enableSound = false;
        }
    }

    // 播放音乐开关this
    private toggleSound() {
        if (this.soundChannel) {
            this.stopBgMusic();
            egret.localStorage.setItem('enableSound', '0');
        }
        else {
            this.playBgMusic();
            egret.localStorage.setItem('enableSound', '1');
        }
    }

}