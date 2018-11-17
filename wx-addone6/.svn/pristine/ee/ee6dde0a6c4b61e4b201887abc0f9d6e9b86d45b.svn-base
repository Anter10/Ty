/**
 * Created by xiaochuntian on 2018/5/3.
 */

ty.ShareInterface = {
    OnShareAppMessageInfo: null,   //右上角转发对应的分享点信息
    ShareTimeStamp: 0,
    IsWaitingCallback: false,
    /**
     * 设置右上角"转发"对应的分享信息
     * @param title
     * @param imageUrl
     * @param sharePointId
     * @param shareSchemeId
     */
    setOnShareAppMessageInfo: function(title, imageUrl, sharePointId, shareSchemeId){
        this.OnShareAppMessageInfo = {
            title: title,
            imageUrl: imageUrl,
            sharePointId: sharePointId,
            shareSchemeId: shareSchemeId
        }
    },

    /**
     * 获取右上角"转发"对应的分享信息
     * @returns {null}
     */
    getOnShareAppMessageInfo: function() {
        return this.OnShareAppMessageInfo;
    },

    /**
     * 随机获取一个分享点作为"转发"对应的分享信息
     * @returns {*}
     */
    getRandomOnShareAppMessageInfo: function() {
        var shareKeys = [];

        for(var _key in ty.PropagateInterface._cachedShareConfig){
            shareKeys.push(_key);
        }
        if(shareKeys && shareKeys.length > 0) {
            var randomIndex = (Math.floor(Math.random()*10000))%shareKeys.length;
            var sharePointKey = shareKeys[randomIndex];
            var sharePointInfo = ty.PropagateInterface._cachedShareConfig[sharePointKey];
            if(sharePointInfo && sharePointInfo.length > 0) {
                randomIndex = (Math.floor(Math.random()*10000))%sharePointInfo.length;
                var config = {
                    title: sharePointInfo[randomIndex].shareContent,
                    imageUrl: sharePointInfo[randomIndex].sharePicUrl,
                    sharePointId: sharePointInfo[randomIndex].sharePointId,
                    shareSchemeId: sharePointInfo[randomIndex].shareSchemeId
                }
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
    share: function(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback, extraInfo) {
        return ty.ShareInterface.share2(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback, extraInfo);
        /** 
        try {
            if (ty.IsWechatPlatform()) {
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 1, shareSchemeId]);
                let query = 'inviteCode=' + ty.UserInfo.userId + '&sourceCode=' + sharePointId + "&inviteName=" + ty.UserInfo.userName + "&imageType=" + shareSchemeId + "&extraInfo=" + (extraInfo ? extraInfo : ''); 
                wx.shareAppMessage({
                    title: title,
                    imageUrl: imageUrl,
                    query: query,
                    success: function (result) {
                        //分享成功相关处理
                        if (successCallback) {
                            successCallback(result);
                        }
                        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 2, shareSchemeId]);
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
            ty.LOGE("error:", "ty.ShareInterface.share——" + JSON.stringify(err));
        }*/
    },
    share2: function(title, imageUrl, sharePointId, shareSchemeId, successCallback, failCallback, extraInfo) {
        try {
            if (ty.IsWechatPlatform()) {
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserShare, [sharePointId, 1, shareSchemeId]);
                let query = 'inviteCode=' + ty.UserInfo.userId + '&sourceCode=' + sharePointId + "&inviteName=" + ty.UserInfo.userName + "&imageType=" + shareSchemeId + "&extraInfo=" + (extraInfo ? extraInfo : ''); 
                ty.ShareInterface.ShareTimeStamp = new Date().getTime();
                ty.ShareInterface.IsWaitingCallback = true;
                ty.ShareInterface.CurrentShareParams = {
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
                    success: function (result) {
                        console.log("share success");
                    },
                    fail: function (result) {
                        console.log("share fail");
                    },
                    complete: function () {
                        console.log("share complete");
                    }
                });
            }
        }
        catch(err) {
            ty.LOGE("error:", "ty.ShareInterface.share——" + JSON.stringify(err));
        }
    },
    shareBack: function(){
        console.log('ty.ShareInterface.shareBack');
        let time_stack = new Date().getTime();
        let wait_time = time_stack - ty.ShareInterface.ShareTimeStamp;
        let shareParams = ty.ShareInterface.CurrentShareParams;
        let [min_time, max_time] = ty.ado.Configs.ShareLimit || [1000, 10000];
        console.log('ty.ShareInterface.shareBack', wait_time, min_time, max_time, JSON.stringify(shareParams));
        if(shareParams){
            if(wait_time >= min_time && wait_time <= max_time){
                console.log('ty.ShareInterface.shareBack' , 'success');
                shareParams.successCallback && shareParams.successCallback(null);
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserShare, [shareParams.sharePointId, 2, shareParams.shareSchemeId]);
            }
            else{
                console.log('ty.ShareInterface.shareBack' , 'fail');
                shareParams.failCallback && shareParams.failCallback();
                ty.ShareInterface.commonFialedCallback();
            }
        }
        ty.ShareInterface.IsWaitingCallback = false;
        ty.ShareInterface.CurrentShareParams = null;
    },
    commonFialedCallback: function(){
        if(ty.ado.Configs.auditing 
            || ty.ado.isMinGanIP 
            || !ty.ado.Configs.ShareToast.show){
                return;
        }
        ty.ado.Utils.showWXModal(ty.ado.Configs.ShareToast.content,'温馨提示');
    }
};

ty.onShareAppMessageInit = function() {
    try{
        if(ty.IsWechatPlatform()) {
            wx.onShareAppMessage(function (result) {
                /**
                 * 获取转发信息,手动设置过则使用设置信息,否则随机获取一个分享点信息
                 */
                var config = ty.ShareInterface.getOnShareAppMessageInfo();
                if(config == null) {
                    config = ty.ShareInterface.getRandomOnShareAppMessageInfo();
                }
                ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserShare,[config.sharePointId, 1, config.shareSchemeId]);
                return {
                    title: config.title,
                    imageUrl : config.imageUrl,
                    query : "inviteCode="+ty.UserInfo.userId+"&sourceCode="+config.sharePointId+"&inviteName="+ty.UserInfo.userName+"&imageType="+config.shareSchemeId,
                    success : function (shareTickets,groupMsgInfos) {
                        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserShare,[config.sharePointId, 2, config.shareSchemeId]);
                    },
                    fail : function () {

                    },
                    complete : function () {
                    }
                }
            });
        };
    }
    catch(err) {
        ty.LOGE("error:", "ty.ShareInterface.share——" + JSON.stringify(err));
    }
};

//ty.onShareAppMessageInit();