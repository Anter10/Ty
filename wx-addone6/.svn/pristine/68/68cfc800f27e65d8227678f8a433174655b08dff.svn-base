/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 系统信息
 * 包括clientId，loginUrl等
 */
//ty.LOGE("TuyooSDK loaded");
ty.TuyooSDK = {
    SESSION_KEY: 'TU_SESSION_STORAGE',

    /***************************以下为登录相关接口*********************************/
    login: function() {
        if(ty.IsWechatPlatform()) {
            ty.TuyooSDK.getSystemInfo();
            ty.TuyooSDK.wechatLogin();
            ty.PropagateInterface._doHttpGetShareConfig();
        }
        else {
            //其他平台,待添加
        }
    },

    // 微信登录
    wechatLogin: function() {
        try {
            if(!ty.IsWechatPlatform()) {
                return;
            }

            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeWxLoginStart, []);
            wx.login({
                success: function(params) {
                    ty.LOGD(null, 'wx login success, params:' + JSON.stringify(params));
                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeWxLoginSuccess, [params.code]);
                    if (params.code) {
                        var code = params.code;
                        ty.TuyooSDK.loginTuyooWithCode(code, {});
                        ty.NotificationCenter.trigger(ty.EventType.WEIXIN_LOGIN_SUCCESS);
                    }
                },

                fail: function(params) {
                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
                    ty.LOGD(null, 'wx login fail, params:' + JSON.stringify(params));
                    ty.NotificationCenter.trigger(ty.EventType.WEIXIN_LOGIN_FAIL);
                },

                complete: function(params) {

                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.wechatLogin——" + JSON.stringify(err));
        }
    },

    // 微信不需要重新授权，使用
    loginTuyooWith3rdSession: function() {
        try {
            if(!ty.IsWechatPlatform()) {
                return;
            }
            wx.getStorage({
                key: ty.TuyooSDK.SESSION_KEY,
                success: function(params) {
                    if (!params.data) {
                        ty.TuyooSDK.wechatLogin();
                        return;
                    }
                    // 微信授权成功后使用code登录途游服务器
                    wx.request({
                        url: ty.SystemInfo.loginUrl + 'open/v3/user/processSnsIdNew',
                        data: {
                            snsId: params.data,
                            deviceName: 'wechatGame',
                            clientId: ty.SystemInfo.clientId,
                            appId: ty.SystemInfo.appId
                        },

                        success: function(params) {
                            ty.LOGD(null, 'tuyoo login success, params:' + JSON.stringify(params));
                        },

                        fail: function(params) {
                            ty.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                        },

                        complete: function(params) {

                        }
                    });
                },
                fail: function(params) {
                    ty.TuyooSDK.wechatLogin();
                },
                complete:function(params) {

                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.loginTuyooWith3rdSession——" + JSON.stringify(err));
        }
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
    loginTuyooWithCode: function(code, userInfo) {
        try {
            if (!ty.IsWechatPlatform()) {
                return;
            }
            // 微信授权成功后使用code登录途游服务器
            wx.showShareMenu({
                withShareTicket: true
            });


            //咱们后端 0 是男 1 是女,要转换
            var gender = userInfo.gender || 0;

            var local_uuid = ty.Util.getLocalUUID();
            ty.LOGD("local_uuid:", local_uuid);
            var sdkPath = ty.SystemInfo.loginUrl;
            var dataObj = {
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                snsId: 'wxapp:' + code,
                uuid: local_uuid,
                //以下为上传玩家的微信用户信息
                //nickName: userInfo.nickName,
                //avatarUrl: userInfo.avatarUrl,
                gender: gender,
                scene_id: ty.UserInfo.scene_id || "",
                scene_param: ty.UserInfo.scene_param || "",
                invite_id: ty.UserInfo.invite_id || 0
            };
            if (userInfo && userInfo.nickName) {
                dataObj.nickName = userInfo.nickName;
            }

            if (userInfo && userInfo.avatarUrl) {
                dataObj.avatarUrl = userInfo.avatarUrl;
            }
            ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeLoginSDKStart, [code, local_uuid, userInfo.nickName]);
            wx.request({
                url: sdkPath + 'open/v6/user/LoginBySnsIdNoVerify',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: dataObj,
                method: 'POST',

                success: function (params) {
                    //ty.LOGE('tuyoo login success, params:' + JSON.stringify(params));
                    console.log('tuyoo login success, params:' + JSON.stringify(params));
                    var checkData = params.data;
                    if ((checkData.error && checkData.error.code == 1) || !(checkData.result && checkData.result.userId)) {
                        // ty.LOGE('tuyoo login fail...');
                        setTimeout(ty.TuyooSDK.login, 200);
                        return;
                    }

                    // 保存用户名/用户ID/用户头像
                    var result = checkData.result;
                    ty.UserInfo.userId = result.userId;
                    ty.UserInfo.userName = result.userName;
                    ty.UserInfo.userPic = result.purl;
                    ty.UserInfo.authorCode = result.authorCode;
                    ty.UserInfo.wxgame_session_key = result.wxgame_session_key;
                    ty.LOGD(null, 'userId:' + ty.UserInfo.userId + ' userName:' + ty.UserInfo.userName + ' userPic:' + ty.UserInfo.userPic);

                    if (ty.UserInfo.userId && ty.UserInfo.userName) {
                        ty.LOGE("TUYOO_SDK_LOGIN_SUCCESS", JSON.stringify(params));
                    } else {
                        ty.LOGE("TUYOO_SDK_LOGIN_FAIL", JSON.stringify(params));
                    }

                    var token = result.token;
                    ty.LOGD(null, 'token:' + token);
                    wx.setStorage({
                        key: ty.TuyooSDK.SESSION_KEY,
                        data: token
                    });


                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [code, local_uuid, userInfo.nickName, result.userId]);
                    if (ty.showScene && ty.showQuery && ty.showQuery.sourceCode) {
                        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom, [ty.showScene, ty.showQuery.inviteCode, ty.showQuery.sourceCode, ty.showQuery.imageType, "GameStart"]);
                    }
                    ty.TuyooSDK.initWebSocketUrl(result);

                    // 发送登录成功事件
                    ty.NotificationCenter.trigger(ty.EventType.SDK_LOGIN_SUCCESS);
                },

                fail: function (params) {
                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeLoginSDKFailed, [code, local_uuid, userInfo.nickName]);
                    ty.LOGD(null, 'tuyoo login fail, params:' + JSON.stringify(params));
                    ty.LOGE("TUYOO_SDK_LOGIN_FAIL", JSON.stringify(params));
                    ty.NotificationCenter.trigger(ty.EventType.SDK_LOGIN_FAIL);
                },

                complete: function (params) {

                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.loginTuyooWithCode——" + JSON.stringify(err));
        }
    },

    getTokenByUUID(callback){
        let local_uuid = ty.Util.getLocalUUID();
        ty.HttpUtil.httpPost({
            url: ty.SystemInfo.loginUrl + 'open/v4/user/createGuest',//"open/v4/user/loginByToken",
            data: {
                appId: ty.SystemInfo.appId,
                wxAppId: ty.SystemInfo.wxAppId,
                clientId: ty.SystemInfo.clientId,
                intClientId: ty.StateInfo.intClientId,
                uuid: local_uuid,
                imei: 'null',
                scene_id: '',
                scene_param: '',
                invite_id: 0
            }
        },
        (data)=>{
                console.log('getTokenByUUID success', data);
                // data = JSON.parse(data);
                callback && callback(data);
            }
        );
    },
    loginByToken(){
        let local_uuid = ty.Util.getLocalUUID();
        this.getTokenByUUID((data)=>{
            //data = JSON.parse(data);
            ty.HttpUtil.httpPost({
                url:ty.SystemInfo.loginUrl + "open/v4/user/loginByToken",
                data: {
                    appId: ty.SystemInfo.appId,
                    wxAppId: ty.SystemInfo.wxAppId,
                    clientId: ty.SystemInfo.clientId,
                    intClientId: ty.SystemInfo.intClientId,
                    uuid: local_uuid,
                    imei: "null",
                    scene_id: ty.UserInfo.scene_id || "",
                    scene_param: ty.UserInfo.scene_param || "",
                    invite_id: ty.UserInfo.invite_id || 0,
                    token: data.result.token
                }
            },
            (data)=>{
                cc.log('login success', data);
                //data = JSON.parse(data);
                //cc.log('login success', login_params);
                cc.log(typeof data);
                let result = data.result;
                ty.UserInfo.userId = result.userId;
                ty.UserInfo.userPic = result.purl;
                ty.UserInfo.userName = result.userName;
                ty.UserInfo.authorCode = result.authorCode;
            }
            );
        });
    },
    /**
     * 使用sdk登陆返回信息解析得到服务器连接地址,对于单机游戏来说无效
     * @param loginResult
     */
    initWebSocketUrl: function(loginResult) {
        if(loginResult && loginResult.tcpsrv) {
            var ip = loginResult.tcpsrv.ip;
            var port = loginResult.tcpsrv.wsport || loginResult.tcpsrv.port; //优先使用wsport
            var webSocketUrl;
            if (ty.SystemInfo.loginUrl.indexOf("https://") > -1){
                webSocketUrl = 'wss://' + ip + '/';
            }
            else{
                webSocketUrl = 'ws://' + ip + ':' + port.toString() + '/';
            }
            ty.LOGD(null, 'webSocketUrl:' + webSocketUrl);
            ty.SystemInfo.webSocketUrl = webSocketUrl;
        }
    },


    getSystemInfo : function () {
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
        try {
            if(!ty.IsWechatPlatform()) {
                return;
            }
            wx.getSystemInfo({
                success : function (result) {
                    var model = result.model;
                    var isiPhone = model.indexOf("iPhone") >= 0;
                    var windowHeight = result.windowHeight;
                    var resultType = 0;
                    if (isiPhone){
                        if(windowHeight == 812){   //iPhoneX
                            resultType = 2;
                        }else if (windowHeight == 736){ // 7p 8p
                            resultType = 4;
                        }else {  //其他iPhone
                            resultType = 1;
                        }
                    }else { //cc.sys.OS_ANDROID
                        resultType = 3;
                    }
                    ty.UserInfo.systemType = resultType;
                    ty.UserInfo.wechatType = result.version;
                    ty.UserInfo.model = result.model;
                    ty.UserInfo.system = result.system;
                    ty.UserInfo.sdkVersion = result.SDKVersion;
                    //console.error("基础库版本为:" + ty.UserInfo.sdkVersion);
                    //上报顺序为微信版本 基础库版本 平台 操作系统版本
                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeSubmitVersionInfo,
                        [result.version, result.SDKVersion, result.platform, result.system]);
                },
                fail : function () {
                },
                complete : function () {
                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.getSystemInfo——" + JSON.stringify(err));
        }
    },

    wechatAuthorize: function() {
        try {
            if(!ty.IsWechatPlatform()) {
                return;
            }
            wx.getSetting({
                success:function(res) {
                    if (!res.authSetting['scope.userInfo']) {
                        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeAuthorizationStart, []);
                        wx.authorize({
                            scope : "scope.userInfo",
                            success : function () {
                                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeAuthorizationSuccess, []);
                                ty.NotificationCenter.trigger(ty.EventType.START_AUTHORIZATION_SUCCESS);
                            },
                            fail:function () {
                                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeAuthorizationFailed, []);
                                ty.NotificationCenter.trigger(ty.EventType.START_AUTHORIZATION_FAILED);
                            },
                            complete:function () {
                            }
                        });
                    }
                    else{
                        ty.NotificationCenter.trigger(ty.EventType.START_AUTHORIZATION_SUCCESS);
                    }
                }
            })
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.wechatAuthorize——" + JSON.stringify(err));
        }
    },

    /***************************以下为支付相关接口*********************************/

    createOrder:function(id, prodPrice, name, prodCount, extraProdId, extraAppInfo){
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
        data.gameId = ty.SystemInfo.gameId;
        data.prodName = name;
        data.prodCount = prodCount;
        data.appInfo = extraAppInfo ? extraAppInfo :{};
        data.extraProdId = extraProdId ? extraProdId : '';
        ty.TuyooSDK.rechargeOrder(data);
    },

    orderCallFunc:function(url, platformOrderId, chargeCoin){
        try {
            if(!ty.IsWechatPlatform()) {
                return;
            }
            var local_uuid = ty.Util.getLocalUUID();
            var _chargeCoin = chargeCoin;
            wx.request({
                url: url,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    userId:ty.UserInfo.userId,
                    appId: ty.SystemInfo.appId,
                    wxAppId: ty.SystemInfo.wxAppId,
                    clientId: ty.SystemInfo.clientId,
                    imei: 'null',
                    uuid : local_uuid,
                    platformOrderId: platformOrderId,
                },

                method:'POST',

                success: function(results) {
                    var tips = "购买成功";
                },
                fail: function(params) {
                    ty.LOGE(null, 'file = [Recharge] fun = [OrderCallFun] 充值失败 params = ' + JSON.stringify(params));
                },
                complete: function(params) {

                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.orderCallFunc——" + JSON.stringify(err));
        }
    },

    /*
     params prodId:商品ID, prodName:商品名称, prodCount:购买数量
     prodPrice:价格  单位元,
     chargeType:支付方式 wxapp.iap,
     gameId:子游戏id,
     appInfo:透传参数,
     mustcharge:是否支付 默认填 1
     */
    rechargeOrder: function (params){
        try {
            if(!ty.IsWechatPlatform()) {
                return;
            }
            var local_uuid = ty.Util.getLocalUUID();
            var sdkPath = ty.SystemInfo.loginUrl;
            var reqUrl = ty.SystemInfo.hall_version == 'hall37' ? sdkPath + 'open/v4/pay/order': sdkPath + 'open/v5/pay/order';
            wx.request({
                url: reqUrl,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    userId:ty.UserInfo.userId,
                    appId: ty.SystemInfo.appId,
                    wxAppId: ty.SystemInfo.wxAppId,
                    clientId: ty.SystemInfo.clientId,
                    imei: 'null',
                    uuid : local_uuid,
                    //商品信息
                    prodId: params.prodId,
                    prodName: params.prodName,
                    prodCount: params.prodCount || 1,
                    prodPrice: params.prodPrice,
                    chargeType: params.chargeType,
                    gameId : params.gameId,
                    appInfo : params.appInfo,
                    mustcharge : params.mustcharge || 1,
                    prodOrderId: params.extraProdId,
                },

                method:'POST',

                success: function(params) {
                    ty.LOGE(null, 'tuyoo rechargeOrder success, params:' + JSON.stringify(params));
                    var results = params.data.result;
                    if (results.code == 0) {
                        var chargeInfo = results.chargeInfo;
                        var chargeData = chargeInfo.chargeData;
                        var notifyUrl = chargeData.notifyUrl;
                        var platformOrderId = chargeData.platformOrderId;
                        ty.LOGE(null, 'tuyoo rechargeOrder success 创建订单成功, chargeData.mustcharge =' + chargeData.mustcharge);
                        if (chargeData && chargeData.mustcharge == 1) {
                            // wx.requestMidasPayment  购买微信币
                            wx.requestMidasPayment({
                                mode: chargeData.mode,
                                env: chargeData.env,
                                offerId: chargeData.offerId,
                                buyQuantity: 10 * chargeInfo.chargeTotal,
                                platform:chargeData.platform,
                                currencyType:"CNY",
                                zoneId: chargeData.zoneId,
                                success:function(params) {
                                    // 支付成功
                                    ty.TuyooSDK.orderCallFunc(notifyUrl,platformOrderId,chargeInfo.chargeCoin);
                                },
                                fail:function(res) {
                                    ty.LOGE(null, '米大师支付 fail params = ' + JSON.stringify(params));
                                    if(res.errCode && res.errCode == 1) {
                                        //支付取消
                                        ty.TuyooSDK.cancelOrder(platformOrderId);
                                    }
                                }
                            });
                        }else if (chargeData && chargeData.mustcharge == 0){
                            ty.TuyooSDK.orderCallFunc(notifyUrl,platformOrderId,chargeInfo.chargeCoin);
                        }
                    }else if (results.code == 1) {
                        //hall.MsgBoxManager.showToast({title : results.info});
                    }else if (results.code == 3) {
                        //hall.MsgBoxManager.showToast({title : '微信小程序登陆验证失败!'});
                    }
                },
                fail: function(params) {
                    //hall.MsgBoxManager.showToast({title : '购买失败!'});
                },
                complete: function(params) {
                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.rechargeOrder——" + JSON.stringify(err));
        }
    },

    cancelOrder: function(orderId) {
        try {
            var sendUrl = ty.SystemInfo.loginUrl + 'open/v4/pay/cancelorder';
            var postData = {
                platformOrderId: orderId,
                appId: ty.SystemInfo.appId,
                userId: ty.UserInfo.userId,
                clientId: ty.SystemInfo.clientId,
                payType:  "wxapp.iap"
            };
            wx.request({
                url: sendUrl,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: postData,
                method:'POST',
                success: function(params) {
                    ty.LOGE(null, 'tuyoo cancelOrder success, params:' + JSON.stringify(params));
                },
                fail: function(params) {
                    ty.LOGE(null, 'tuyoo cancelOrder fail, params:' + JSON.stringify(params));
                },
                complete: function(params) {
                }
            });
        }
        catch(err) {
            ty.LOGE("error:", "ty.TuyooSDK.cancelOrder——" + JSON.stringify(err));
        }
    }
}

// ty.playMusic = function(){
//     if(ty.addbgm == null){
//         ty.addbgm = wx.createInnerAudioContext();
//         ty.addbgm.src = "https://elsfkws.nalrer.cn/teris/m/3.mp3";
//         ty.addbgm.loop = true
//         ty.addbgm.volume = 0.25
//         ty.addbgm.play();
//      }else{
//         if(ty.addbgm.paused != false){
//            ty.addbgm.volume = 0.25
//            ty.addbgm.play();
//         }
//      }
// };

// ty.stopMusic = function(){
//     if(ty.addbgm != null){
//         ty.addbgm.stop();
//     }
// };

// ty.pauseMusic = function(){
//     if(ty.addbgm != null){
//         ty.addbgm.pause();
//     }
// };

ty.WechatInterfaceInit = function() {
    try {
        if(ty.IsWechatPlatform()) {
            /**
             * 小程序回到前台,具体逻辑自己实现
             */
            wx.onShow(function (result) {
                //ty.playMusic();
                // {"0":{"scene":1044,"shareTicket":"beecdf9e-e881-492c-8a3f-a7d8c54dfcdb","query":{}}}  (从后台切到前台才有shareTicket,启动时没有)
                ty.LOGE('', "+++++++++++++++++onShow+++++++++++++++++"+JSON.stringify(result));
                //取相关参数
                var scene = result.scene;
                var query = result.query;
                var scenePath = '';
                ty.showScene = scene;
                ty.showQuery = query;
                //来源处理
                ty.UserInfo.scene_id = scene;
                ty.UserInfo.scene_param = query.from || "";
                ty.UserInfo.invite_id = query.inviteCode || 0;
                ty.StateInfo.isOnForeground = true;
                ty.NotificationCenter.trigger(ty.EventType.GAME_SHOW, result);
                var hasUUID = ty.Util.checkLocalUUID();
                var oldUserFlag = hasUUID ? 1 : 0;
                if (query && query.gdt_vid && query.weixinadinfo) {
                    //从广点通广告跳过来的，from的开头加入gdt标识区分
                    var from = "gdt." + query.weixinadinfo;
                    ty.UserInfo.scene_param = from;
                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom,[scene, from, oldUserFlag]);
                }
                else if(query && query.sourceCode) {
                    //从小程序消息卡片中点入,该场景为"点击用户分享卡片进入游戏注册时，分享用户的user_id直接当做场景参数放在param02，param03和param04分别代表分享点id和分享图文id"
                    //var query = "inviteCode="+ty.UserInfo.userId+"&sourceCode="+type +"&imageType="+imageMap.imageType+"&inviteName="+ty.UserInfo.userName;
                    ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom,[scene, query.inviteCode, query.sourceCode, query.imageType, "CardActive", oldUserFlag]);
                } else {
                    if(ty.Util.isSceneQrCode(scene)) {
                        //从小程序码进入,相关见文档https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/qrcode.html
                        if (query.hasOwnProperty('scene')){
                            scenePath = query.scene;
                        } else if(result.hasOwnProperty('path')) {
                            scenePath = result.path;
                        }
                        scenePath.replace(".html", "");     //生成时可能会在path后面添加.html
                        scenePath = decodeURIComponent(scenePath);
                        ty.UserInfo.scene_param = scenePath;
                        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom,[scene, scenePath, oldUserFlag]);
                    } else {
                        //场景值和场景参数分别记录到可选参数param01和param02当中，如param01=1058，param02=tuyouqipai
                        //场景参数由项目组接入推广渠道时配置，如公众号dacihua、tuyouqipai，二维码填写企业或个人标识
                        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom,[scene, query.from, oldUserFlag]);
                    }
                }
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeOnShowTimeStampSubmit,[]);
                ty.TuyooSDK.login();

                ty.AdManager && ty.AdManager.onForeGround && ty.AdManager.onForeGround();
                //! 插件接口
                ty.ado.onShow(result);
            });

            /**
             * 小程序进入后台
             */
            wx.onHide(function () {
                ty.LOGE('',"+++++++++++++++++onHide+++++++++++++++++");
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeOnHideTimeStampSubmit,[]);
                ty.UserInfo.scene_id = 0;
                ty.StateInfo.isOnForeground = false;
                ty.NotificationCenter.trigger(ty.EventType.GAME_HIDE);
                ty.TCPClient.close();

                //! 插件接口
                ty.ado.onHide();
            });

            var getNetSuccess = function (res) {
                if (res.hasOwnProperty('isConnected')){
                    ty.StateInfo.networkConnected = res.isConnected;
                }
                else if (res.hasOwnProperty('errMsg')){
                    ty.StateInfo.networkConnected = res.errMsg == 'getNetworkType:ok'
                }
                else{
                    ty.StateInfo.networkConnected = res.networkType != 'none';
                }

                ty.StateInfo.networkType = res.networkType;//wifi,2g,3g,4g,none,unknown
            };

            wx.getNetworkType({
                success:getNetSuccess
            });

            wx.onNetworkStatusChange(getNetSuccess);

            wx.onError(function (res) {
                var d = new Date();
                // var errMsg = 'userId:' + ty.UserInfo.userId + 'time:'+ d.toDateString() + ' ' + d.toTimeString() +';' + res.message;
                ty.ado.Utils.uploadErrorMsg(res.message);
            });

            wx.onAudioInterruptionEnd(function () {
                //ty.playMusic();
            });
        };
    }
    catch(err) {
        ty.LOGE("error:", "ty.WechatInterfaceInit——" + JSON.stringify(err));
    }
};

//ty.WechatInterfaceInit();

