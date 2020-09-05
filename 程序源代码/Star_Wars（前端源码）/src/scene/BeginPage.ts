class BeginPage extends egret.DisplayObjectContainer {
    // 获取舞台宽高
    public constructor(stageWidth: number, stageHeight: number) {
        super();
        this.width = stageWidth;
        this.height = stageHeight;
        this.createGameScene();
    }
    /**
     * 创建开始页
     * Create a game scene
     */
    // 背景音乐
    public bgMusic: egret.Sound;
    // 音乐按钮
    public voice: egret.DisplayObjectContainer;

    // 创建游戏场景
    private createGameScene() {
        // 提交用户信息
        platform.postUserInfo();
        // 背景
        let bg = new createBitmapByName().get("bg_png");
        this.addChild(bg);
        let stageW = this.width;
        let stageH = this.height;
        bg.width = stageW;
        bg.height = stageH;
        bg = null;

        // 星空大作战
        let gametitle = new createBitmapByName().get('star_fight_png');
        this.findCenter(gametitle);
        gametitle.y -= 80;
        gametitle.name = 'gametitle'


        // 朱望仔
        let pig = new createBitmapByName().get('pig_png');
        this.addChild(pig);
        this.findCenter(pig);
        pig.x -= 142;
        pig.y -= 346;
        let pigCurX = pig.x;
        let pigCurY = pig.y;
        pig.name = 'pig';

        // 蝙蝠侠
        let batman = new createBitmapByName().get('batman2_png');
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
        let batmanCurX = batman.x;
        let batmanCurY = batman.y;
        batman.name = 'batman'

        this.addChild(gametitle);
        gametitle = null;

        // 朱动画
        let pigTw = egret.Tween.get(pig, { loop: true });
        pigTw.to({ x: pigCurX + 4, y: pigCurY + 12, alpha: 0.6 }, 1000).to({ x: pigCurX, y: pigCurY, alpha: 1 }, 1000);
        pig = null;
        pigTw = null;

        // 蝙蝠侠动画
        let batmanTw = egret.Tween.get(batman, { loop: true }, egret.Ease.sineOut);
        batmanTw.to({ y: batmanCurY + 10, scaleX: 1.05, scaleY: 1.05, rotation: 6, alpha: 1 }, 1200)
            .to({ y: batmanCurY, scaleX: 0.95, scaleY: 0.95, rotation: -5, alpha: 0.75 }, 1200);
        batman = null;
        batmanTw = null;

        // 排行榜按钮
        let rank = new rankBtn();
        this.addChild(rank);
        rank.touchEnabled = true;
        rank.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let ranks = new Ranking(this.width, this.height);
            this.addChild(ranks);
            ranks = null;
        }, this)
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
        // 判断是否自动开启音乐
        if (!egret.localStorage.getItem('enableSound')) {
            egret.localStorage.setItem('enableSound', '0');
        }
        if (egret.localStorage.getItem('enableSound') == '1') {
            this.playBgMusic();
        } else {
            this.stopBgMusic();
        }

        // 加入说明和开始按钮
        let explainAndStart = new egret.DisplayObjectContainer();
        explainAndStart.name = 'explainAndStart'
        // 使其宽度等于手机屏幕宽度
        explainAndStart.width = this.width;
        explainAndStart.height = 85;
        // 距离底部15%
        explainAndStart.y = this.height - this.height * 0.15;
        // 规则说明按钮
        let explainBtn = new createBitmapByName().get('rules_btn_png');
        explainBtn.x = 80;
        explainBtn.touchEnabled = true;
        explainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickExplainRules, this);
        explainAndStart.addChild(explainBtn);
        explainBtn = null;

        // 开始游戏
        let startBtn = new createBitmapByName().get('startgame_png');
        startBtn.x = explainAndStart.width - startBtn.width - 80;
        startBtn.touchEnabled = true;
        startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickStart, this);
        explainAndStart.addChild(startBtn)
        startBtn = null;
        // this.explainAndStart = new buttons(this.width);
        this.addChild(explainAndStart);

        // 赞助商
        let logo = new createBitmapByName().get('logo3_png');
        logo.x = this.width / 2 - logo.width / 2;
        logo.y = this.height - 70;
        logo.name = 'logo';
        this.addChild(logo);
        logo = null;
    }

    // 中心位置
    private findCenter(which: egret.Bitmap) {
        which.x = this.width / 2 - which.width / 2;
        which.y = this.height / 2 - which.height / 2;
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
    }
    // 停止背景音乐
    private stopBgMusic() {
        if (this.soundChannel) {
            this.voice.removeChildAt(1);
            // 记录音乐播放位置
            this.soundPosition = this.soundChannel.position;
            this.soundChannel.stop();
            this.soundChannel = null;
        }
    }

    // 播放音乐开关this
    private toggleSound() {
        // 正在播放
        if (this.soundChannel) {
            this.stopBgMusic();
            egret.localStorage.setItem('enableSound', '0');
        }
        else {
            this.playBgMusic();
            egret.localStorage.setItem('enableSound', '1');
        }
    }

    // 当打开说明时，需要暂时隐藏的元素
    private hideChildrens = [];

    // 点击规则说明按钮
    private clickExplainRules() {
        let arr: Array<string> = ['pig', 'gametitle', 'rank', 'batman', 'explainAndStart', 'logo'];
        for (let i = 0; i < this.$children.length; i++) {
            if (arr.indexOf(this.$children[i].name) != -1) {
                this.hideChildrens.push(this.$children[i]);
                this.removeChild(this.$children[i]);
                i--;
            }
        }
        arr = null;

        // 说明和已知晓
        let explainsAndKnow = new egret.DisplayObjectContainer();
        explainsAndKnow.width = this.width;
        explainsAndKnow.height = 933;
        explainsAndKnow.y = 160;
        // 规则介绍说明
        let explains = new createBitmapByName().get('gameRules_png');
        explains.x = explainsAndKnow.width / 2 - explains.width / 2;
        explainsAndKnow.addChild(explains);
        explains = null;

        // 已知晓 按钮
        let knowBtn = new egret.Sprite();
        knowBtn.width = 195;
        knowBtn.height = 70;
        knowBtn.x = this.width / 2 - knowBtn.width / 2;
        knowBtn.y = 840;
        knowBtn.graphics.beginFill(0x4771f7);
        knowBtn.graphics.drawRect(0, 0, 195, 55);
        knowBtn.graphics.beginFill(0x1d44a7);
        knowBtn.graphics.drawRect(0, 55, 195, 15);

        // 已知晓文本
        let knowText = new egret.TextField();
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
    }

    // 关闭游戏说明框
    private closeExplainRules() {
        this.removeChildAt(2);
        this.hideChildrens.forEach((value, index) => {
            this.addChild(value);
        });
    }

    // 点击开始游戏
    private clickStart() {
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
        let playGame = new PlayGame(this.width, this.height);
        this.parent.addChild(playGame);
        this.parent.removeChild(this);
        playGame = null;
    }
}

// 排行榜按钮
class rankBtn extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.width = 146;
        this.height = 54;
        let yellowBtn = new createBitmapByName().get('yellow_png');
        let rect: egret.Rectangle = new egret.Rectangle(24, 10, 1, 5);
        yellowBtn.scale9Grid = rect;
        yellowBtn.width = this.width;

        yellowBtn.height = this.height;
        this.addChild(yellowBtn);
        yellowBtn = rect = null;

        // 字体
        let textfield = new egret.TextField();
        textfield.textColor = 0x9d4d00;
        textfield.width = this.width;
        textfield.height = this.height;
        textfield.textAlign = "center";
        textfield.text = "排行榜";
        textfield.size = 24;
        textfield.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(textfield);
        textfield = null;
    }

}


// 声音按钮
class voiceBtn extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.width = 56;
        this.height = 59;
        this.y = 95;
        let sound = new createBitmapByName().get('voice_png');
        this.addChild(sound);
        sound = null;
    }
}