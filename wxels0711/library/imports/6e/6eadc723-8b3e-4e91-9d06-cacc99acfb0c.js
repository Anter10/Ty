"use strict";
cc._RF.push(module, '6eadccjiz5OkZ0GysyZrPsM', 'TuyooSDK');
// script/CommonFrame/TuyooSDK.js

"use strict";

/**
 * @author zhaoliang
 * @date 1.28
 *
 * 全局对象
 * 系统信息
 * 包括clientId，loginUrl等
 */
console.log("TuyooSDK loaded");
tywx.TuyooSDK = {
    SESSION_KEY: 'TU_SESSION_STORAGE',

    /***************************以下为登录相关接口*********************************/
    login: function login() {
        if (tywx.IsWechatPlatform()) {
            tywx.TuyooSDK.getSystemInfo();
            tywx.TuyooSDK.wechatLogin();
        } else {
            //其他平台,待添加
        }
    },

    // 微信登录
    wechatLogin: function wechatLogin() {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        if (!tywx.StateInfo.networkConnected) {
            console.log("net work ???");
            tywx.Timer.setTimer(cc.director, tywx.TuyooSDK.login, 3);
            return;
        }
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginStart, []);
        wx.login({
            success: function success(params) {
                console.log(null, 'wx login success, params:' + JSON.stringify(params));
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                if (params.code) {
                    var code = params.code;

                    if (tywx.WXUserInfo) {
                        tywx.TuyooSDK.loginTuyooWithCode(code, tywx.WXUserInfo);
                    } else {
                        try {
                            tywx.OpenDataContextUtil.getUserInfo(function (ret) {
                                console.log("ret-->" + ret);
                                tywx.WXUserInfo = ret[0];
                                tywx.TuyooSDK.loginTuyooWithCode(code, tywx.WXUserInfo);
                            }, function (ret) {
                                console.log(ret);
                                tywx.TuyooSDK.loginTuyooWithCode(code);
                            });
                        } catch (e) {
                            tywx.TuyooSDK.loginTuyooWithCode(code);
                        }
                    }
                    tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_SUCCESS, params);
                }
            },

            fail: function fail(params) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                console.log(null, 'wx login fail, params:' + JSON.stringify(params));
                tywx.NotificationCenter.trigger(tywx.EventType.WEIXIN_LOGIN_FAIL);
                tywx.Timer.setTimer(cc.director, tywx.TuyooSDK.login, 3);
            },

            complete: function complete(params) {}
        });
    },

    // 微信不需要重新授权，使用
    loginTuyooWith3rdSession: function loginTuyooWith3rdSession() {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        wx.getStorage({
            key: tywx.TuyooSDK.SESSION_KEY,
            success: function success(params) {
                if (!params.data) {
                    tywx.TuyooSDK.wechatLogin();
                    return;
                }
                // 微信授权成功后使用code登录途游服务器
                wx.request({
                    url: tywx.SystemInfo.loginUrl + 'open/v3/user/processSnsIdNew',
                    data: {
                        snsId: params.data,
                        deviceName: 'wechatGame',
                        clientId: tywx.SystemInfo.clientId,
                        appId: tywx.SystemInfo.appId
                    },

                    success: function success(params) {
                        console.log(null, 'tuyoo login success, params:' + JSON.stringify(params));
                    },

                    fail: function fail(params) {
                        console.log(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                    },

                    complete: function complete(params) {}
                });
            },
            fail: function fail(params) {
                tywx.TuyooSDK.wechatLogin();
            },
            complete: function complete(params) {}
        });
    },

    // 微信授权成功后，使用
    /* {
     "data": {
     "result": {
     "code": 0,
     "userId": 10116,
     "exception_report": 0,
     "userType": 4,
     "authInfo": "{\"authcode\": \"eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==\", \"account\": \"\", \"uid\": 10116, \"usercode\": \"\"}",
     "tcpsrv": {
     "ip": "192.168.10.88",
     "port": 8041
     },
     "isCreate": 1,
     "changePwdCount": 0,
     "360.vip": 0,
     "logclient": {
     "loguploadurl": "",
     "logreporturl": ""
     },
     "userPwd": "ty817142",
     "purl": "http://ddz.image.tuyoo.com/avatar/head_female_0.png",
     "snsId": "wxapp:071Nehqt0Z4XEe1jN6qt007Cqt0Nehqz",
     "userEmail": "",
     "connectTimeOut": 35,
     "appId": 9999,
     "heartBeat": 6,
     "userName": "来宾0074AibsT",
     "mobile": "",
     "token": "cce362d6-68a8-485e-b137-86ae6828e07a",
     "authorCode": "eyJ1aWQiOiAxMDExNiwgInVuYW1lIjogIlx1Njc2NVx1NWJiZTAwNzRBaWJzVCIsICJ1dG9rZW4iOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzEzMzgiLCAiY29pbiI6IDAsICJlbWFpbCI6ICIiLCAidXRpbWUiOiAiMjAxOC0wMS0yOSAxNDoxMzoxMi40NzA0NzEifQ==",
     "log_report": 0,
     "showAd": 1
     }
     },
     "header": {
     "Server": "nginx/1.4.1",
     "Date": "Mon, 29 Jan 2018 06:13:12 GMT",
     "Content-Type": "application/json;charset=UTF-8",
     "Transfer-Encoding": "chunked",
     "Connection": "keep-alive",
     "Content-Encoding": "gzip"
     },
     "statusCode": 200,
     "errMsg": "request:ok"
     }
     */
    loginTuyooWithCode: function loginTuyooWithCode(code, userInfo) {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        if (!tywx.StateInfo.networkConnected) {
            console.log("net work ???");
            tywx.Timer.cancelTimer(cc.director, tywx.TuyooSDK.login);
            tywx.Timer.setTimer(cc.director, tywx.TuyooSDK.login, 3);
            return;
        }
        // 微信授权成功后使用code登录途游服务器
        wx.showShareMenu({
            withShareTicket: true
        });

        //咱们后端 0 是男 1 是女,要转换
        var gender = 0;
        if (userInfo && userInfo.gender) {
            gender = userInfo.gender;
        }

        var local_uuid = tywx.Util.getLocalUUID();
        //! UUID保存
        tywx.SystemInfo.uuid = local_uuid;
        console.log("local_uuid:", local_uuid);
        var sdkPath = tywx.SystemInfo.loginUrl;
        var dataObj = {
            appId: tywx.SystemInfo.appId,
            wxAppId: tywx.SystemInfo.wxAppId,
            clientId: tywx.SystemInfo.clientId,
            snsId: 'wxapp:' + code,
            uuid: local_uuid,
            //以下为上传玩家的微信用户信息
            // nickName: userInfo.nickName,
            // avatarUrl: userInfo.avatarUrl,
            gender: gender,
            scene_id: tywx.UserInfo.scene_id || "",
            scene_param: tywx.UserInfo.scene_param || "",
            invite_id: tywx.UserInfo.invite_id || 0
        };
        var nickName = "";
        if (userInfo && userInfo.nickName) {
            dataObj.nikeName = userInfo.nickName;
            nickName = userInfo.nickName;
        }

        if (userInfo && userInfo.avatarUrl) {
            dataObj.avatarUrl = userInfo.avatarUrl;
        }
        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKStart, [code, local_uuid, nickName]);
        wx.request({
            url: sdkPath + 'open/v6/user/LoginBySnsIdNoVerify',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: dataObj,
            method: 'POST',

            success: function success(params) {
                console.log(null, 'tuyoo login success, params:' + JSON.stringify(params));
                var checkData = params.data;
                if (checkData.error && checkData.error.code == 1) {
                    console.log('tuyoo login fail...');
                    return;
                }
                // 保存用户名/用户ID/用户头像
                var result = checkData.result;
                tywx.UserInfo.userId = result.userId;
                tywx.UserInfo.userName = result.userName;
                tywx.UserInfo.userPic = result.purl;
                tywx.UserInfo.authorCode = result.authorCode;
                tywx.UserInfo.wxgame_session_key = result.wxgame_session_key;
                console.log(null, 'userId:' + tywx.UserInfo.userId + ' userName:' + tywx.UserInfo.userName + ' userPic:' + tywx.UserInfo.userPic);

                var token = result.token;
                console.log(null, 'token:' + token);
                wx.setStorage({
                    key: tywx.TuyooSDK.SESSION_KEY,
                    data: token
                });

                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [code, local_uuid, nickName, result.userId]);
                tywx.TuyooSDK.initWebSocketUrl(result);
                if (tywx.UserInfo.scene_id && tywx.showQuery && tywx.showQuery.sourceCode) {
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [tywx.UserInfo.scene_id, tywx.showQuery.inviteCode, tywx.showQuery.sourceCode, tywx.showQuery.imageType, "GameStart"]);
                }
                // 发送登录成功事件
                tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_SUCCESS);
            },

            fail: function fail(params) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeLoginSDKFailed, [code, local_uuid, nickName]);
                console.log(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                tywx.NotificationCenter.trigger(tywx.EventType.SDK_LOGIN_FAIL);
                tywx.TuyooSDK.loginTuyooWithCode(code, userInfo);
            },

            complete: function complete(params) {}
        });
    },

    /**
     * 使用sdk登陆返回信息解析得到服务器连接地址,对于单机游戏来说无效
     * @param loginResult
     */
    initWebSocketUrl: function initWebSocketUrl(loginResult) {
        tywx.TCPClient.reconnet();
    },

    getSystemInfo: function getSystemInfo() {
        // {
        // 	"0":{
        // 	"errMsg":"getSystemInfo:ok",
        // 		"model":"iPhone X",
        // 		"pixelRatio":3,
        // 		"windowWidth":375,
        // 		"windowHeight":812,
        // 		"system":"iOS 10.0.1",
        // 		"language":"zh_CN",
        // 		"version":"6.6.3",
        // 		"batteryLevel":100,
        // 		"screenWidth":375,
        // 		"screenHeight":812,
        // 		"SDKVersion":"1.8.0",
        // 		"brand":"devtools",
        // 		"fontSizeSetting":16,
        // 		"statusbarHeight":44,
        // 		"platform":"devtools"
        // }
        // }
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        wx.getSystemInfo({
            success: function success(result) {
                var model = result.model;
                var isiPhone = model.indexOf("iPhone") >= 0;
                var windowHeight = result.windowHeight;
                var resultType = 0;
                if (isiPhone) {
                    if (windowHeight == 812) {
                        //iPhoneX
                        resultType = 2;
                    } else if (windowHeight == 736) {
                        // 7p 8p
                        resultType = 4;
                    } else {
                        //其他iPhone
                        resultType = 1;
                    }
                } else {
                    //cc.sys.OS_ANDROID
                    resultType = 3;
                }
                tywx.UserInfo.systemType = resultType;
                tywx.UserInfo.wechatType = result.version;
                tywx.UserInfo.model = result.model;
                tywx.UserInfo.system = result.system;
            },
            fail: function fail() {},
            complete: function complete() {}
        });
    },

    wechatAuthorize: function wechatAuthorize() {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        wx.getSetting({
            success: function success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationStart, []);
                    wx.authorize({
                        scope: "scope.userInfo",
                        success: function success() {
                            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationSuccess, []);
                            tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_SUCCESS);
                        },
                        fail: function fail() {
                            tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeAuthorizationFailed, []);
                            tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_FAILED);
                        },
                        complete: function complete() {}
                    });
                } else {
                    tywx.NotificationCenter.trigger(tywx.EventType.START_AUTHORIZATION_SUCCESS);
                }
            }
        });
    },

    /***************************以下为支付相关接口*********************************/

    createOrder: function createOrder(id, prodPrice, name, prodCount) {
        /*
         params  id:商品ID,prodPrice:价格  单位元, name:商品名称
         prodCount:购买数量,默认为1
          prodId:商品ID, prodName:商品名称, prodCount:购买数量
         prodPrice:价格  单位元,
         chargeType:支付方式 wxapp.iap,
         gameId:子游戏id,
         appInfo:透传参数,
         mustcharge:是否支付 默认填 1
         */
        var data = {};
        data.prodId = id;
        data.prodPrice = prodPrice;
        data.chargeType = "wxapp.iap";
        data.gameId = tywx.SystemInfo.gameId;
        data.prodName = name;
        data.prodCount = prodCount;
        data.appInfo = {};
        tywx.TuyooSDK.rechargeOrder(data);
    },

    orderCallFunc: function orderCallFunc(url, platformOrderId, chargeCoin) {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        var local_uuid = tywx.Util.getLocalUUID();
        var _chargeCoin = chargeCoin;
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: tywx.UserInfo.userId,
                appId: tywx.SystemInfo.appId,
                wxAppId: tywx.SystemInfo.wxAppId,
                clientId: tywx.SystemInfo.clientId,
                imei: 'null',
                uuid: local_uuid,
                platformOrderId: platformOrderId
            },

            method: 'POST',

            success: function success(results) {
                var tips = "购买成功";
            },
            fail: function fail(params) {
                console.log(null, 'file = [Recharge] fun = [OrderCallFun] 充值失败 params = ' + JSON.stringify(params));
            },
            complete: function complete(params) {}
        });
    },

    /***************************获取道具配置相关接口*********************************/
    getStoreList: function getStoreList() {
        var url = tywx.SystemInfo.loginUrl + "api/hall5/store/list";
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {},
            method: 'POST',
            success: function success(params) {
                tywx.NotificationCenter.trigger(tywx.EventType.GET_STORE_LIST_SUCCESS, params);
            },
            fail: function fail(params) {
                tywx.NotificationCenter.trigger(tywx.EventType.GET_STORE_LIST_FAIL, params);
            },
            complete: function complete(params) {
                tywx.NotificationCenter.trigger(tywx.EventType.GET_STORE_LIST_FAIL, params);
            }
        });
    },

    /*
     params prodId:商品ID, prodName:商品名称, prodCount:购买数量
     prodPrice:价格  单位元,
     chargeType:支付方式 wxapp.iap,
     gameId:子游戏id,
     appInfo:透传参数,
     mustcharge:是否支付 默认填 1
     */
    rechargeOrder: function rechargeOrder(params) {
        if (!tywx.IsWechatPlatform()) {
            return;
        }
        var local_uuid = tywx.Util.getLocalUUID();
        var sdkPath = tywx.SystemInfo.loginUrl;
        var reqUrl = tywx.SystemInfo.hall_version == 'hall37' ? sdkPath + 'open/v4/pay/order' : sdkPath + 'open/v5/pay/order';
        wx.request({
            url: reqUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: tywx.UserInfo.userId,
                appId: tywx.SystemInfo.appId,
                wxAppId: tywx.SystemInfo.wxAppId,
                clientId: tywx.SystemInfo.clientId,
                imei: 'null',
                uuid: local_uuid,
                //商品信息
                prodId: params.prodId,
                prodName: params.prodName,
                prodCount: params.prodCount || 1,
                prodPrice: params.prodPrice,
                chargeType: params.chargeType,
                gameId: params.gameId,
                appInfo: params.appInfo,
                mustcharge: params.mustcharge || 1
            },

            method: 'POST',

            success: function success(params) {
                console.log(null, 'tuyoo rechargeOrder success, params:' + JSON.stringify(params));
                var results = params.data.result;
                if (results.code == 0) {
                    var chargeInfo = results.chargeInfo;
                    var chargeData = chargeInfo.chargeData;
                    var notifyUrl = chargeData.notifyUrl.replace("ve", "vg");
                    var platformOrderId = chargeData.platformOrderId;
                    console.log(null, 'tuyoo rechargeOrder success 创建订单成功, chargeData.mustcharge =' + chargeData.mustcharge);
                    if (chargeData && chargeData.mustcharge == 1) {
                        // wx.requestMidasPayment  购买微信币
                        wx.requestMidasPayment({
                            mode: chargeData.mode,
                            env: chargeData.env,
                            offerId: chargeData.offerId,
                            buyQuantity: 10 * chargeInfo.chargeTotal,
                            platform: chargeData.platform,
                            currencyType: "CNY",
                            zoneId: chargeData.zoneId,
                            success: function success(params) {
                                // 支付成功
                                tywx.TuyooSDK.orderCallFunc(notifyUrl, platformOrderId, chargeInfo.chargeCoin);
                            },
                            fail: function fail(params) {
                                console.log(null, '米大师支付 fail params = ' + JSON.stringify(params));
                            }
                        });
                    } else if (chargeData && chargeData.mustcharge == 0) {
                        tywx.TuyooSDK.orderCallFunc(notifyUrl, platformOrderId, chargeInfo.chargeCoin);
                    }
                } else if (results.code == 1) {
                    //hall.MsgBoxManager.showToast({title : results.info});
                } else if (results.code == 3) {
                    //hall.MsgBoxManager.showToast({title : '微信小程序登陆验证失败!'});
                }
            },
            fail: function fail(params) {
                //hall.MsgBoxManager.showToast({title : '购买失败!'});
            },
            complete: function complete(params) {}
        });
    }
};

tywx.WechatInterfaceInit = function () {
    if (tywx.IsWechatPlatform()) {
        /**
         * 小程序回到前台,具体逻辑自己实现
         */
        wx.onShow(function (result) {
            // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
            //console.log('', "+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(result));
            console.log('', "+++++++++++++++++onShow+++++++++++++++++" + JSON.stringify(result));
            //取相关参数
            var scene = result.scene;
            var query = result.query;
            var scenePath = '';
            //来源处理
            tywx.UserInfo.scene_id = scene;
            tywx.UserInfo.scene_param = query.from || "";
            tywx.UserInfo.invite_id = query.inviteCode || 0;
            tywx.StateInfo.isOnForeground = true;
            tywx.NotificationCenter.trigger(tywx.EventType.GAME_SHOW, result);
            var _inviteCode = query && query.inviteCode ? query.inviteCode : 0;

            tywx.showQuery = query || {};
            var hasUUID = tywx.Util.checkLocalUUID();
            var oldUserFlag = hasUUID ? 1 : 0;

            if (query && query.gdt_vid && query.weixinadinfo) {
                //从广点通广告跳过来的，from的开头加入gdt标识区分
                var from = "gdt." + query.weixinadinfo;
                tywx.UserInfo.scene_param = from;
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [scene, from, oldUserFlag]);
            } else if (query && query.sourceCode) {
                //从小程序消息卡片中点入,该场景为"点击用户分享卡片进入游戏注册时，分享用户的user_id直接当做场景参数放在param02，param03和param04分别代表分享点id和分享图文id"
                //var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [scene, query.inviteCode, query.sourceCode, query.imageType, "CardActive", oldUserFlag]);
                if (query && query.plaintext && query.ciphertext) {
                    //密语传情进入
                    tywx.SECRETLANGUAGEDATA = query;
                    tywx.UserInfo.showQuery = query;
                    tywx.NotificationCenter.trigger(tywx.EventType.SECRET_LANGUAGE_TO_GAME, query);
                }
            } else {
                if (tywx.Util.isSceneQrCode(scene)) {
                    //从小程序码进入,相关见文档https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/qrcode.html
                    if (query.hasOwnProperty('scene')) {
                        scenePath = query.scene;
                    } else if (result.hasOwnProperty('path')) {
                        scenePath = result.path;
                    }
                    scenePath.replace(".html", ""); //生成时可能会在path后面添加.html
                    scenePath = decodeURIComponent(scenePath);
                    tywx.UserInfo.scene_param = scenePath;
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [scene, scenePath, oldUserFlag]);
                } else {
                    //场景值和场景参数分别记录到可选参数param01和param02当中，如param01=1058，param02=tuyouqipai
                    //场景参数由项目组接入推广渠道时配置，如公众号dacihua、tuyouqipai，二维码填写企业或个人标识
                    tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserFrom, [scene, query.from, oldUserFlag]);
                }
            }

            if (tywx.UserInfo.userId === 0) {
                tywx.TuyooSDK.login();
                console.log("tuyoo login");
            } else {
                if (tywx.TCPClient.connectStatus !== tywx.TCPClient.CONNECT_STATUS_OK) {
                    tywx.TCPClient.reconnet();
                    console.log("tcp reconnet");
                } else {
                    if (tywx.UserInfo.user_add_item > 0) {
                        console.log("user_add_item ..:: ", tywx.UserInfo.user_add_item);
                        tywx.MSG.addItems(6, 0, tywx.UserInfo.user_add_item);
                        tywx.UserInfo.user_add_item = -1;
                    }
                    if (tywx.UserInfo.select_gift_item) {
                        var _item = tywx.UserInfo.select_gift_item ? tywx.UserInfo.select_gift_item.content.items[0].itemId.substr(-4) : "";
                        var _amount = 1;
                        var _uuid = tywx.UserInfo.select_gift_item.uuid;
                        tywx.MSG.whisperStart(_uuid, _item, _amount);
                        tywx.UserInfo.select_gift_item = undefined;
                    }

                    if (_inviteCode !== 0) {
                        tywx.MSG.enterGame(_inviteCode);
                        console.log("enter game..:: ", _inviteCode);
                    } else {
                        console.log("enter game..");
                    }
                }
            }
        });

        /**
         * 小程序进入后台
         */
        wx.onHide(function () {
            console.log('', "+++++++++++++++++onHide+++++++++++++++++");
            if (tywx.UIManager.game.model.mconf.mode === 0 && tywx.UIManager.game.model.mconf.isWhisper === true) {
                tywx.UIManager.game.loseBackToHome();
                return;
            }
            tywx.UserInfo.scene_id = 0;
            tywx.StateInfo.isOnForeground = false;
            tywx.NotificationCenter.trigger(tywx.EventType.GAME_HIDE);
            tywx.TCPClient.close();
        });

        var getNetSuccess = function getNetSuccess(res) {
            if (res.hasOwnProperty('isConnected')) {
                tywx.StateInfo.networkConnected = res.isConnected;
            }
            // else if (res.hasOwnProperty('errMsg')){
            //     tywx.StateInfo.networkConnected = res.errMsg == 'getNetworkType:ok'
            // }
            else {
                    tywx.StateInfo.networkConnected = res.networkType != 'none';
                }

            tywx.StateInfo.networkType = res.networkType; //wifi,2g,3g,4g,none,unknown

            if (tywx.StateInfo.networkConnected) {
                if (tywx.UserInfo.userId === 0) {
                    // 登录失败
                    tywx.TuyooSDK.login();
                } else {
                    if (tywx.TCPClient.connectStatus !== tywx.TCPClient.CONNECT_STATUS_OK) {
                        // tcp 连接异常
                        tywx.TCPClient.reconnet();
                    }
                }
            }
        };

        wx.getNetworkType({
            success: getNetSuccess
        });

        wx.onNetworkStatusChange(getNetSuccess);

        wx.onError(function (res) {
            var d = new Date();
            var errMsg = 'userId:' + tywx.UserInfo.userId + 'time:' + d.toDateString() + ' ' + d.toTimeString() + ';' + res.message;
            tywx.BiLog.uploadLogTimely(errMsg);
        });
    }
    ;
};

tywx.WechatInterfaceInit();

cc._RF.pop();