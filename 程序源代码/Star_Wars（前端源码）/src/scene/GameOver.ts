// 游戏结束场景
class GameOver extends egret.DisplayObjectContainer {
    // 需要舞台宽高 已经 玩家分数
    public constructor(stageWidth: number, stageHeight: number, score: number) {
        super();
        this.width = stageWidth;
        this.height = stageHeight;
        this.score = score;
        // 创建游戏场景
        this.createGameScene(score);
        // 显示本次得分超过 百分之多少 的玩家
        platform.beyondHowMany(score).then((result) => {
            let sum = JSON.parse(result).data.sum;
            let over = JSON.parse(result).data.over;
            this.beyondText.text = `超过了${((over / sum) * 100).toFixed(1)}%的玩家`;
            this.beyond = ((over / sum) * 100).toFixed(1);
            this.ShareBtn.touchEnabled = true;
        });
    };
    private beyond;
    private score: number;
    // 是否可以点击 生成成绩单 
    private openShareFlag: boolean = true;

    private createGameScene(playerScore: number) {
        let bg = new createBitmapByName().get('gameOverBg_png');
        bg.width = this.width;
        bg.height = this.height;
        this.addChild(bg);
        bg = null;

        // 奖杯
        let bigCup = new createBitmapByName().get("bigcup_png");
        bigCup.x = this.width / 2 - bigCup.width / 2 + 16;
        bigCup.y = 80;
        this.addChild(bigCup);
        bigCup = null;

        // 分数
        let Score = new egret.TextField();
        Score.text = `${playerScore}`;
        Score.textColor = 0x9a88f7;
        Score.size = 50;
        Score.fontFamily = 'Tahoma';
        Score.bold = true;
        Score.textAlign = 'center';
        Score.y = 390;
        Score.x = this.width / 2 - Score.width / 2;
        this.addChild(Score);
        Score = null;

        let wenben = new egret.TextField();
        wenben.text = '最终得分'
        wenben.textColor = 0xc1b1f2;
        wenben.textAlign = 'center';
        wenben.size = 28;
        this.findCenter(wenben);
        wenben.y = 460;
        this.addChild(wenben);
        wenben = null;

        // 再玩一次按钮
        let playAgainBtn = new egret.Sprite();
        playAgainBtn.width = 195;
        playAgainBtn.height = 70;
        playAgainBtn.x = this.width / 2 - playAgainBtn.width / 2;
        playAgainBtn.y = this.height - 200;
        let playAgainBtnBg = new createBitmapByName().get('purple_png');
        playAgainBtnBg.scale9Grid = new egret.Rectangle(14, 16, 2, 1);
        playAgainBtnBg.width = 195;
        playAgainBtnBg.height = 70;
        playAgainBtn.addChild(playAgainBtnBg);
        playAgainBtnBg = null;
        playAgainBtn.touchEnabled = true;
        let playAgainText = new egret.TextField();
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

        // 超越框
        let beyond = new egret.DisplayObjectContainer();
        beyond.height = 90;
        beyond.width = 360;
        beyond.y = 500;
        beyond.x = this.width / 2 - beyond.width / 2;
        let upline = new createBitmapByName().get('line_png');
        beyond.addChild(upline);
        let downline = new createBitmapByName().get('line_png');
        downline.y = 88;
        beyond.addChild(downline);
        let beyondText = new egret.TextField();
        // beyondText.text = `超过了${((this.over/this.sum)*100).toFixed(1)}%的玩家`;
        beyondText.text = ``;
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
        let rankBtn = new egret.DisplayObjectContainer();
        rankBtn.width = 195;
        rankBtn.height = 70;
        rankBtn.touchEnabled = true;
        let rankBtnBg = new createBitmapByName().get('blue_png');
        rankBtnBg.scale9Grid = new egret.Rectangle(14, 16, 2, 1);
        rankBtnBg.width = 195;
        rankBtnBg.height = 70;
        rankBtn.addChild(rankBtnBg);
        let rankText = new egret.TextField();
        rankText.text = '查看排行榜';
        rankText.width = 195;
        rankText.y = 17;
        rankText.textColor = 0xffffff;
        rankText.textAlign = 'center';
        rankBtn.addChild(rankText);
        rankBtn.x = this.width / 2 - rankBtn.width / 2;
        rankBtn.y = 615;
        rankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let ranks = new Ranking(this.width, this.height);
            this.addChild(ranks);
            ranks = null;
        }, this);
        this.addChild(rankBtn);
        rankBtn = rankBtnBg = rankText = null;

        // 生成成绩单
        let shareBtn = new egret.DisplayObjectContainer();
        shareBtn.width = 195;
        shareBtn.height = 70;
        let shareBtnBg = new createBitmapByName().get('blue_png');
        shareBtnBg.scale9Grid = new egret.Rectangle(14, 16, 2, 1);
        shareBtnBg.width = 195;
        shareBtnBg.height = 70;
        shareBtn.addChild(shareBtnBg);
        let shareText = new egret.TextField();
        shareText.text = '生成成绩单';
        shareText.width = 195;
        shareText.y = 17;
        shareText.textColor = 0xffffff;
        shareText.textAlign = 'center';
        shareBtn.addChild(shareText);
        shareBtn.x = this.width / 2 - shareBtn.width / 2;
        shareBtn.y = 715;
        shareBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.openShareFlag) {
                // 节流阀
                this.openShareFlag = false;
                // 生成成绩单
                let makeShare = new SharePage(this.width, this.height, this.score, this.beyond);
                this.addChild(makeShare);
                this.openShareFlag = true;
                makeShare = null;
            }
        }, this);
        this.ShareBtn = shareBtn;
        this.addChild(this.ShareBtn);
        shareBtn = shareBtnBg = shareText = null;
    }
    private ShareBtn: egret.DisplayObjectContainer;

    private beyondText: egret.TextField;

    // 再玩一次
    private playAgain() {
        let playGame = new PlayGame(this.width, this.height);
        this.parent.addChild(playGame);
        this.parent.removeChild(this);
        playGame = null;
    }

    // 中心位置
    private findCenter(which) {
        which.x = this.width / 2 - which.width / 2;
        which.y = this.height / 2 - which.height / 2;
    }
}