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
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver(stageWidth, stageHeight, score) {
        var _this = _super.call(this) || this;
        _this.openShareFlag = true;
        _this.width = stageWidth;
        _this.height = stageHeight;
        _this.score = score;
        // 创建游戏场景
        _this.createGameScene(score);
        platform.beyondHowMany(score).then(function (result) {
            var sum = JSON.parse(result).data.sum;
            var over = JSON.parse(result).data.over;
            _this.beyondText.text = "\u8D85\u8FC7\u4E86" + ((over / sum) * 100).toFixed(1) + "%\u7684\u73A9\u5BB6";
            _this.beyond = ((over / sum) * 100).toFixed(1);
            _this.ShareBtn.touchEnabled = true;
        });
        return _this;
    }
    ;
    GameOver.prototype.createGameScene = function (playerScore) {
        var _this = this;
        var bg = new createBitmapByName().get('gameOverBg_png');
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        bg = null;
        var bigCup = new createBitmapByName().get("bigcup_png");
        bigCup.x = this.width / 2 - bigCup.width / 2 + 16;
        bigCup.y = 80;
        this.addChild(bigCup);
        bigCup = null;
        var Score = new egret.TextField();
        Score.text = "" + playerScore;
        Score.textColor = 0x9a88f7;
        Score.size = 50;
        Score.fontFamily = 'Tahoma';
        Score.bold = true;
        Score.textAlign = 'center';
        Score.y = 390;
        Score.x = this.width / 2 - Score.width / 2;
        this.addChild(Score);
        Score = null;
        var wenben = new egret.TextField();
        wenben.text = '最终得分';
        wenben.textColor = 0xc1b1f2;
        wenben.textAlign = 'center';
        wenben.size = 28;
        this.findCenter(wenben);
        wenben.y = 460;
        this.addChild(wenben);
        wenben = null;
        // 再玩一次按钮
        var playAgainBtn = new egret.Sprite();
        playAgainBtn.width = 195;
        playAgainBtn.height = 70;
        playAgainBtn.x = this.width / 2 - playAgainBtn.width / 2;
        playAgainBtn.y = this.height - 200;
        var playAgainBtnBg = new createBitmapByName().get('purple_png');
        playAgainBtnBg.scale9Grid = new egret.Rectangle(14, 16, 2, 1);
        playAgainBtnBg.width = 195;
        playAgainBtnBg.height = 70;
        playAgainBtn.addChild(playAgainBtnBg);
        playAgainBtnBg = null;
        playAgainBtn.touchEnabled = true;
        var playAgainText = new egret.TextField();
        playAgainText.text = '再玩一次';
        playAgainText.textColor = 0xffffff;
        playAgainText.width = 195;
        playAgainText.textAlign = 'center';
        playAgainText.y = 16;
        playAgainBtn.addChild(playAgainText);
        playAgainText = null;
        playAgainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playAgain, this);
        this.addChild(playAgainBtn);
        playAgainBtn = null;
        // 超越
        var beyond = new egret.DisplayObjectContainer();
        beyond.height = 90;
        beyond.width = 360;
        beyond.y = 500;
        beyond.x = this.width / 2 - beyond.width / 2;
        var upline = new createBitmapByName().get('line_png');
        beyond.addChild(upline);
        var downline = new createBitmapByName().get('line_png');
        downline.y = 88;
        beyond.addChild(downline);
        var beyondText = new egret.TextField();
        // beyondText.text = `超过了${((this.over/this.sum)*100).toFixed(1)}%的玩家`;
        beyondText.text = "";
        beyondText.width = 360;
        beyondText.textAlign = 'center';
        beyondText.textColor = 0xac9de7;
        beyondText.y = 30;
        beyondText.size = 30;
        this.beyondText = beyondText;
        beyond.addChild(this.beyondText);
        this.addChild(beyond);
        beyond = upline = downline = beyondText = null;
        // 查看排行榜
        var rankBtn = new egret.DisplayObjectContainer();
        rankBtn.width = 195;
        rankBtn.height = 70;
        rankBtn.touchEnabled = true;
        var rankBtnBg = new createBitmapByName().get('blue_png');
        rankBtnBg.scale9Grid = new egret.Rectangle(14, 16, 2, 1);
        rankBtnBg.width = 195;
        rankBtnBg.height = 70;
        rankBtn.addChild(rankBtnBg);
        var rankText = new egret.TextField();
        rankText.text = '查看排行榜';
        rankText.width = 195;
        rankText.y = 17;
        rankText.textColor = 0xffffff;
        rankText.textAlign = 'center';
        rankBtn.addChild(rankText);
        rankBtn.x = this.width / 2 - rankBtn.width / 2;
        rankBtn.y = 615;
        rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var ranks = new Ranking(_this.width, _this.height);
            _this.addChild(ranks);
            ranks = null;
        }, this);
        this.addChild(rankBtn);
        rankBtn = rankBtnBg = rankText = null;
        // 生成成绩单
        var shareBtn = new egret.DisplayObjectContainer();
        shareBtn.width = 195;
        shareBtn.height = 70;
        var shareBtnBg = new createBitmapByName().get('blue_png');
        shareBtnBg.scale9Grid = new egret.Rectangle(14, 16, 2, 1);
        shareBtnBg.width = 195;
        shareBtnBg.height = 70;
        shareBtn.addChild(shareBtnBg);
        var shareText = new egret.TextField();
        shareText.text = '生成成绩单';
        shareText.width = 195;
        shareText.y = 17;
        shareText.textColor = 0xffffff;
        shareText.textAlign = 'center';
        shareBtn.addChild(shareText);
        shareBtn.x = this.width / 2 - shareBtn.width / 2;
        shareBtn.y = 715;
        shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.openShareFlag) {
                _this.openShareFlag = false;
                var makeShare = new SharePage(_this.width, _this.height, _this.score, _this.beyond);
                _this.addChild(makeShare);
                _this.openShareFlag = true;
                makeShare = null;
            }
        }, this);
        this.ShareBtn = shareBtn;
        this.addChild(this.ShareBtn);
        shareBtn = shareBtnBg = shareText = null;
    };
    GameOver.prototype.playAgain = function () {
        var playGame = new PlayGame(this.width, this.height);
        this.parent.addChild(playGame);
        this.parent.removeChild(this);
        playGame = null;
    };
    // 中心位置
    GameOver.prototype.findCenter = function (which) {
        which.x = this.width / 2 - which.width / 2;
        which.y = this.height / 2 - which.height / 2;
    };
    return GameOver;
}(egret.DisplayObjectContainer));
__reflect(GameOver.prototype, "GameOver");
//# sourceMappingURL=GameOver.js.map