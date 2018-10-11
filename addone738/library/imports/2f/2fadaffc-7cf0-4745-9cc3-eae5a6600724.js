"use strict";
cc._RF.push(module, '2fada/8fPBHRZzD6uWmYAck', 'ShareButton');
// Script/models/ShareButton.js

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

        console.log("this.button" + this.button);
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
        if (this.calltype == 1) {
            this.shareMiniApp();
        } else {
            this.showWXVideo();
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
        if (this.reactcall) {
            self.successCallBack(this);
        } else {
            if (tywx.IsWechatPlatform()) {

                var param = {
                    success: function success(res) {
                        self.shareGroupCallBack && self.shareGroupCallBack(res);
                    },
                    fail: function fail(res) {
                        tywx.ado.Utils.showWXModal('观看视频失败');
                        self.errorCallBack && self.errorCallBack(null);
                    },
                    error_callback: function error_callback() {
                        if (self.shareConfig === tywx.ado.Constants.ShareConfig.GIFT_GIFT_BOX_SHARE || self.shareConfig === tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE) {
                            var content = self.shareConfig === tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE ? '免费复活机会' : '如意宝箱';
                            var end_str = self.shareConfig === tywx.ado.Constants.ShareConfig.RECOVER_GAME_SHARE ? '一次' : '一个';
                            content = '<color=#ffffff>\u8D60\u9001</c><color=#ff0000>' + content + '</color><color=#ffffff>' + end_str + '</c>';
                            tywx.ado.Utils.showErrorGfitPop(function () {
                                self.shareGroupCallBack && self.shareGroupCallBack(null);
                            }, content);
                        }
                    }
                };
                tywx.ado.Utils.showWXVideo(param);
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
        console.log("当前分享" + this.reactcall);
        if (this.reactcall) {
            self.successCallBack(this);
        } else {
            if (tywx.IsWechatPlatform()) {
                window.wx.showShareMenu({ withShareTicket: true });
                var msg = tywx.ado.Utils.getRandomShareConfigByShareTag(this.shareConfig[0]);
                if (!msg) {
                    msg = {};
                    msg.shareContent = "你知道" + "+1 吗？";
                    msg.sharePicUrl = "https://marketqn.nalrer.cn/teris/share_image/jiayi/jy03.jpg";
                    msg.sharePointId = "766";
                    msg.shareSchemeId = "1155";
                }
                if (msg) {
                    tywx.ShareInterface.share(msg.shareContent, msg.sharePicUrl, msg.sharePointId, msg.shareSchemeId, function (res) {
                        tywx.LOGE("分享成功后的数据" + JSON.stringify(res));
                        // * is share to group
                        if (self.shareConfig && self.shareConfig[1]) {
                            // * froce share to group
                            if (res.shareTickets !== undefined && res.shareTickets.length > 0) {
                                if (self.shareConfig[0] === tywx.ado.Constants.ShareConfig.RANK_SHARE[0]) {
                                    self.shareGroupCallBack && self.shareGroupCallBack(res);
                                } else {
                                    tywx.ado.Utils.share2GroupByTicket(self.shareConfig[0], res, function () {
                                        // * success callback
                                        self.shareGroupCallBack && self.shareGroupCallBack(res);
                                    }, function () {
                                        // * failed callback
                                        tywx.ado.Utils.showWXModal('请分享到不同群');
                                        self.errorCallBack && self.errorCallBack(null);
                                    });
                                }
                            } else {
                                // * failed
                                tywx.ado.Utils.showWXModal('请分享到群');
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