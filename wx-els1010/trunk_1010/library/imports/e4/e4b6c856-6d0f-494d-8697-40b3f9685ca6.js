"use strict";
cc._RF.push(module, 'e4b6chWbQ9JTYaXQLP5aFym', 'ShareInterface');
// scripts/common_frame/ShareInterface.js

'use strict';

/**
 * Created by xiaochuntian on 2018/5/3.
 */

tywx.ShareInterface = {
    OnShareAppMessageInfo: null, //右上角转发对应的分享点信息

    shareWithSharePoint: function shareWithSharePoint(sharePointStr, successCallback, failCallback, extraInfo) {
        if (tywx.PropagateInterface._cachedShareConfig) {
            var randomShareInfo = tywx.PropagateInterface._shuffleByWeights();
            if (randomShareInfo && randomShareInfo[sharePointStr]) {
                var sharePointInfo = randomShareInfo[sharePointStr];
                tywx.ShareInterface.share(sharePointInfo.shareContent, sharePointInfo.sharePicUrl, sharePointInfo.sharePointId, sharePointInfo.shareSchemeId, successCallback, failCallback, extraInfo);
            }
        } else {
            return null;
        }
    },

    /**
     * 设置右上角"转发"对应的分享信息(通过给出分享点)
     */
    setOnShareAppMessageInfoWithSharePoint: function setOnShareAppMessageInfoWithSharePoint(sharePointStr) {
        if (tywx.PropagateInterface._cachedShareConfig) {
            var randomShareInfo = tywx.PropagateInterface._shuffleByWeights();
            if (randomShareInfo && randomShareInfo[sharePointStr]) {
                var sharePointInfo = randomShareInfo[sharePointStr];
                this.OnShareAppMessageInfo = {
                    title: sharePointInfo.shareContent,
                    imageUrl: sharePointInfo.sharePicUrl,
                    sharePointId: sharePointInfo.sharePointId,
                    shareSchemeId: sharePointInfo.shareSchemeId
                };
            }
        }
    },

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
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                    query: 'inviteCode=' + tywx.UserInfo.userId + '&sourceCode=' + sharePointId + "&inviteName=" + tywx.UserInfo.userName + "&imageType=" + shareSchemeId + "&extraInfo=" + (extraInfo ? extraInfo : ''),
                    success: function success(result) {
                        //分享成功相关处理
                        if (successCallback) {
                            successCallback(result);
                        }
                        tywx.BiLog.clickStat(tywx.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 2, shareSchemeId]);
                        if (tywx.SystemInfo.openLocalRecord) {
                            tywx.TuyooSDK.freshLocalShareTimes();
                        }
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
                tywx.ShareInterface.setOnShareAppMessageInfoWithSharePoint("defaultSharePoint");
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
                        if (tywx.SystemInfo.openLocalRecord) {
                            tywx.TuyooSDK.freshLocalShareTimes();
                        }
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