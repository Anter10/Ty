(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/game/model/ShareButton.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6bfae1dKpBEEru+YNd3E4p7', 'ShareButton', __filename);
// scripts/game/model/ShareButton.js

'use strict';

/*
   游戏分享prefab
   游戏的分享操作的主要逻辑在这个module里面编写
   created by gyc on 2018-08-08.
*/
cc.Class({
    extends: cc.Component,

    properties: {
        callButton: {
            default: null,
            type: cc.Button
        }
    },

    /*
       调用: 场景加载完成后的回调
       功能: 场景加载完成后的一些UI逻辑处理
       参数: [
           无
       ]
       返回值:[
           无
       ]
       思路: 系统自带
    */
    onLoad: function onLoad() {
        this.data = {};

        tywx.tt.log("this.button" + this.button);
    },

    /*
        调用: 组件开始调用的时候调用
        功能: 组件开始调用的时候的逻辑处理
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    start: function start() {},


    /*
        调用: 使用此model分享功能的时候 手动调用刷新分享的数据
        功能: 设置即将要分享的数据
        参数: [
            data: 分享的数据
        ]
        返回值:[
            无
        ]
        思路: 系统自带
    */
    setShareData: function setShareData(data) {
        this.data = data;
    },
    /**
     * @description 设置分享配置
     * @author lu ning
     * @date 2018-08-23
     * @param {Array<any>} config config[0]=tag;config[1]=是否强制分享到群,boolean
     */
    setShareConfig: function setShareConfig(config) {
        this.shareConfig = config;
    },


    /*
       调用: 使用此model分享功能的时候 
       功能: 手动设置分享成功后的回调函数
       参数: [
           successCall: 分享成功后的回调方法 类型Function
       ]
       返回值:[
           无
       ]
       思路: 逻辑需要
    */
    setSuccessCall: function setSuccessCall(successCall) {
        this.successCallBack = successCall;
    },

    /** 
     * @description 切换按钮的调用类型 
     * @param {Number} calltype  1 分享 2 视频
     */
    setButtonCallType: function setButtonCallType(calltype) {
        if (!this.calltype) {
            this.callButton.node.on('click', this.callBack, this);
        }
        this.calltype = calltype;
    },

    callBack: function callBack() {
        if ((tywx.tt.isMinGanIP || this.calltype == 2) && tywx.tt.isCanWatchVideo) {
            this.showWXVideo();
        } else if (this.calltype == 1 || !tywx.tt.isCanWatchVideo) {
            this.shareMiniApp();
        }
    },

    /*
        调用: 使用此model分享功能的时候 
        功能: 手动设置分享成功后的回调函数
        参数: [
            successCall: 分享成功后的回调方法 类型Function
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    setReactCall: function setReactCall(reactcall) {
        this.reactcall = reactcall;
    },

    /*
       调用: 使用此model分享功能的时候 
       功能: 手动设置分享失败后的回调函数
       参数: [
           errorCall: 分享失败后的回调方法 类型Function
       ]
       返回值:[
           无
       ]
       思路: 逻辑需要
    */
    setErrorCall: function setErrorCall(errorCall) {
        this.errorCallBack = errorCall;
    },

    /*
        调用: 使用此model分享功能的时候 
        功能: 手动设置分享失败后的回调函数
        参数: [
            errorCall: 分享失败后的回调方法 类型Function
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    setShareGroupCall: function setShareGroupCall(sgroupCall) {
        this.shareGroupCallBack = sgroupCall;
    },

    /**
     * @description 播放微信视频广告
     */
    showWXVideo: function showWXVideo() {
        var self = this;
        if (!this.hadclicknumber || this.hadclicknumber == 0) {
            this.hadclicknumber = 1;
        } else {
            return;
        }

        if (this.reactcall) {
            self.hadclicknumber = 0;
            self.successCallBack(this);
        } else {
            if (tywx.IsWechatPlatform()) {

                var param = {
                    success: function success(res) {
                        self.hadclicknumber = 0;
                        self.successCallBack && self.successCallBack(res);
                    },
                    fail: function fail(res) {
                        self.hadclicknumber = 0;
                        tywx.tt.Utils.showWXModal('观看视频失败');
                        self.errorCallBack && self.errorCallBack(null);
                    },
                    error_callback: function error_callback() {
                        self.hadclicknumber = 0;
                        var content = "恭喜你是幸运用户,";
                        if (self.shareConfig === tywx.tt.constants.ShareConfig.HOME_ZP_GET_VIDEO) {
                            content = content + '成功获得抽奖机会!';
                        } else if (self.shareConfig === tywx.tt.constants.ShareConfig.GET_HUNAYIHUAN_NUMBER_VIEDO) {
                            content = content + '成功获得3次换一换!';
                        } else if (self.shareConfig === tywx.tt.constants.ShareConfig.GET_CHUIZI_NUMBER_VIEDO) {
                            content = content + '成功获得锤子道具!';
                        } else if (self.shareConfig === tywx.tt.constants.ShareConfig.GAMEOVER_FUHUO_VIDEO) {
                            content = content + '成功复活!';
                        } else if (self.shareConfig === tywx.tt.constants.ShareConfig.ZPADDDOUBLE_VIDEO) {
                            content = content + '成功获得加倍机会!';
                        } else if (self.shareConfig === tywx.tt.constants.ShareConfig.GAMEOVER_VIDEO) {
                            content = content + '成功获得看视频!';
                        }

                        // 弹出提示框
                        tywx.tt.tipview.show({
                            success: function success() {
                                self.successCallBack && self.successCallBack(null);
                            },
                            tip: content,
                            config: -1,
                            calltype: -1,
                            closecall: function closecall() {
                                self.successCallBack && self.successCallBack(null);
                            }
                        });
                    }
                };
                tywx.tt.Utils.showWXVideo(param);
            }
        }
    },

    /*
        调用: 使用此model分享功能的时候 
        功能: 给好友或者群分享小程序的相关信息
        参数: [
            无
        ]
        返回值:[
            无
        ]
        思路: 逻辑需要
    */
    shareMiniApp: function shareMiniApp() {
        var self = this;
        tywx.tt.log("当前分享" + this.reactcall);
        if (this.reactcall) {
            self.successCallBack(this);
        } else {
            if (tywx.IsWechatPlatform()) {
                window.wx.showShareMenu({
                    withShareTicket: true
                });
                console.log("分享信息 " + this.shareConfig[0]);
                var msg = tywx.tt.Utils.getRandomShareConfigByShareTag(this.shareConfig[0]);
                if (!msg) {
                    msg = tywx.tt.constants.DefaultShareConfig;
                }
                if (msg) {
                    tywx.ShareInterface.share(msg.shareContent, msg.sharePicUrl, msg.sharePointId, msg.shareSchemeId, function (res) {
                        tywx.LOGE("分享成功后的数据" + JSON.stringify(res));
                        // * is share to group
                        if (self.shareConfig && self.shareConfig[1]) {
                            // * froce share to group
                            if (res.shareTickets !== undefined && res.shareTickets.length > 0) {
                                if (self.shareConfig[0] === tywx.tt.constants.ShareConfig.RANK_SHARE[0]) {
                                    self.successCallBack && self.successCallBack(res);
                                } else {
                                    tywx.tt.Utils.share2GroupByTicket(self.shareConfig[0], res, function () {
                                        // * success callback
                                        self.successCallBack && self.successCallBack(res);
                                    }, function () {
                                        // * failed callback
                                        //  tywx.tt.Utils.showWXModal('请分享到不同群');
                                        self.errorCallBack && self.errorCallBack(null);
                                    });
                                }
                            } else {
                                // * failed
                                //  tywx.tt.Utils.showWXModal('请分享到群');
                                self.errorCallBack && self.errorCallBack(null);
                            }
                        } else {
                            // * success
                            self.successCallBack && self.successCallBack(res);
                        }
                    }, function (data) {
                        tywx.LOGE("分享成功后的数2据" + JSON.stringify(data));
                        self.errorCallBack && self.errorCallBack(data);
                    });
                }
            }
        }
    }
    // update (dt) {},
});

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
        //# sourceMappingURL=ShareButton.js.map
        