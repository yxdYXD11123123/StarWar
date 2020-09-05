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
var Ranking = (function (_super) {
    __extends(Ranking, _super);
    function Ranking(stageWidth, stageHeight) {
        var _this = _super.call(this) || this;
        _this.width = stageWidth;
        _this.height = stageHeight;
        _this.touchEnabled = true;
        _this.createGameScene();
        return _this;
    }
    Ranking.prototype.createGameScene = function () {
        var _this = this;
        // 背影
        var mask = new egret.Sprite();
        mask.width = this.width;
        mask.height = this.height;
        mask.graphics.beginFill(0x000000, 1);
        mask.graphics.drawRect(0, 0, this.width, this.height);
        mask.graphics.endFill();
        mask.alpha = 0.5;
        this.addChild(mask);
        mask = null;
        // 主体
        var body = new egret.DisplayObjectContainer();
        body.width = 540;
        body.height = 860;
        body.x = this.width / 2 - body.width / 2;
        body.y = 130;
        // 白色框
        var rectWh = new createBitmapByName().get('rectwh_png');
        rectWh.scale9Grid = new egret.Rectangle(10, 12, 1, 1);
        rectWh.width = body.width;
        rectWh.height = body.height;
        body.addChild(rectWh);
        rectWh = null;
        // 抬头
        var title = new egret.DisplayObjectContainer();
        title.height = 100;
        title.width = body.width;
        var cup = new createBitmapByName().get('cup_png');
        cup.x = body.width / 2 - cup.width / 2 - 110;
        cup.y = title.height / 2 - cup.height / 2;
        var titleText = new egret.TextField();
        titleText.text = '排行榜TOP100';
        titleText.textColor = 0x494b59;
        titleText.x = body.width / 2 - 80;
        titleText.size = 32;
        titleText.y = 40;
        title.addChild(titleText);
        title.addChild(cup);
        body.addChild(title);
        title = cup = titleText = null;
        // thead
        var thead = new egret.Sprite();
        thead.graphics.beginFill(0xf1f1f3, 1);
        thead.graphics.drawRect(0, 0, body.width, 78);
        thead.graphics.endFill();
        thead.y = 100;
        var paihang = new egret.TextField();
        paihang.text = '排行';
        paihang.x = 60;
        this.theadText(paihang);
        var touxiang = new egret.TextField();
        touxiang.text = '头像';
        touxiang.x = 170;
        this.theadText(touxiang);
        var nicheng = new egret.TextField();
        nicheng.text = '昵称';
        nicheng.x = 325;
        this.theadText(nicheng);
        var chengji = new egret.TextField();
        chengji.text = '成绩';
        chengji.x = 465;
        this.theadText(chengji);
        thead.addChild(chengji);
        thead.addChild(nicheng);
        thead.addChild(touxiang);
        thead.addChild(paihang);
        body.addChild(thead);
        thead = paihang = touxiang = nicheng = chengji = null;
        // 关闭按钮
        var close = new createBitmapByName().get('close_png');
        close.x = body.x + body.width - close.width / 2;
        close.y = 111;
        close.touchEnabled = true;
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.parent.removeChild(_this);
        }, this);
        // 滚动视窗
        var scrollView = new egret.ScrollView();
        this.scrollView = scrollView;
        scrollView = null;
        this.scrollView.y = 176;
        this.body = body;
        this.addChild(this.body);
        body = null;
        this.addChild(close);
        close = null;
        // 排行榜内容
        var topRank = new egret.DisplayObjectContainer();
        topRank.width = this.body.width;
        topRank.height = 10000;
        this.topRank = topRank;
        this.scrollView.bounces = true;
        this.scrollView.setContent(this.topRank);
        topRank = null;
        this.scrollView.width = this.body.width;
        this.scrollView.height = this.body.height - 184;
        this.body.addChild(this.scrollView);
        this.scrollView = null;
        // 获取排行榜数据
        platform.getRankResult().then(function (result) {
            var arr = JSON.parse(result).data;
            var _loop_1 = function (i) {
                var hang = new egret.Sprite();
                hang.graphics.beginFill(0xffffff, 1);
                hang.graphics.drawRect(0, 0, _this.body.width, 100);
                hang.graphics.endFill();
                hang.width = _this.body.width;
                hang.height = 100;
                hang.y = i * 100;
                // 线
                var line = new egret.Sprite();
                line.graphics.beginFill(0xf2f2f2, 1);
                line.graphics.drawRect(0, 0, _this.body.width, 2);
                line.graphics.endFill();
                line.y = 100 - 2;
                hang.addChild(line);
                line = null;
                // 头像
                imgLoader = new egret.ImageLoader;
                egret.ImageLoader.crossOrigin = "anonymous";
                imgLoader.load(arr[i].headimgurl);
                imgLoader.once(egret.Event.COMPLETE, function (evt) {
                    var loader = evt.currentTarget;
                    var bmd = loader.data;
                    //创建纹理对象
                    var texture = new egret.Texture();
                    texture.bitmapData = bmd;
                    var bmp = new egret.Bitmap(texture);
                    bmp.width = 75;
                    bmp.height = 75;
                    _this.findAnchorCenter(bmp);
                    bmp.y = 13;
                    bmp.x = 170;
                    _this.$children[1].$children[3].$children[0].$children[i].addChild(bmp);
                }, _this);
                imgLoader = null;
                // 排行
                if (i > 2) {
                    var num = new egret.TextField();
                    num.text = "" + (i + 1);
                    _this.findAnchorCenter(num);
                    num.x = 60;
                    num.y = 35;
                    num.size = 32;
                    num.textColor = 0x000000;
                    hang.addChild(num);
                    num = null;
                }
                else {
                    var icon = void 0;
                    switch (i) {
                        case 0:
                            icon = new createBitmapByName().get('1st_png');
                            break;
                        case 1:
                            icon = new createBitmapByName().get('2nd_png');
                            break;
                        case 2:
                            icon = new createBitmapByName().get('3rd_png');
                            break;
                    }
                    _this.findAnchorCenter(icon);
                    icon.x = 60;
                    icon.y = 26;
                    hang.addChild(icon);
                    icon = null;
                }
                ;
                // 昵称
                var nickname = new egret.TextField();
                nickname.text = arr[i].nickname;
                nickname.width = 160;
                nickname.height = 32;
                _this.findAnchorCenter(nickname);
                nickname.x = 325;
                nickname.y = 36;
                nickname.textColor = 0x000000;
                nickname.textAlign = 'center';
                hang.addChild(nickname);
                nickname = null;
                // 分数
                var score = new egret.TextField();
                score.text = arr[i].score + "\u5206";
                score.textColor = 0xce5818;
                score.size = 30;
                _this.findAnchorCenter(score);
                score.y = 36;
                score.x = 465;
                hang.addChild(score);
                score = null;
                _this.topRank.addChild(hang);
                hang = null;
            };
            var imgLoader;
            for (var i = 0; i < arr.length; i++) {
                _loop_1(i);
            }
            ;
        });
    };
    ;
    Ranking.prototype.findAnchorCenter = function (which) {
        which.anchorOffsetX = which.width / 2;
    };
    Ranking.prototype.theadText = function (which) {
        which.textColor = 0x797d85;
        which.size = 28;
        this.findAnchorCenter(which);
        which.y = 25;
    };
    return Ranking;
}(egret.DisplayObjectContainer));
__reflect(Ranking.prototype, "Ranking");
;
//# sourceMappingURL=Ranking.js.map