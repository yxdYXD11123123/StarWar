class Ranking extends egret.DisplayObjectContainer {
    public constructor(stageWidth: number, stageHeight: number) {
        super();
        this.width = stageWidth;
        this.height = stageHeight;
        // 使其可触摸，才可以遮挡下层，防止误触
        this.touchEnabled = true;
        this.createGameScene();
    }

    private createGameScene() {
        // 背影
        let mask = new egret.Sprite();
        mask.width = this.width;
        mask.height = this.height;
        mask.graphics.beginFill(0x000000, 1);
        mask.graphics.drawRect(0, 0, this.width, this.height);
        mask.graphics.endFill();
        mask.alpha = 0.5;
        this.addChild(mask);
        mask = null;

        // 主体
        let body = new egret.DisplayObjectContainer();
        body.width = 540;
        body.height = 860;
        body.x = this.width / 2 - body.width / 2;
        body.y = 130;

        // 白色框
        let rectWh = new createBitmapByName().get('rectwh_png');
        rectWh.scale9Grid = new egret.Rectangle(10, 12, 1, 1);
        rectWh.width = body.width;
        rectWh.height = body.height;
        body.addChild(rectWh);
        rectWh = null;
        // 抬头
        let title = new egret.DisplayObjectContainer();
        title.height = 100;
        title.width = body.width;
        let cup = new createBitmapByName().get('cup_png');
        cup.x = body.width / 2 - cup.width / 2 - 110;
        cup.y = title.height / 2 - cup.height / 2;
        let titleText = new egret.TextField();
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
        let thead = new egret.Sprite();
        thead.graphics.beginFill(0xf1f1f3, 1);
        thead.graphics.drawRect(0, 0, body.width, 78);
        thead.graphics.endFill();
        thead.y = 100;

        let paihang = new egret.TextField();
        paihang.text = '排行';
        paihang.x = 60;
        this.theadText(paihang);
        let touxiang = new egret.TextField();
        touxiang.text = '头像';
        touxiang.x = 170;
        this.theadText(touxiang);
        let nicheng = new egret.TextField();
        nicheng.text = '昵称';
        nicheng.x = 325;
        this.theadText(nicheng);
        let chengji = new egret.TextField();
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
        let close = new createBitmapByName().get('close_png');
        close.x = body.x + body.width - close.width / 2;
        close.y = 111;
        close.touchEnabled = true;
        close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.removeChild(this);
        }, this);


        // 滚动视窗
        let scrollView = new egret.ScrollView();
        this.scrollView = scrollView;
        scrollView = null;
        this.scrollView.y = 176;
        this.body = body;
        this.addChild(this.body);
        body = null;
        this.addChild(close);
        close = null;

        // 排行榜内容
        let topRank = new egret.DisplayObjectContainer();
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
        platform.getRankResult().then((result) => {
            // 解析收到的JSON格式的数据
            let arr = JSON.parse(result).data;
            // 循环生成行，添加行
            for (let i = 0; i < arr.length; i++) {
                let hang = new egret.Sprite();
                hang.graphics.beginFill(0xffffff, 1);
                hang.graphics.drawRect(0, 0, this.body.width, 100);
                hang.graphics.endFill();
                hang.width = this.body.width;
                hang.height = 100;
                hang.y = i * 100;
                // 线
                let line = new egret.Sprite();
                line.graphics.beginFill(0xf2f2f2, 1);
                line.graphics.drawRect(0, 0, this.body.width, 2);
                line.graphics.endFill();
                line.y = 100 - 2;
                hang.addChild(line);
                line = null;
                // 头像
                var imgLoader: egret.ImageLoader = new egret.ImageLoader;
                egret.ImageLoader.crossOrigin = "anonymous";
                imgLoader.load(arr[i].headimgurl);
                imgLoader.once(egret.Event.COMPLETE, (evt: egret.Event) => {
                    let loader: egret.ImageLoader = evt.currentTarget;
                    let bmd: egret.BitmapData = loader.data;
                    //创建纹理对象
                    let texture = new egret.Texture();
                    texture.bitmapData = bmd;
                    let bmp: egret.Bitmap = new egret.Bitmap(texture);
                    bmp.width = 75;
                    bmp.height = 75;
                    this.findAnchorCenter(bmp);
                    bmp.y = 13;
                    bmp.x = 170;
                    // 这里的报错不用管，实际运行是正常的
                    this.$children[1].$children[3].$children[0].$children[i].addChild(bmp);
                }, this);
                imgLoader = null;
                // 判断是第几名
                if (i > 2) {
                    let num = new egret.TextField();
                    num.text = `${i + 1}`;
                    this.findAnchorCenter(num);
                    num.x = 60;
                    num.y = 35;
                    num.size = 32;
                    num.textColor = 0x000000;
                    hang.addChild(num);
                    num = null;
                }
                // 如果是前三名需要使用图片
                else {
                    let icon: egret.Bitmap;
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
                    this.findAnchorCenter(icon);
                    icon.x = 60;
                    icon.y = 26;
                    hang.addChild(icon);
                    icon = null;
                };
                // 昵称
                let nickname = new egret.TextField();
                nickname.text = arr[i].nickname;
                nickname.width = 160;
                nickname.height = 32;
                this.findAnchorCenter(nickname);
                nickname.x = 325;
                nickname.y = 36;
                nickname.textColor = 0x000000;
                nickname.textAlign = 'center';
                hang.addChild(nickname);
                nickname = null;

                // 分数
                let score = new egret.TextField();
                score.text = `${arr[i].score}分`;
                score.textColor = 0xce5818;
                score.size = 30;
                this.findAnchorCenter(score);
                score.y = 36;
                score.x = 465;
                hang.addChild(score);
                score = null;
                this.topRank.addChild(hang);
                hang = null;
            };

        });


    };

    private topRank: egret.DisplayObjectContainer;

    private body: egret.DisplayObjectContainer;

    private scrollView: egret.ScrollView;

    // 使物体的水平方向锚点居中
    private findAnchorCenter(which) {
        which.anchorOffsetX = which.width / 2;
    }

    // thead部分的字体设置
    private theadText(which: egret.TextField) {
        which.textColor = 0x797d85;
        which.size = 28;
        this.findAnchorCenter(which);
        which.y = 25;
    }
};