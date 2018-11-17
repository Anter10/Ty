"use strict";
cc._RF.push(module, '07454mkA95BCbNsAVh/uaHo', 'tip_view');
// scripts/game/common/tip_view.js

"use strict";

var tip_view_path = "prefabs/tip_view";

var tip_view = cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: cc.Label,
        tapLabel: cc.Label,
        shareBtn: cc.Node,
        background: cc.Node
    },

    closeCall: function closeCall() {
        if (this.closeing) {
            return;
        }
        this.closeing = true;
        tywx.tt.Utils.showWXBanner();
        var call = function call() {
            tip_view.curnode.removeFromParent(true);
            tip_view.curnode = null;
        };
        var ani = tip_view.curnode.getComponent(cc.Animation);
        ani.on("finished", call, this);
        ani.play("hide_ui");
    },

    onLoad: function onLoad() {
        var self = this;
        this.background.getComponent("background").setTouchEndCall(function () {
            self.btnClose();
        });
    },


    btnClose: function btnClose() {
        this.closecall && this.closecall();
        this.closeCall();
    },

    /**
     * 初始化
     */
    init: function init() {
        var self = this;
        this.shareBtnScript = this.shareBtn.getComponent("ShareButton");
        this.shareBtnScript.setButtonCallType(1);
        this.shareBtnScript.setSuccessCall(function () {
            self.success();
            self.closeCall();
        });
    },

    /**
     * @description 设置按钮调用类型
     * @param {Number} calltype 1 分享 2视频
     */
    setCallType: function setCallType(calltype) {
        this.shareBtnScript.setButtonCallType(calltype);
        if (calltype == -1) {
            this.shareBtnScript.setReactCall(true);
        }
        if (tywx.tt.configManager.getInstance().auditing == true) {
            this.shareBtnScript.setReactCall(true);
        }
    },

    /**
     * @description 设置title
     * @param {String} title 
     */
    setTitle: function setTitle(title) {
        this.titleLabel.string = title;
    },

    /**
     * @description 设置提示内容
     * @param {String} tap 
     */
    setTap: function setTap(tap) {
        this.tapLabel.string = tap;
    },

    /**
     * @description 设置看视频或者分享的回调
     * @param {Function} success 看视频或分享成功后的回调
     */
    setSuccessCallBack: function setSuccessCallBack(success) {
        this.success = success;
    },

    /**
     * @description 设置看视频或者分享的回调
     * @param {Function} success 看视频或分享成功后的回调
     */
    setCloseCallBack: function setCloseCallBack(closecall) {
        this.closecall = closecall;
    },

    /**
     * @description 设置分享或者视频的类型
     * @param {Object} config 配置分享点的参数
     */
    setShareConfig: function setShareConfig(config) {
        this.shareBtnScript.setShareConfig(config);
    },

    start: function start() {},


    statics: {
        curnode: null,
        /**
         * @显示当前的提示页面信息
         * @param {Object} config 显示的相关配置参数
         * @summary 
         * config.success: Function 回调参数 
         * config.title: String 分享标题 
         * config.tip: String 提示类容 
         * config.config: Object 分享点的信息
         * calltype: Number 回调类型
         */
        show: function show(config) {
            if (tip_view.curnode) {
                return;
            }
            cc.loader.loadRes(tip_view_path, function (err, prefab) {
                if (!err) {
                    var tipview = cc.instantiate(prefab);
                    var ani = tipview.getComponent(cc.Animation);
                    ani.play("show_hide");
                    var tip_view_script = tipview.getComponent('tip_view');
                    tip_view_script.init();
                    tip_view_script.setTap(config.tip || "请设置提示类容");
                    tip_view_script.setTitle(config.title || "提示");
                    tip_view_script.setShareConfig(config.config);
                    tip_view_script.setSuccessCallBack(config.success);
                    tip_view_script.setCallType(config.calltype);
                    tip_view_script.setCloseCallBack(config.closecall);
                    tip_view.curnode = tipview;
                    tywx.tt.log("当前的VIE");
                    cc.director.getScene().addChild(tipview, 999999);
                }
            });
        }

        // update (dt) {},
    } });

module.exports = tip_view;

cc._RF.pop();