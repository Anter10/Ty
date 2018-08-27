(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/core/tywx_wechat.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '68c7fFVZGtFWor8+ExUrVsI', 'tywx_wechat', __filename);
// script/core/tywx_wechat.js

'use strict';

/**
 *  支付相关
 *
 * */

var metaclass = cc._Class.extend({

    purchase: function purchase(prodId, prodPrice, prodName, prodCount) {
        if (!CC_WECHATGAME) {
            console.log('微信虚拟支付暂不支持IOS平台1');
            return;
        }

        if (cc.sys.os === cc.sys.OS_IOS) {
            console.log('微信虚拟支付暂不支持IOS平台2');
            return;
        }
        var inputInfo = 'prodId=' + prodId + ' prodPrice=' + prodPrice + ' prodName=' + prodName + ' prodCount=' + prodCount;
        console.log('===[develop]===', inputInfo);
        wx.request({
            url: tywx.SystemInfo.loginUrl + 'open/v5/pay/order',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: tywx.UserInfo.userId,
                appId: tywx.SystemInfo.appId,
                wxAppId: tywx.SystemInfo.wxAppId,
                clientId: tywx.SystemInfo.clientId,
                imei: 'null',
                uuid: tywx.Util.getLocalUUID(),

                prodId: prodId,
                prodName: prodName,
                prodCount: prodCount || 1,
                prodPrice: prodPrice,
                chargeType: "wxapp.iap",
                gameId: tywx.SystemInfo.gameId,
                appInfo: '',
                mustcharge: 1
            },
            method: 'POST',
            success: function success(params) {
                console.log('===[develop]===', 'request pay-sdk | callback | ' + JSON.stringify(params));

                var results = params.data.result;
                if (results && results.code == 0) {
                    console.log('===[develop]===', 'request pay-sdk | success');

                    var chargeInfo = results.chargeInfo;
                    var chargeData = chargeInfo.chargeData;

                    wx.requestMidasPayment({
                        mode: chargeData.mode,
                        env: chargeData.env,
                        offerId: chargeData.offerId,
                        buyQuantity: 10 * chargeInfo.chargeTotal,
                        platform: chargeData.platform,
                        currencyType: "CNY",
                        zoneId: chargeData.zoneId,
                        success: function success(params) {
                            console.log('===[develop]===', 'requestMidasPayment | success | ' + JSON.stringify(params));

                            ty.WeChat._pushPayment({
                                url: chargeData.notifyUrl.replace("ve", "vg"),
                                orderId: chargeData.platformOrderId
                            });
                        },
                        fail: function fail(params) {
                            console.log('===[develop]===', inputInfo, 'requestMidasPayment | failed | [2] |' + JSON.stringify(params));
                            // 取消订单
                            wx.request({
                                url: ty.GameData.url + 'open/v4/pay/cancelorder',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                    platformOrderId: chargeData.platformOrderId,
                                    appId: ty.GameData.appId,
                                    wxAppId: ty.GameData.wxAppId,
                                    userId: ty.UserInfo.userId,
                                    clientId: ty.GameData.clientId,
                                    payType: "wxapp.iap"
                                },
                                method: 'POST',
                                success: function success(params) {
                                    console.log('===[cancelorder]===', 'request : ' + JSON.stringify(params));
                                },
                                fail: function fail(params) {
                                    console.log('===[cancelorder]===', 'request failed :' + JSON.stringify(params));
                                }
                            });
                        }
                    });
                } else {
                    console.log('===[develop]===', inputInfo, 'request pay-sdk | failed | [0] |' + JSON.stringify(params));
                }
            },
            fail: function fail(params) {
                console.log('===[develop]===', inputInfo, 'request pay-sdk | failed | [1] |' + JSON.stringify(params));
            }
        });
    },

    _pushPayment: function _pushPayment(params) {
        this.mPaymentOrderList.push(params.orderId);
        this.mPaymentUrl = params.url;

        ty.Storage.setItem(ty.Storage.Key_Payment_Notify_Url, params.url);
        ty.Storage.setItem(ty.Storage.Key_Payment_Notify_Order_List, this.mPaymentOrderList.join('|'));

        this.notifyPaymentOnce();
    },

    notifyPaymentOnce: function notifyPaymentOnce() {
        if (this.mPaymentUrl && this.mPaymentUrl != '' && this.mPaymentOrderList.length > 0) {
            this.onPurchase(this.mPaymentUrl, this.mPaymentOrderList[0]);
        }
    },

    onPurchase: function onPurchase(notifyUrl, platformOrderId) {
        console.log('===[onPurchase]===', 'notifyUrl=' + notifyUrl + ' platformOrderId=' + platformOrderId);

        wx.request({
            url: notifyUrl,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                userId: ty.UserInfo.userId,
                appId: ty.GameData.appId,
                wxAppId: ty.GameData.wxAppId,
                clientId: ty.GameData.clientId,
                imei: 'null',
                uuid: ty.GameData.uuid,
                platformOrderId: platformOrderId
            },
            method: 'POST',
            success: function success(params) {
                console.log('===[develop]===', 'notify | success | ' + JSON.stringify(params));
            },
            fail: function fail(params) {
                ty.Output.warn('===[develop]===', 'notify | failed | ' + JSON.stringify(params));
            },
            complete: function complete() {
                console.log('===[develop]===', 'notify | complete');
                ty.WeChat._popPayment(platformOrderId);
            }
        });
    },

    _popPayment: function _popPayment(platformOrderId) {
        for (var i = 0; i < this.mPaymentOrderList.length; i++) {
            var orderId = this.mPaymentOrderList[i];
            if (platformOrderId == orderId) {
                this.mPaymentOrderList.splice(i, 1);
                break;
            }
        }
        ty.Storage.setItem(ty.Storage.Key_Payment_Notify_Order_List, this.mPaymentOrderList.join('|'));
        this.notifyPaymentOnce();
    }
});

tywx.TYPay = new metaclass();

// tywx.TYPay.init();

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
        //# sourceMappingURL=tywx_wechat.js.map
        