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
var SharePage = (function (_super) {
    __extends(SharePage, _super);
    function SharePage(stageWidth, stageHeight, score, beyond) {
        var _this = _super.call(this) || this;
        _this.width = stageWidth;
        _this.height = stageHeight;
        _this.touchEnabled = true;
        // 创建游戏场景
        _this.createGameScene(score, beyond);
        return _this;
    }
    ;
    SharePage.prototype.createGameScene = function (score, beyond) {
        var _this = this;
        var bg = new createBitmapByName().get('gameOverBg_png');
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        bg = null;
        // 返回按钮
        var back = new egret.DisplayObjectContainer();
        back.width = 160;
        back.height = 70;
        back.x = this.width - back.width - 34;
        back.y = 50;
        back.touchEnabled = true;
        back.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            alertImgHide();
            _this.parent.removeChild(_this);
        }, this);
        var whiteBg = new createBitmapByName().get('rectwh_png');
        whiteBg.scale9Grid = new egret.Rectangle(10, 12, 1, 1);
        whiteBg.width = back.width;
        whiteBg.height = back.height;
        var blueBg = new createBitmapByName().get('blue2_png');
        blueBg.scale9Grid = new egret.Rectangle(14, 14, 2, 2);
        blueBg.width = back.width - 8;
        blueBg.height = back.height - 8;
        blueBg.x = 4;
        blueBg.y = 4;
        var backText = new egret.TextField();
        backText.text = '返回';
        backText.width = back.width;
        backText.textAlign = 'center';
        backText.size = 36;
        backText.y = 20;
        backText.textColor = 0xffffff;
        back.addChild(whiteBg);
        back.addChild(blueBg);
        back.addChild(backText);
        this.addChild(back);
        back = whiteBg = blueBg = backText = null;
        // 新网
        var xinwang = new createBitmapByName().get('logo2_png');
        xinwang.y = 100;
        xinwang.x = 30;
        this.addChild(xinwang);
        xinwang = null;
        // 星空
        var xinkong = new createBitmapByName().get('starWars_png');
        xinkong.y = 170;
        xinkong.x = -40;
        this.addChild(xinkong);
        xinkong = null;
        // 成绩表
        var results = new egret.DisplayObjectContainer();
        results.width = this.width - 160;
        results.height = 240;
        results.x = this.width / 2 - results.width / 2;
        results.y = 280;
        var resultsBg = new createBitmapByName().get('rect_png');
        resultsBg.scale9Grid = new egret.Rectangle(30, 30, 9, 3);
        resultsBg.width = results.width;
        resultsBg.height = results.height;
        results.addChild(resultsBg);
        var resultsName = new egret.TextField();
        resultsName.text = '姓名：';
        if (window && window.PlayerInfo) {
            if (window.PlayerInfo.nickname) {
                resultsName.text = "\u59D3\u540D\uFF1A" + window.PlayerInfo.nickname;
            }
        }
        ;
        resultsName.x = 34;
        resultsName.y = 40;
        resultsName.textColor = 0xad9fec;
        results.addChild(resultsName);
        var resultsScore = new egret.TextField();
        resultsScore.text = "\u6210\u7EE9\uFF1A" + score;
        resultsScore.x = 34;
        resultsScore.y = 100;
        resultsScore.textColor = 0xad9fec;
        results.addChild(resultsScore);
        var resultsBeyond = new egret.TextField();
        resultsBeyond.text = "\u8D85\u8FC7\u4E86" + beyond + "%\u7684\u73A9\u5BB6";
        resultsBeyond.x = 34;
        resultsBeyond.y = 160;
        resultsBeyond.textColor = 0xad9fec;
        results.addChild(resultsBeyond);
        this.addChild(results);
        results = resultsBeyond = resultsBg = resultsName = resultsScore = null;
        // 文本
        var lineOne = new egret.TextField();
        lineOne.text = '2020“创青春 交子杯”新网银行金融科技挑战赛';
        lineOne.textColor = 0xa691dc;
        lineOne.x = 30;
        lineOne.y = 580;
        this.addChild(lineOne);
        var lineTwo = new egret.TextField();
        lineTwo.text = '47万奖金池，最高10万奖金等你来拿！';
        lineTwo.textColor = 0xa691dc;
        lineTwo.x = 30;
        lineTwo.y = 630;
        this.addChild(lineTwo);
        var lineThree = new egret.TextField();
        lineThree.text = '是时候展示你真正的技术了！';
        lineThree.textColor = 0xa691dc;
        lineThree.x = 30;
        lineThree.y = 680;
        this.addChild(lineThree);
        lineOne = lineTwo = lineThree = null;
        // 二维码 （not need）
        // let focus = new createBitmapByName().get('qr_code_png');
        // focus.x = this.width/2 - focus.width/2;
        // focus.y = 760;
        // this.addChild(focus);
        alertImgShow();
    };
    return SharePage;
}(egret.DisplayObjectContainer));
__reflect(SharePage.prototype, "SharePage");
//# sourceMappingURL=SharePage.js.map