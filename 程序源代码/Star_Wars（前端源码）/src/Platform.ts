/**
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
  getRankResult;
  postUserScore;
  postUserInfo;
  beyondHowMany;
}

class DebugPlatform implements Platform {
  public baseURL = "https://xwfintech.qingke.io/5f1e2e50b4ac2e002c1624cb/api";

  // 封装ajax请求，返回一个promise语法糖
  async _request(url, requestWay, data = {}) {
    return new Promise((ok, err) => {
      var request = new egret.HttpRequest();
      request.responseType = egret.HttpResponseType.TEXT;
      request.open(url, requestWay);
      request.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      let params = ''
      for (let key in data) {
        params += `${key}=${data[key]}&`
      }
      request.send(params);
      request.addEventListener(
        egret.Event.COMPLETE,
        (e) => {
          var request = e.currentTarget;
          ok(request.response);
        },
        this
      );
      request.addEventListener(egret.IOErrorEvent.IO_ERROR, err, this);
      request.addEventListener(egret.ProgressEvent.PROGRESS, (e) => { }, this);
    });
  }
  // 获取前100名排行榜结果
  getRankResult() {
    return this._request(
      this.baseURL + "/get_ranking_list",
      egret.HttpMethod.GET
    );
  }
  // 提交用户分数
  postUserScore(score) {
    return this._request(this.baseURL + "/add_score", egret.HttpMethod.POST, {
      openid: window.PlayerInfo.openid,
      score: score,
    });
  }
  // 提交用户的信息 
  postUserInfo() {
    return this._request(
      this.baseURL + "/add_userinfo",
      egret.HttpMethod.POST,
      window.PlayerInfo
    );
  }
  // 超越
  beyondHowMany(score) {
    return this._request(this.baseURL + '/beyond', egret.HttpMethod.POST, {
      score: score
    });
  }

}

if (!window.platform) {
  window.platform = new DebugPlatform();
}

declare let platform: Platform;

declare interface Window {
  platform: Platform;
  PlayerInfo: {
    city: "";
    country: "";
    headimgurl: "";
    language: "";
    nickname: "";
    openid: "";
    privilege: "";
    province: "";
    sex: 1;
    success: true;
  };
}
