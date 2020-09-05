// 将index.html中的方法拿进来，方便在ts中调用
declare function alertImgShow();
declare function alertImgHide();

// 主类  继承 egret对象容器
class Main extends egret.DisplayObjectContainer {

    // 构造函数，当这个类被使用时，自动执行的函数
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        // 生命周期
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }
        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }
        this.runGame().catch(e => {
            console.log(e);
        })
    }


    // 运行游戏函数
    private async runGame() {
        // 加载资源
        await this.loadResource()
        // 进入开始页
        let beginG = new BeginPage(this.stage.stageWidth, this.stage.stageHeight);
        this.stage.addChild(beginG);
        beginG = null;
    }

    // 加载资源
    private async loadResource() {
        try {
            // 加载 资源的配置文件
            await RES.loadConfig("resource/default.res.json", "resource/");

            // 先加载加载页需要的素材
            await RES.loadGroup('loading')

            // 显示加载页面
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);

            // 加载默认的preload组的资源
            await RES.loadGroup("preload", 0, loadingView);

            // 移除加载页
            this.stage.removeChild(loadingView);

        }
        catch (e) {
            console.error(e);
        }
    }
}




// 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
class createBitmapByName {
    public get(name: string) {
        // new一个bitmap对象
        let result = new egret.Bitmap();
        // 获取图片资源，数据类型为texture （对不同平台不同图片资源的封装）
        let texture: egret.Texture = RES.getRes(name);
        // 存到 Bitmap 对象下面
        result.texture = texture;
        // 返回这个存好图片资源的 Bitmap 对象
        return result;
    }
}