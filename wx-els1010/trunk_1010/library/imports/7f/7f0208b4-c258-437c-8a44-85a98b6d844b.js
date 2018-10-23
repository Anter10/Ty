"use strict";
cc._RF.push(module, '7f020i0wlhDfIpEhamLbYRL', 'BiStatLog');
// scripts/common_frame/BiStatLog.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by xiaochuntian on 2018/6/4.
 */

//新的json打点格式,暂未启用
tywx.BiStatLog = {
    BiStatInfo: null,
    init: function init() {
        this.BiStatInfo = {};
        this.getStaticInfo();
        this.getTyInfo();
        this.getLocationInfo();
        this.getSystemInfo();
    },

    getStaticInfo: function getStaticInfo() {
        this.BiStatInfo.IP = "#IP";
        this.BiStatInfo.receiveTime = "#receiveTime";
    },

    getTyInfo: function getTyInfo() {
        this.BiStatInfo.cloudId = tywx.SystemInfo.cloudId;
        this.BiStatInfo.gameId = tywx.SystemInfo.gameId;
        this.BiStatInfo.appId = tywx.SystemInfo.appId;
        this.BiStatInfo.clientId = tywx.SystemInfo.clientId;
        this.BiStatInfo.intClientId = tywx.SystemInfo.intClientId;
        this.BiStatInfo.userId = tywx.UserInfo.userId;
        this.BiStatInfo.uuid = tywx.Util.getLocalUUID();
        this.BiStatInfo.gameVersion = tywx.SystemInfo.version;
        this.BiStatInfo.wxAppId = tywx.SystemInfo.wxAppId;
    },

    getUserId: function getUserId() {
        this.BiStatInfo.userId = tywx.UserInfo.userId;
    },

    getNetworkType: function getNetworkType() {
        this.BiStatInfo.networkType = tywx.StateInfo.networkType;
    },

    getLocationInfo: function getLocationInfo(callback) {
        var self = this;
        wx.getLocation({
            type: 'wgs84',
            success: function success(res) {
                self.BiStatInfo.latitude = res.latitude;
                self.BiStatInfo.longitude = res.longitude;
                self.BiStatInfo.speed = res.speed;
                self.BiStatInfo.accuracy = res.accuracy;
            },
            complete: function complete() {
                callback();
            }
        });
    },

    getSystemInfo: function getSystemInfo() {
        var that = this;
        wx.getSystemInfo({
            success: function success(res) {
                that.BiStatInfo.brand = res.brand;
                that.BiStatInfo.model = res.model;
                that.BiStatInfo.pixelRatio = res.pixelRatio;
                that.BiStatInfo.screenWidth = res.screenWidth;
                that.BiStatInfo.screenHeight = res.screenHeight;
                that.BiStatInfo.windowWidth = res.windowWidth;
                that.BiStatInfo.windowHeight = res.windowHeight;
                that.BiStatInfo.language = res.language;
                that.BiStatInfo.wxVersion = res.version;
                that.BiStatInfo.systemVersion = res.system;
                that.BiStatInfo.platform = res.platform;
                that.BiStatInfo.wxSDKVersion = res.SDKVersion;
                that.BiStatInfo.fontSizeSetting = res.fontSizeSetting;
            }
        });
    },

    sendEvent: function sendEvent(eventId, eventParams) {
        if ((typeof eventParams === "undefined" ? "undefined" : _typeof(eventParams)) != 'object') {
            eventParams = {};
        }
        this.getNetworkType();
        this.getUserId();
        this.BiStatInfo.eventId = eventId;
        this.BiStatInfo.eventParams = eventParams;
        this.BiStatInfo.eventTime = Date.now().valueOf();

        var cb = function cb() {
            var eventStr = JSON.stringify(tywx.BiStatLog.BiStatInfo);
            var header = ['Content-Type:text/plain'];
            var configObj = {
                'url': tywx.SystemInfo.biLogServer,
                'headers': header,
                'postData': eventStr
            };
            tywx.HttpUtil.httpPost(configObj);
        };

        this.getLocationInfo(cb);
    }
};

//tywx.BiStatLog.init();

cc._RF.pop();