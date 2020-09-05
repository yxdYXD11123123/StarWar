var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var DebugPlatform = (function () {
    function DebugPlatform() {
        this.baseURL = "https://xwfintech.qingke.io/5f1e2e50b4ac2e002c1624cb/api";
    }
    DebugPlatform.prototype._request = function (url, requestWay, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, err) {
                        var request = new egret.HttpRequest();
                        request.responseType = egret.HttpResponseType.TEXT;
                        request.open(url, requestWay);
                        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        var params = '';
                        for (var key in data) {
                            params += key + "=" + data[key] + "&";
                        }
                        request.send(params);
                        request.addEventListener(egret.Event.COMPLETE, function (e) {
                            var request = e.currentTarget;
                            ok(request.response);
                        }, _this);
                        request.addEventListener(egret.IOErrorEvent.IO_ERROR, err, _this);
                        request.addEventListener(egret.ProgressEvent.PROGRESS, function (e) { }, _this);
                    })];
            });
        });
    };
    // 通过openid获取一个用户的最高成绩信息
    DebugPlatform.prototype.getScoreByOpenid = function () {
        return this._request(this.baseURL + "/user_score?openid=" + window.PlayerInfo.openid, egret.HttpMethod.GET);
    };
    // 获取前100名排行榜结果
    DebugPlatform.prototype.getRankResult = function () {
        return this._request(this.baseURL + "/get_ranking_list", egret.HttpMethod.GET);
    };
    // 提交用户分数
    DebugPlatform.prototype.postUserScore = function (score) {
        return this._request(this.baseURL + "/add_score", egret.HttpMethod.POST, {
            openid: window.PlayerInfo.openid,
            score: score,
        });
    };
    // 提交用户的信息 
    DebugPlatform.prototype.postUserInfo = function () {
        return this._request(this.baseURL + "/add_userinfo", egret.HttpMethod.POST, window.PlayerInfo);
    };
    // 超越
    DebugPlatform.prototype.beyondHowMany = function (score) {
        return this._request(this.baseURL + '/beyond', egret.HttpMethod.POST, {
            score: score
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
//# sourceMappingURL=Platform.js.map