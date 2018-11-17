"use strict";
cc._RF.push(module, '3c75dKqoYpHWK7HVXbWXGeV', 'ShareInterface');
// Script/CommonFrame/ShareInterface.js

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Created by xiaochuntian on 2018/5/3.
 */

tywx.ShareInterface = {
    OnShareAppMessageInfo: null, //右上角转发对应的分享点信息
    ShareTimeStamp: 0,
    IsWaitingCallback: false,
    /**
     * 设置右上角"转发"对应的分享信息
     * @param title
     * @param imageUrl
     * @param sharePointId
     * @param shareSchemeId
     */
    setOnShareAppMessageInfo: function setOnShareAppMessageInfo(title, imageUrl, sharePointId, shareSchemeId) {
        this.OnShareAppMessageInfo = {
            title: title,
            imageUrl: imageUrl,
            sharePointId: sharePointId,
            shareSchemeId: shareSchemeId
        };
    },

    /**
     * 获取右上角"转发"对应的分享信息
     * @returns {null}
     */
    getOnShareAppMessageInfo: function getOnShareAppMessageInfo() {
        return this.OnShareAppMessageInfo;
    },

    /**
     * 随机获取一个分享点作为"转发"对应的分享信息
     * @returns {*}
     */
    getRandomOnShareAppMessageInfo: function getRandomOnShareAppMessageInfo() {
        var shareKeys = [];

        for (var _key in tywx.PropagateInterface._cachedShareConfig) {
            shareKeys.push(_key);
        }
        if (shareKeys && shareKeys.length > 0) {
            var randomIndex = Math.floor(Math.random() * 10000) % shareKeys.length;
            var sharePointKey = shareKeys[randomIndex];
            var sharePointInfo = tywx.PropagateInterface._cachedShareConfig[sharePointKey];
            if (sharePointInfo && sharePointInfo.length > 0) {
                randomIndex = Math.floor(Math.random() * 10000) % sharePointInfo.length;
                var config = {
                    title: sharePointInfo[randomIndex].shareContent,
                    imageUrl: sharePointInfo[randomIndex].sharePicUrl,
                    sharePointId: sharePointInfo[randomIndex].sharePointId,
                    shareSchemeId: sharePointInfo[randomIndex].shareSchemeId
                };
                return config;
            }
        }
        return null;
    },

    /**
     * 根据分享信息调用分享接口,并封装了必要的打点和处理
     * @param title
     * @param imageUrl
     * @param sharePointId
     * @param shareSchemeId
     * @param successCallback
     * @param failCallback
     * @param extraInfo 额外信息
     */
    share: function share(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback, extraInfo) {
        return tywx.ShareInterface.share2(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback, extraInfo);
        /** 
        try {
            if (tywx.IsWechatPlatform()) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 1, shareSchemeId]);
                let query = 'inviteCode=' + tywx.UserInfo.userId + '&sourceCode=' + sharePointId + "&inviteName=" + tywx.UserInfo.userName + "&imageType=" + shareSchemeId + "&extraInfo=" + (extraInfo ? extraInfo : ''); 
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                    query: query,
                    success: function (result) {
                        //分享成功相关处理
                        if (successCallback) {
                            successCallback(result);
                        }
                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 2, shareSchemeId]);
                    },
                    fail: function (result) {
                        //分享失败相关处理
                        if (failCallback) {
                            failCallback(result);
                        }
                    },
                    complete: function () {
                    }
                });
            }
        }
        catch(err) {
            tywx.LOGE("error:", "tywx.ShareInterface.share——" + JSON.stringify(err));
        }*/
    },
    share2: function share2(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback, extraInfo) {
        try {
            if (tywx.IsWechatPlatform()) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 1, shareSchemeId]);
                var query = 'inviteCode=' + tywx.UserInfo.userId + '&sourceCode=' + sharePointId + "&inviteName=" + tywx.UserInfo.userName + "&imageType=" + shareSchemeId + "&extraInfo=" + (extraInfo ? extraInfo : '');
                tywx.ShareInterface.ShareTimeStamp = new Date().getTime();
                tywx.ShareInterface.IsWaitingCallback = true;
                tywx.ShareInterface.CurrentShareParams = {
                    title: title,
                    imageUrl: imageUrl,
                    sharePointId: sharePointId,
                    shareSchemeId: shareSchemeId,
                    successCallback: successCallback,
                    failCallback: failCallback,
                    extraInfo: extraInfo
                };
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                    query: query,
                    success: function success(result) {
                        console.log("share success");
                    },
                    fail: function fail(result) {
                        console.log("share fail");
                    },
                    complete: function complete() {
                        console.log("share complete");
                    }
                });
            }
        } catch (err) {
            tywx.LOGE("error:", "tywx.ShareInterface.share——" + JSON.stringify(err));
        }
    },
    shareBack: function shareBack() {
        console.log('tywx.ShareInterface.shareBack');
        var time_stack = new Date().getTime();
        var wait_time = time_stack - tywx.ShareInterface.ShareTimeStamp;
        var shareParams = tywx.ShareInterface.CurrentShareParams;

        var _ref = tywx.ado.Configs.ShareLimit || [1000, 10000],
            _ref2 = _slicedToArray(_ref, 2),
            min_time = _ref2[0],
            max_time = _ref2[1];

        console.log('tywx.ShareInterface.shareBack', wait_time, min_time, max_time, JSON.stringify(shareParams));
        if (shareParams) {
            if (wait_time >= min_time && wait_time <= max_time) {
                console.log('tywx.ShareInterface.shareBack', 'success');
                shareParams.successCallback && shareParams.successCallback(null);
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [shareParams.sharePointId, 2, shareParams.shareSchemeId]);
            } else {
                console.log('tywx.ShareInterface.shareBack', 'fail');
                shareParams.failCallback && shareParams.failCallback();
                tywx.ShareInterface.commonFialedCallback();
            }
        }
        tywx.ShareInterface.IsWaitingCallback = false;
        tywx.ShareInterface.CurrentShareParams = null;
    },
    commonFialedCallback: function commonFialedCallback() {
        if (tywx.ado.Configs.auditing || tywx.ado.isMinGanIP || !tywx.ado.Configs.ShareToast.show) {
            return;
        }
        tywx.ado.Utils.showWXModal(tywx.ado.Configs.ShareToast.content, '温馨提示');
    }
};

tywx.onShareAppMessageInit = function () {
    try {
        if (tywx.IsWechatPlatform()) {
            wx.onShareAppMessage(function (result) {
                /**
                 * 获取转发信息,手动设置过则使用设置信息,否则随机获取一个分享点信息
                 */
                var config = tywx.ShareInterface.getOnShareAppMessageInfo();
                if (config == null) {
                    config = tywx.ShareInterface.getRandomOnShareAppMessageInfo();
                }
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [config.sharePointId, 1, config.shareSchemeId]);
                return {
                    title: config.title,
                    imageUrl: config.imageUrl,
                    query: "inviteCode=" + tywx.UserInfo.userId + "&sourceCode=" + config.sharePointId + "&inviteName=" + tywx.UserInfo.userName + "&imageType=" + config.shareSchemeId,
                    success: function success(shareTickets, groupMsgInfos) {
                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [config.sharePointId, 2, config.shareSchemeId]);
                    },
                    fail: function fail() {},
                    complete: function complete() {}
                };
            });
        };
    } catch (err) {
        tywx.LOGE("error:", "tywx.ShareInterface.share——" + JSON.stringify(err));
    }
};

tywx.onShareAppMessageInit();

cc._RF.pop();