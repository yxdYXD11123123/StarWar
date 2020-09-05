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
var BeginPage = (function (_super) {
    __extends(BeginPage, _super);
    function BeginPage(stageWidth, stageHeight) {
        var _this = _super.call(this) || this;
        _this.hideChildrens = [];
        _this.width = stageWidth;
        _this.height = stageHeight;
        _this.createGameScene();
        return _this;
    }
    BeginPage.prototype.createGameScene = function () {
        var _this = this;
        platform.postUserInfo();
        var bg = new createBitmapByName().get("bg_png");
        this.addChild(bg);
        var stageW = this.width;
        var stageH = this.height;
        bg.width = stageW;
        bg.height = stageH;
        bg = null;
        // 星空大作战
        var gametitle = new createBitmapByName().get('star_fight_png');
        this.findCenter(gametitle);
        gametitle.y -= 80;
        gametitle.name = 'gametitle';
        // 猪
        var pig = new createBitmapByName().get('pig_png');
        this.addChild(pig);
        this.findCenter(pig);
        pig.x -= 142;
        pig.y -= 346;
        var pigCurX = pig.x;
        var pigCurY = pig.y;
        pig.name = 'pig';
        // 蝙蝠侠
        var batman = new createBitmapByName().get('batman2_png');
        this.addChild(batman);
        this.findCenter(batman);
        batman.y += 65 + batman.height / 2;
        batman.x += 180 + batman.width / 2;
        batman.scaleX = 0.95;
        batman.scaleY = 0.95;
        batman.anchorOffsetX = batman.width / 2;
        batman.anchorOffsetY = batman.height / 2;
        batman.rotation = -5;
        batman.alpha = 0.75;
        var batmanCurX = batman.x;
        var batmanCurY = batman.y;
        batman.name = 'batman';
        this.addChild(gametitle);
        gametitle = null;
        // 朱动画
        var pigTw = egret.Tween.get(pig, { loop: true });
        pigTw.to({ x: pigCurX + 4, y: pigCurY + 12, alpha: 0.6 }, 1000).to({ x: pigCurX, y: pigCurY, alpha: 1 }, 1000);
        pig = null;
        pigTw = null;
        // 蝙蝠侠动画
        var batmanTw = egret.Tween.get(batman, { loop: true }, egret.Ease.sineOut);
        batmanTw.to({ y: batmanCurY + 10, scaleX: 1.05, scaleY: 1.05, rotation: 6, alpha: 1 }, 1200)
            .to({ y: batmanCurY, scaleX: 0.95, scaleY: 0.95, rotation: -5, alpha: 0.75 }, 1200);
        batman = null;
        batmanTw = null;
        // 排行榜按钮
        var rank = new rankBtn();
        this.addChild(rank);
        rank.touchEnabled = true;
        rank.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var ranks = new Ranking(_this.width, _this.height);
            _this.addChild(ranks);
        }, this);
        rank.x = 44;
        rank.y = 97;
        rank.name = 'rank';
        rank = null;
        // 声音开关
        this.voice = new voiceBtn();
        this.addChild(this.voice);
        this.voice.touchEnabled = true;
        this.voice.x = this.width - 120;
        this.bgMusic = RES.getRes("bgm_mp3");
        this.voice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toggleSound, this);
        if (!egret.localStorage.getItem('enableSound')) {
            egret.localStorage.setItem('enableSound', '0');
        }
        if (egret.localStorage.getItem('enableSound') == '1') {
            this.playBgMusic();
        }
        else {
            this.stopBgMusic();
        }
        // 加入说明和开始按钮
        var explainAndStart = new egret.DisplayObjectContainer();
        explainAndStart.name = 'explainAndStart';
        // 使其宽度等于手机屏幕宽度
        explainAndStart.width = this.width;
        explainAndStart.height = 85;
        // 距离底部15%
        explainAndStart.y = this.height - this.height * 0.15;
        // 规则说明按钮
        var explainBtn = new createBitmapByName().get('rules_btn_png');
        explainBtn.x = 80;
        explainBtn.touchEnabled = true;
        explainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickExplainRules, this);
        explainAndStart.addChild(explainBtn);
        explainBtn = null;
        // 开始游戏
        var startBtn = new createBitmapByName().get('startgame_png');
        startBtn.x = explainAndStart.width - startBtn.width - 80;
        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickStart, this);
        explainAndStart.addChild(startBtn);
        startBtn = null;
        // this.explainAndStart = new buttons(this.width);
        this.addChild(explainAndStart);
        // 赞助商
        var logo = new createBitmapByName().get('logo3_png');
        logo.x = this.width / 2 - logo.width / 2;
        logo.y = this.height - 70;
        logo.name = 'logo';
        this.addChild(logo);
        logo = null;
    };
    // 中心位置
    BeginPage.prototype.findCenter = function (which) {
        which.x = this.width / 2 - which.width / 2;
        which.y = this.height / 2 - which.height / 2;
    };
    // 播放背景音乐
    BeginPage.prototype.playBgMusic = function () {
        var voiceOpen = new createBitmapByName().get('voice_open_png');
        this.voice.addChild(voiceOpen);
        voiceOpen = null;
        if (this.soundPosition) {
            this.soundChannel = this.bgMusic.play(this.soundPosition, 0);
        }
        else {
            this.soundChannel = this.bgMusic.play(0.8);
        }
    };
    // 停止背景音乐
    BeginPage.prototype.stopBgMusic = function () {
        if (this.soundChannel) {
            this.voice.removeChildAt(1);
            this.soundPosition = this.soundChannel.position;
            this.soundChannel.stop();
            this.soundChannel = null;
        }
    };
    // 播放音乐开关this
    BeginPage.prototype.toggleSound = function () {
        // 正在播放
        if (this.soundChannel) {
            this.stopBgMusic();
            egret.localStorage.setItem('enableSound', '0');
        }
        else {
            this.playBgMusic();
            egret.localStorage.setItem('enableSound', '1');
        }
    };
    // 点击规则说明按钮
    BeginPage.prototype.clickExplainRules = function () {
        var arr = ['pig', 'gametitle', 'rank', 'batman', 'explainAndStart', 'logo'];
        for (var i = 0; i < this.$children.length; i++) {
            if (arr.indexOf(this.$children[i].name) != -1) {
                this.hideChildrens.push(this.$children[i]);
                this.removeChild(this.$children[i]);
                i--;
            }
        }
        arr = null;
        // 说明和已知晓
        var explainsAndKnow = new egret.DisplayObjectContainer();
        explainsAndKnow.width = this.width;
        explainsAndKnow.height = 933;
        explainsAndKnow.y = 160;
        // 规则介绍说明
        var explains = new createBitmapByName().get('gameRules_png');
        explains.x = explainsAndKnow.width / 2 - explains.width / 2;
        explainsAndKnow.addChild(explains);
        explains = null;
        // 已知晓 按钮
        var knowBtn = new egret.Sprite();
        knowBtn.width = 195;
        knowBtn.height = 70;
        knowBtn.x = this.width / 2 - knowBtn.width / 2;
        knowBtn.y = 840;
        knowBtn.graphics.beginFill(0x4771f7);
        knowBtn.graphics.drawRect(0, 0, 195, 55);
        knowBtn.graphics.beginFill(0x1d44a7);
        knowBtn.graphics.drawRect(0, 55, 195, 15);
        // 已知晓文本
        var knowText = new egret.TextField();
        knowText.text = '已知晓';
        knowText.textColor = 0xffffff;
        knowText.fontFamily = "KaiTi";
        knowText.width = 195;
        knowText.textAlign = 'center';
        knowText.y = 10;
        knowBtn.addChild(knowText);
        knowText = null;
        // 给 已知晓按钮 绑定点击事件
        knowBtn.touchEnabled = true;
        knowBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeExplainRules, this);
        explainsAndKnow.addChild(knowBtn);
        knowBtn = null;
        this.addChild(explainsAndKnow);
        explainsAndKnow = null;
    };
    BeginPage.prototype.closeExplainRules = function () {
        var _this = this;
        this.removeChildAt(2);
        this.hideChildrens.forEach(function (value, index) {
            _this.addChild(value);
        });
    };
    // 点击开始游戏
    BeginPage.prototype.clickStart = function () {
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
        var playGame = new PlayGame(this.width, this.height);
        this.parent.addChild(playGame);
        this.parent.removeChild(this);
        playGame = null;
    };
    BeginPage.prototype.onGetComplete = function (event) {
        var request = event.currentTarget;
        console.log("get data : ", request.response);
        var responseLabel = new egret.TextField();
        responseLabel.size = 18;
        responseLabel.text = "GET response: \n" + request.response.substring(0, 50) + "...";
        this.addChild(responseLabel);
        responseLabel.x = 50;
        responseLabel.y = 70;
    };
    BeginPage.prototype.onGetIOError = function (event) {
        console.log("get error : " + event);
    };
    BeginPage.prototype.onGetProgress = function (event) {
        console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    };
    return BeginPage;
}(egret.DisplayObjectContainer));
__reflect(BeginPage.prototype, "BeginPage");
// 排行榜按钮
var rankBtn = (function (_super) {
    __extends(rankBtn, _super);
    function rankBtn() {
        var _this = _super.call(this) || this;
        _this.width = 146;
        _this.height = 54;
        var yellowBtn = new createBitmapByName().get('yellow_png');
        var rect = new egret.Rectangle(24, 10, 1, 5);
        yellowBtn.scale9Grid = rect;
        yellowBtn.width = _this.width;
        yellowBtn.height = _this.height;
        _this.addChild(yellowBtn);
        yellowBtn = rect = null;
        // 字体
        var textfield = new egret.TextField();
        textfield.textColor = 0x9d4d00;
        textfield.width = _this.width;
        textfield.height = _this.height;
        textfield.textAlign = "center";
        textfield.text = "排行榜";
        textfield.size = 24;
        textfield.verticalAlign = egret.VerticalAlign.MIDDLE;
        // textfield.y =;
        _this.addChild(textfield);
        textfield = null;
        return _this;
    }
    return rankBtn;
}(egret.DisplayObjectContainer));
__reflect(rankBtn.prototype, "rankBtn");
// 声音按钮
var voiceBtn = (function (_super) {
    __extends(voiceBtn, _super);
    function voiceBtn() {
        var _this = _super.call(this) || this;
        _this.width = 56;
        _this.height = 59;
        _this.y = 95;
        var sound = new createBitmapByName().get('voice_png');
        _this.addChild(sound);
        sound = null;
        return _this;
    }
    return voiceBtn;
}(egret.DisplayObjectContainer));
__reflect(voiceBtn.prototype, "voiceBtn");
//# sourceMappingURL=BeginPage.js.map