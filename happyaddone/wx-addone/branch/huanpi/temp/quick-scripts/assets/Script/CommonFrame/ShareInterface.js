(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/CommonFrame/ShareInterface.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3c75dKqoYpHWK7HVXbWXGeV', 'ShareInterface', __filename);
// Script/CommonFrame/ShareInterface.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/3.
 */

tywx.ShareInterface = {
    OnShareAppMessageInfo: null, //右上角转发对应的分享点信息

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
        try {
            if (tywx.IsWechatPlatform()) {
                tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 1, shareSchemeId]);
                var query = 'inviteCode=' + tywx.UserInfo.userId + '&sourceCode=' + sharePointId + "&inviteName=" + tywx.UserInfo.userName + "&imageType=" + shareSchemeId + "&extraInfo=" + (extraInfo ? extraInfo : '');
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                    query: query,
                    success: function success(result) {
                        //分享成功相关处理
                        if (successCallback) {
                            successCallback(result);
                        }
                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 2, shareSchemeId]);
                    },
                    fail: function fail(result) {
                        //分享失败相关处理
                        if (failCallback) {
                            failCallback(result);
                        }
                    },
                    complete: function complete() {}
                });
            }
        } catch (err) {
            tywx.LOGE("error:", "tywx.ShareInterface.share——" + JSON.stringify(err));
        }
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
        //# sourceMappingURL=ShareInterface.js.map
        