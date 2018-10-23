(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/common_frame/HttpUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ae923yubr1AhrwVJIWEy1nV', 'HttpUtil', __filename);
// scripts/common_frame/HttpUtil.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/2.
 */

tywx.HttpUtil = {
    httpPost: function httpPost(cfgObj, httpType) {
        try {
            if (tywx.IsWechatPlatform()) {
                wx.request({
                    url: cfgObj.url,
                    data: cfgObj.postData,
                    header: cfgObj.header,
                    method: 'POST',
                    dataType: 'json',
                    success: function success(res) {
                        if (res.statusCode == 200) {
                            //正常连接{"/api/bilog5/clientlog": "ok"}
                            if (res.data && res.data.hasOwnProperty('/api/bilog5/clientlog') && res.data['/api/bilog5/clientlog'] == "ok") {
                                tywx.LOGD('ty.HttpUtil.httpPost', 'post success! ');
                            }
                        } else {
                            tywx.LOGD('ty.HttpUtil.httpPost', 'statusCode:' + res.statusCode);
                        }
                    },
                    fail: function fail(res) {
                        tywx.LOGD('ty.HttpUtil.httpPost', 'post error! ' + cfgObj.url);
                    }
                });
            }
        } catch (err) {
            tywx.LOGE("error:", "tywx.HttpUtil.httpPost——" + JSON.stringify(err));
        }
    },

    httpGet: function httpGet(cfgObj, successcb, failcb) {
        try {
            if (tywx.IsWechatPlatform()) {
                tywx.LOGD('ty.HttpUtil.httpGet', 'url:' + cfgObj.url);
                wx.request({
                    url: cfgObj.url,
                    method: 'GET',
                    success: function success(res) {
                        if (res.statusCode == 200) {
                            tywx.LOGD('ty.HttpUtil.httpGet', 'res:' + JSON.stringify(res.data));
                            if (successcb) {
                                successcb(res.data);
                            }
                        } else {
                            tywx.LOGD('ty.HttpUtil.httpGet', 'statusCode:' + res.statusCode);
                        }
                    },
                    fail: function fail(res) {
                        tywx.LOGD('ty.HttpUtil.httpGet', 'post error! ' + cfgObj.url);
                        if (failcb) {
                            failcb(res);
                        }
                    }
                });
            }
        } catch (err) {
            tywx.LOGE("error:", "tywx.HttpUtil.httpGet——" + JSON.stringify(err));
        }
    }
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=HttpUtil.js.map
        